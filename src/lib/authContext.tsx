import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
  institution?: string;
  degree?: string;
  stateQuota?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  enterGuestMode: () => void;
  updateUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Maps Firebase Auth error codes to helpful, user-friendly messages.
 */
export function mapAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify and try again.';
    case 'auth/user-not-found':
      return 'No account exists with this email address. Please create an account.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters with letters and numbers.';
    case 'auth/invalid-email':
      return 'Please provide a valid institutional or personal email address.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email via a different provider (Google or Facebook). Please sign in with that provider.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups or try again.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Please reset password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet in Firebase Console. Please refer to SETUP.md.';
    default:
      return err?.message || 'Authentication error. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return sessionStorage.getItem('digi_is_guest') === 'true';
  });

  // Sync profile document in Firestore
  const syncUserDoc = async (firebaseUser: User) => {
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Student',
      photoURL: firebaseUser.photoURL,
      isGuest: false,
    };

    setProfile(userProfile);

    // Save/update to Firestore if available
    if (db) {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          });
        } else {
          const existing = snap.data();
          setProfile({
            ...userProfile,
            ...existing,
            uid: firebaseUser.uid,
          });
          await setDoc(
            userRef,
            { lastLoginAt: serverTimestamp() },
            { merge: true }
          );
        }
      } catch (e) {
        console.warn('Firestore user profile sync error (local fallback):', e);
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        sessionStorage.removeItem('digi_is_guest');
        await syncUserDoc(currentUser);
      } else if (isGuest) {
        setProfile({
          uid: 'guest_user',
          email: 'guest@student.demo',
          displayName: 'Guest Student',
          photoURL: null,
          isGuest: true,
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  // Google sign in
  const handleGoogleSignIn = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else {
        throw popupErr;
      }
    }
  };

  // Facebook sign in (Facebook App ID: 3418668748341022 - no secret in client)
  const handleFacebookSignIn = async () => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    const provider = new FacebookAuthProvider();
    provider.setCustomParameters({ display: 'popup' });
    try {
      await signInWithPopup(auth, provider);
    } catch (popupErr: any) {
      if (popupErr.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, provider);
      } else {
        throw popupErr;
      }
    }
  };

  // Email/password sign in
  const handleEmailSignIn = async (email: string, pass: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // Email/password sign up
  const handleEmailSignUp = async (email: string, pass: string, displayName: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    try {
      await sendEmailVerification(cred.user);
    } catch {
      // Non-blocking
    }
    await syncUserDoc(cred.user);
  };

  // Reset password
  const handleResetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth is not initialized.');
    await sendPasswordResetEmail(auth, email);
  };

  // Sign out
  const handleLogout = async () => {
    setIsGuest(false);
    sessionStorage.removeItem('digi_is_guest');
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setProfile(null);
  };

  // Guest demo mode
  const enterGuestMode = () => {
    setIsGuest(true);
    sessionStorage.setItem('digi_is_guest', 'true');
    setProfile({
      uid: 'guest_user',
      email: 'guest@student.demo',
      displayName: 'Guest Student',
      photoURL: null,
      isGuest: true,
    });
  };

  const updateUserProfileData = async (data: Partial<UserProfile>) => {
    setProfile(prev => (prev ? { ...prev, ...data } : null));
    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, data, { merge: true });
      } catch (err) {
        console.warn('Error updating profile in Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest,
        signInWithGoogle: handleGoogleSignIn,
        signInWithFacebook: handleFacebookSignIn,
        signInWithEmail: handleEmailSignIn,
        signUpWithEmail: handleEmailSignUp,
        resetPassword: handleResetPassword,
        logout: handleLogout,
        enterGuestMode,
        updateUserProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
