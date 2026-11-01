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
  getRedirectResult,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isConfigured } from './firebase';
import { localAuth, LocalUser } from './localAuth';

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
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  isCloudConfigured: boolean;
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
 * Helper to detect if a Firebase error is caused by missing, disabled, or unconfigured cloud setup
 */
function isFirebaseConfigIssue(err: any): boolean {
  const code = err?.code || '';
  return (
    code === 'auth/invalid-api-key' ||
    code === 'auth/api-key-not-valid' ||
    code === 'auth/operation-not-allowed' ||
    code === 'auth/unauthorized-domain' ||
    code === 'auth/configuration-not-found' ||
    code === 'auth/admin-restricted-operation'
  );
}

/**
 * Maps Auth error codes to helpful, user-friendly messages.
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
      return 'An account already exists with this email via a different provider. Please sign in with that provider.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups or try again.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Please reset password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Cloud auth is in offline fallback mode. Instant local authentication is active.';
    case 'auth/unauthorized-domain':
      return 'Domain not authorized in cloud settings. Local authentication is active.';
    default:
      return err?.message || 'Authentication error. Please try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return sessionStorage.getItem('digi_is_guest') === 'true';
  });

  // Sync profile document in Firestore or LocalStorage
  const syncUserDoc = async (authUser: any) => {
    const userProfile: UserProfile = {
      uid: authUser.uid,
      email: authUser.email,
      displayName: authUser.displayName || authUser.email?.split('@')[0] || 'Student',
      photoURL: authUser.photoURL,
      isGuest: false,
    };

    setProfile(userProfile);

    // Save/update to Firestore if cloud backend is configured
    if (isConfigured && db && authUser.uid && !authUser.isLocal) {
      try {
        const userRef = doc(db, 'users', authUser.uid);
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
            uid: authUser.uid,
          });
          await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
        }
      } catch (e) {
        console.warn('Firestore user profile sync warning (local cache active):', e);
      }
    }
  };

  useEffect(() => {
    // 1. Check local session cache first
    const cachedLocalUser = localAuth.getCurrentUser();
    if (cachedLocalUser) {
      setUser(cachedLocalUser);
      setIsGuest(false);
      setProfile({
        uid: cachedLocalUser.uid,
        email: cachedLocalUser.email,
        displayName: cachedLocalUser.displayName || 'Student',
        photoURL: cachedLocalUser.photoURL,
        isGuest: false,
      });
      setLoading(false);
    }

    // 2. If Firebase cloud auth is configured, bind listeners
    if (isConfigured && auth) {
      getRedirectResult(auth)
        .then(async result => {
          if (result?.user) {
            setUser(result.user);
            setIsGuest(false);
            sessionStorage.removeItem('digi_is_guest');
            await syncUserDoc(result.user);
          }
        })
        .catch(err => {
          console.warn('Redirect sign-in resolution:', err?.message);
        });

      const unsubscribe = onAuthStateChanged(auth, async currentUser => {
        if (currentUser) {
          setUser(currentUser);
          setIsGuest(false);
          sessionStorage.removeItem('digi_is_guest');
          await syncUserDoc(currentUser);
        } else if (!localAuth.getCurrentUser()) {
          if (isGuest) {
            setUser(null);
            setProfile({
              uid: 'guest_user',
              email: 'guest@student.demo',
              displayName: 'Guest Student',
              photoURL: null,
              isGuest: true,
            });
          } else {
            setUser(null);
            setProfile(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Unconfigured / local mode
      if (!cachedLocalUser) {
        if (isGuest) {
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
      }
      setLoading(false);
    }
  }, [isGuest]);

  // Google sign in with seamless fallback
  const handleGoogleSignIn = async () => {
    if (isConfigured && auth) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try {
        await signInWithPopup(auth, provider);
        return;
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked') {
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch {
            // Proceed to local fallback
          }
        }
        // If API key is unconfigured or blocked by cloud settings, fall back locally
        if (isFirebaseConfigIssue(popupErr)) {
          console.warn('Cloud Auth unconfigured, switching to instant local Google session:', popupErr.message);
          const localUser = localAuth.signInWithGoogle();
          setUser(localUser);
          await syncUserDoc(localUser);
          return;
        }
        throw popupErr;
      }
    }

    // Direct local mode
    const localUser = localAuth.signInWithGoogle();
    setUser(localUser);
    await syncUserDoc(localUser);
  };

  // Facebook sign in
  const handleFacebookSignIn = async () => {
    if (isConfigured && auth) {
      const provider = new FacebookAuthProvider();
      provider.setCustomParameters({ display: 'popup' });
      try {
        await signInWithPopup(auth, provider);
        return;
      } catch (popupErr: any) {
        if (popupErr.code === 'auth/popup-blocked') {
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch {
            // Fall through
          }
        }
        if (isFirebaseConfigIssue(popupErr)) {
          const localUser = localAuth.signInWithFacebook();
          setUser(localUser);
          await syncUserDoc(localUser);
          return;
        }
        throw popupErr;
      }
    }

    const localUser = localAuth.signInWithFacebook();
    setUser(localUser);
    await syncUserDoc(localUser);
  };

  // Email/password sign in
  const handleEmailSignIn = async (email: string, pass: string) => {
    if (isConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        return;
      } catch (err: any) {
        if (isFirebaseConfigIssue(err)) {
          console.warn('Cloud Auth unconfigured, falling back to local credentials:', err.message);
          const localUser = localAuth.signInWithEmail(email, pass);
          setUser(localUser);
          await syncUserDoc(localUser);
          return;
        }
        throw err;
      }
    }

    // Direct local mode
    const localUser = localAuth.signInWithEmail(email, pass);
    setUser(localUser);
    await syncUserDoc(localUser);
  };

  // Email/password sign up
  const handleEmailSignUp = async (email: string, pass: string, displayName: string) => {
    if (isConfigured && auth) {
      try {
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
        return;
      } catch (err: any) {
        if (isFirebaseConfigIssue(err)) {
          console.warn('Cloud Auth unconfigured, registering locally:', err.message);
          const localUser = localAuth.signUpWithEmail(email, pass, displayName);
          setUser(localUser);
          await syncUserDoc(localUser);
          return;
        }
        throw err;
      }
    }

    // Direct local mode
    const localUser = localAuth.signUpWithEmail(email, pass, displayName);
    setUser(localUser);
    await syncUserDoc(localUser);
  };

  // Reset password
  const handleResetPassword = async (email: string) => {
    if (isConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return;
      } catch (err: any) {
        if (isFirebaseConfigIssue(err)) {
          localAuth.resetPassword(email);
          return;
        }
        throw err;
      }
    }

    localAuth.resetPassword(email);
  };

  // Sign out
  const handleLogout = async () => {
    setIsGuest(false);
    sessionStorage.removeItem('digi_is_guest');
    localAuth.signOut();
    if (isConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Signout warning:', err);
      }
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
    if (isConfigured && user && db && !user.isLocal) {
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
        isCloudConfigured: isConfigured,
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
