import { ChecklistItem } from '../types';

/**
 * Pre-cached authentic Tamil translations for bundled demo checklist items.
 */
const PRE_CACHED_DEMO_TRANSLATIONS: Record<
  string,
  {
    title: string;
    reason: string;
    suggestedAction: string;
    whereToVerify: string;
  }
> = {
  'chk-1': {
    title: 'வருவாய்த் துறை வட்டாட்சியர் (தாசில்தார்) வருமானச் சான்றிதழை உடனடியாகப் பெறவும்',
    reason: 'மாநில அதிகாரிகள் தனியார் நிறுவன சம்பளச் சீட்டு அல்லது படிவம் 16-ஐ நிராகரிப்பார்கள். அரசு வருமானச் சான்றிதழ் பெற 7-14 வேலை நாட்கள் ஆகும்.',
    suggestedAction: 'உள்ளூர் இ-சேவை மையம் அல்லது தாலுகா அலுவலகத்திற்குச் சென்று 2026-27 நிதியாண்டுக்கான வருமானச் சான்றிதழை விண்ணப்பிக்கவும்.',
    whereToVerify: 'மாவட்ட தாலுகா அலுவலகம் / தமிழ்நாடு இ-சேவை மையம்',
  },
  'chk-2': {
    title: 'தேசிய போர்ட்டலில் அக்டோபர் 28-க்குள் சமர்ப்பிக்கவும் (நவம்பர் 15 வரை காத்திருக்க வேண்டாம்)',
    reason: 'கல்லூரி நோடல் அதிகாரி இணைய சரிபார்ப்பு அக்டோபர் 31-ல் நிறைவடைகிறது. அக்டோபர் 28-க்குப் பிறகு சமர்ப்பித்தால் கல்லூரியில் சரிபார்க்க முடியாது.',
    suggestedAction: 'அக்டோபர் 28-க்குள் ஆன்லைன் படிவத்தை சமர்ப்பித்து அதன் நகலை கல்லூரி உதவித்தொகை பிரிவில் சமர்ப்பிக்கவும்.',
    whereToVerify: 'கல்லூரி உதவித்தொகை பிரிவு / நோடல் அதிகாரி',
  },
  'chk-3': {
    title: 'உதவித்தொகை புதுப்பித்தலுக்கான குறைந்தபட்ச CGPA விதிமுறையை கல்வி முதல்வரிடம் உறுதிப்படுத்தவும்',
    reason: 'அதிகாரப்பூர்வ சுற்றறிக்கையில் 2-ஆம் ஆண்டு புதுப்பித்தல் விதிமுறைகள் விடுபட்டுள்ளன (Digital Dark Spot). இதனால் அடுத்த ஆண்டு உதவித்தொகை ரத்தாக வாய்ப்புள்ளது.',
    suggestedAction: 'கல்லூரி நிர்வாக அதிகாரியிடம் நிறுவன புதுப்பித்தல் நிபந்தனை சுற்றறிக்கையைக் கேட்டுப் பெறவும்.',
    whereToVerify: 'மாணவர் நல முதல்வர் அலுவலகம் (Dean of Student Affairs)',
  },
  'chk-4': {
    title: 'வங்கி கணக்கில் ஆதார் NPCI இணைப்பு உள்ளதா என உறுதிப்படுத்தவும்',
    reason: 'வங்கி கணக்கு NPCI ஆதார் பிரிட்ஜில் இணைக்கப்படவில்லை எனில் DBT நேரடி பணப்பரிமாற்றம் தோல்வியடையும்.',
    suggestedAction: 'UIDAI போர்டல் அல்லது உங்கள் சொந்த வங்கி கிளை மூலம் NPCI ஆதார் விதைப்பு நிலையை சரிபார்க்கவும்.',
    whereToVerify: 'UIDAI ஆதார் விதைப்பு போர்டல் / வங்கி கிளை',
  },
  'chk-5': {
    title: 'கல்லூரி பயிலும் முறை குறிப்பிடப்பட்ட அதிகாரப்பூர்வ போனஃபைட் சான்றிதழைப் பெறவும்',
    reason: 'முழுநேர பட்டப்படிப்பு மாணவர்களுக்கு மட்டுமே நேரடி அரசு மானியம் (DBT) மற்றும் கல்விக் கட்டண விலக்கு பொருந்தும்.',
    suggestedAction: 'கல்லூரி முதல்வரிடம் முழுநேரப் படிப்புக்கான சான்றிதழை முன்கூட்டியே பெற்று பதிவேற்றவும்.',
    whereToVerify: 'கல்லூரி நிர்வாகப் பிரிவு / முதல்வர் அலுவலகம்',
  },
};

/**
 * Common keyword replacement dictionary for dynamic checklists.
 */
const TAMIL_DICTIONARY: Array<[RegExp, string]> = [
  [/Apply for/gi, 'விண்ணப்பிக்கவும்:'],
  [/Submit application/gi, 'விண்ணப்பத்தை சமர்ப்பிக்கவும்:'],
  [/Verify/gi, 'சரிபார்க்கவும்:'],
  [/Clarify/gi, 'தெளிவுபடுத்தவும்:'],
  [/Obtain/gi, 'பெறவும்:'],
  [/Confirm/gi, 'உறுதிப்படுத்தவும்:'],
  [/Check/gi, 'ஆராயவும்:'],
  [/Income Certificate/gi, 'வருமானச் சான்றிதழ்'],
  [/Transfer Certificate/gi, 'மாற்றுச் சான்றிதழ் (TC)'],
  [/Migration Certificate/gi, 'இடப்பெயர்வு சான்றிதழ்'],
  [/Conduct Certificate/gi, 'நன்னடத்தை சான்றிதழ்'],
  [/Bonafide Certificate/gi, 'போனஃபைட் சான்றிதழ்'],
  [/Community Certificate/gi, 'சாதிச் சான்றிதழ்'],
  [/Nativity Certificate/gi, 'இருப்பிடச் சான்றிதழ்'],
  [/College Nodal Officer/gi, 'கல்லூரி நோடல் அதிகாரி'],
  [/Helpdesk/gi, 'உதவி மையம்'],
  [/Deadline/gi, 'கடைசி தேதி'],
  [/Cut-off/gi, 'கடைசி நாள்'],
  [/Scholarship/gi, 'கல்வி உதவித்தொகை'],
  [/Admission/gi, 'சேர்க்கை'],
  [/Exam/gi, 'தேர்வு'],
  [/Internship/gi, 'பயிற்சி (Internship)'],
  [/District Collectorate/gi, 'மாவட்ட ஆட்சியர் அலுவலகம்'],
  [/Taluk Office/gi, 'வட்டாட்சியர் அலுவலகம்'],
  [/National Scholarship Portal/gi, 'தேசிய உதவித்தொகை போர்டல் (NSP)'],
  [/State Higher Education/gi, 'மாநில உயர்கல்வித் துறை'],
];

/**
 * Translates an arbitrary English phrase into Tamil using the dictionary and rule patterns.
 */
function translatePhrase(text: string): string {
  if (!text) return '';
  let translated = text;
  for (const [regex, replacement] of TAMIL_DICTIONARY) {
    translated = translated.replace(regex, replacement);
  }
  return translated;
}

export interface TranslatedChecklistItem extends ChecklistItem {
  isTamilApplied?: boolean;
}

/**
 * Returns a translated ChecklistItem in Tamil (either pre-cached or dictionary-translated).
 */
export function getTranslatedChecklistItem(
  item: ChecklistItem,
  language: 'en' | 'ta'
): TranslatedChecklistItem {
  if (language === 'en') {
    return { ...item, isTamilApplied: false };
  }

  // Check pre-cached items first
  const preCached = PRE_CACHED_DEMO_TRANSLATIONS[item.id];
  if (preCached) {
    return {
      ...item,
      title: preCached.title,
      reason: preCached.reason,
      suggestedAction: preCached.suggestedAction,
      whereToVerify: preCached.whereToVerify,
      isTamilApplied: true,
    };
  }

  // Fallback translation via dictionary
  return {
    ...item,
    title: translatePhrase(item.title),
    reason: translatePhrase(item.reason),
    suggestedAction: translatePhrase(item.suggestedAction),
    whereToVerify: item.whereToVerify ? translatePhrase(item.whereToVerify) : undefined,
    isTamilApplied: true,
  };
}
