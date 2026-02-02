/**
 * IPA (International Phonetic Alphabet) to Korean (Hangul) pronunciation converter
 *
 * Features:
 * - Long vowels (ː) are marked with dash (-) and split syllables
 * - Consonant-only sequences use compatibility Jamo (ㄱㄴㄷ...)
 * - Vowel+consonant combinations form complete Hangul syllables
 *
 * Example:
 * /wɜːrld/ → 워-ㄹㄷ
 * /hɛloʊ/ → 헤로
 */

// ============================================================================
// CONSTANTS & MAPPINGS
// ============================================================================

// Choseong (초성) consonants
const CHOSEONG = {
  GIYEOK: 0, SSANGGIYEOK: 1, NIEUN: 2, DIGEUT: 3, SSANGDIGEUT: 4,
  RIEUL: 5, MIEUM: 6, BIEUP: 7, SSANGBIEUP: 8, SIOS: 9, SSANGSIOS: 10,
  IEUNG: 11, JIEUT: 12, SSANGJIEUT: 13, CHIEUT: 14, KIEUK: 15,
  TIEUT: 16, PIEUP: 17, HIEUT: 18,
} as const;

// Jungseong (중성) vowels
const JUNGSEONG = {
  A: 0, AE: 1, YA: 2, YAE: 3, EO: 4, E: 5, YEO: 6, YE: 7,
  O: 8, WA: 9, WAE: 10, OE: 11, YO: 12, U: 13, WO: 14, WE: 15,
  WI: 16, YU: 17, EU: 18, UI: 19, I: 20,
} as const;

// Jongseong (종성) final consonants
const JONGSEONG = {
  NONE: 0, GIYEOK: 1, NIEUN: 4, DIGEUT: 7, RIEUL: 8,
  MIEUM: 16, BIEUP: 17, SIOS: 19, IEUNG: 21, JIEUT: 22,
  CHIEUT: 23, KIEUK: 24, TIEUT: 25, PIEUP: 26,
} as const;

// Compatibility Jamo (호환용 자모) for consonant-only sequences
const COMPAT_JAMO: Record<string, string> = {
  'ㄱ': '\u3131', 'ㄲ': '\u3132', 'ㄴ': '\u3134', 'ㄷ': '\u3137',
  'ㄹ': '\u3139', 'ㅁ': '\u3141', 'ㅂ': '\u3142', 'ㅅ': '\u3145',
  'ㅆ': '\u3146', 'ㅇ': '\u3147', 'ㅈ': '\u3148', 'ㅊ': '\u314A',
  'ㅋ': '\u314B', 'ㅌ': '\u314C', 'ㅍ': '\u314D', 'ㅎ': '\u314E',
};

// IPA consonant → Choseong index
const CONSONANT_TO_CHOSEONG: Record<string, number> = {
  'p': CHOSEONG.PIEUP, 'b': CHOSEONG.BIEUP, 't': CHOSEONG.TIEUT,
  'd': CHOSEONG.DIGEUT, 'k': CHOSEONG.KIEUK, 'g': CHOSEONG.GIYEOK,
  'm': CHOSEONG.MIEUM, 'n': CHOSEONG.NIEUN, 'ŋ': CHOSEONG.IEUNG,
  'f': CHOSEONG.PIEUP, 'v': CHOSEONG.BIEUP, 'θ': CHOSEONG.SIOS,
  'ð': CHOSEONG.DIGEUT, 's': CHOSEONG.SIOS, 'z': CHOSEONG.JIEUT,
  'ʃ': CHOSEONG.SIOS, 'ʒ': CHOSEONG.JIEUT, 'h': CHOSEONG.HIEUT,
  'tʃ': CHOSEONG.CHIEUT, 'dʒ': CHOSEONG.JIEUT,
  'l': CHOSEONG.RIEUL, 'r': CHOSEONG.RIEUL, 'ɹ': CHOSEONG.RIEUL,
  'w': CHOSEONG.IEUNG, 'j': CHOSEONG.IEUNG,
};

// IPA consonant → Jongseong index
const CONSONANT_TO_JONGSEONG: Record<string, number> = {
  'p': JONGSEONG.BIEUP, 'b': JONGSEONG.BIEUP, 't': JONGSEONG.TIEUT,
  'd': JONGSEONG.DIGEUT, 'k': JONGSEONG.KIEUK, 'g': JONGSEONG.GIYEOK,
  'm': JONGSEONG.MIEUM, 'n': JONGSEONG.NIEUN, 'ŋ': JONGSEONG.IEUNG,
  'f': JONGSEONG.PIEUP, 'v': JONGSEONG.BIEUP, 'θ': JONGSEONG.SIOS,
  'ð': JONGSEONG.DIGEUT, 's': JONGSEONG.SIOS, 'z': JONGSEONG.JIEUT,
  'ʃ': JONGSEONG.SIOS, 'ʒ': JONGSEONG.JIEUT,
  'l': JONGSEONG.RIEUL, 'r': JONGSEONG.RIEUL, 'ɹ': JONGSEONG.RIEUL,
  'tʃ': JONGSEONG.CHIEUT, 'dʒ': JONGSEONG.JIEUT,
};

// IPA consonant → Compatibility Jamo
const CONSONANT_TO_JAMO: Record<string, string> = {
  'p': COMPAT_JAMO['ㅍ'], 'b': COMPAT_JAMO['ㅂ'], 't': COMPAT_JAMO['ㅌ'],
  'd': COMPAT_JAMO['ㄷ'], 'k': COMPAT_JAMO['ㅋ'], 'g': COMPAT_JAMO['ㄱ'],
  'm': COMPAT_JAMO['ㅁ'], 'n': COMPAT_JAMO['ㄴ'], 'ŋ': COMPAT_JAMO['ㅇ'],
  'f': COMPAT_JAMO['ㅍ'], 'v': COMPAT_JAMO['ㅂ'], 'θ': COMPAT_JAMO['ㅅ'],
  'ð': COMPAT_JAMO['ㄷ'], 's': COMPAT_JAMO['ㅅ'], 'z': COMPAT_JAMO['ㅈ'],
  'ʃ': COMPAT_JAMO['ㅅ'], 'ʒ': COMPAT_JAMO['ㅈ'], 'h': COMPAT_JAMO['ㅎ'],
  'l': COMPAT_JAMO['ㄹ'], 'r': COMPAT_JAMO['ㄹ'], 'ɹ': COMPAT_JAMO['ㄹ'],
  'tʃ': COMPAT_JAMO['ㅊ'], 'dʒ': COMPAT_JAMO['ㅈ'],
};

// IPA vowel → Jungseong indices (can be array for diphthongs)
const VOWEL_TO_JUNGSEONG: Record<string, number[]> = {
  // Semi-vowel + vowel combinations
  'wɜː': [JUNGSEONG.WO], 'wɜ': [JUNGSEONG.WO], 'wə': [JUNGSEONG.WO],
  'wɝ': [JUNGSEONG.WO], 'wɔː': [JUNGSEONG.WO], 'wɔ': [JUNGSEONG.WO],
  'wɑː': [JUNGSEONG.WA], 'wɑ': [JUNGSEONG.WA], 'wɪ': [JUNGSEONG.WI],
  'wi': [JUNGSEONG.WI], 'weɪ': [JUNGSEONG.WE],
  'juː': [JUNGSEONG.YU], 'ju': [JUNGSEONG.YU], 'jə': [JUNGSEONG.YEO],
  'jɛ': [JUNGSEONG.YEO], 'jɑː': [JUNGSEONG.YA], 'jɑ': [JUNGSEONG.YA],
  'jɔː': [JUNGSEONG.YO], 'jɔ': [JUNGSEONG.YO], 'ji': [JUNGSEONG.I],
  'jɪ': [JUNGSEONG.I],
  // Simple vowels
  'iː': [JUNGSEONG.I], 'i': [JUNGSEONG.I], 'ɪ': [JUNGSEONG.I],
  'e': [JUNGSEONG.E], 'ɛ': [JUNGSEONG.E], 'æ': [JUNGSEONG.AE],
  'ɑː': [JUNGSEONG.A], 'ɑ': [JUNGSEONG.A], 'ɒ': [JUNGSEONG.O],
  'ɔː': [JUNGSEONG.O], 'ɔ': [JUNGSEONG.O], 'ʌ': [JUNGSEONG.EO],
  'ə': [JUNGSEONG.EO], 'ɜː': [JUNGSEONG.EO], 'ɜ': [JUNGSEONG.EO],
  'ɝ': [JUNGSEONG.EO], 'ʊ': [JUNGSEONG.U], 'uː': [JUNGSEONG.U],
  'u': [JUNGSEONG.U],
  // Diphthongs
  'eɪ': [JUNGSEONG.E, JUNGSEONG.I], 'aɪ': [JUNGSEONG.A, JUNGSEONG.I],
  'ɔɪ': [JUNGSEONG.O, JUNGSEONG.I], 'aʊ': [JUNGSEONG.A, JUNGSEONG.U],
  'əʊ': [JUNGSEONG.O], 'oʊ': [JUNGSEONG.O],
  'ɪə': [JUNGSEONG.I, JUNGSEONG.EO], 'eə': [JUNGSEONG.E, JUNGSEONG.EO],
  'ʊə': [JUNGSEONG.U, JUNGSEONG.EO],
};

// ============================================================================
// TYPES
// ============================================================================

type TokenType = 'consonant' | 'vowel';
type StressLevel = 'primary' | 'secondary' | 'none';

interface Token {
  type: TokenType;
  ipa: string;
  length: number;
}

interface SyllableInfo {
  text: string;
  stress: StressLevel;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Assemble a Hangul syllable from Jamo components
 */
function assembleHangul(cho: number, jung: number, jong: number = JONGSEONG.NONE): string {
  const code = 0xAC00 + (cho * 588) + (jung * 28) + jong;
  return String.fromCharCode(code);
}

/**
 * Check if IPA sequence at position is a vowel
 */
function matchVowel(text: string, pos: number): string | null {
  // Try longer matches first (4 chars → 3 chars → 2 chars → 1 char)
  for (let len = 4; len >= 1; len--) {
    const substr = text.substring(pos, pos + len);
    if (VOWEL_TO_JUNGSEONG[substr]) {
      return substr;
    }
  }
  return null;
}

/**
 * Check if IPA sequence at position is a consonant
 */
function matchConsonant(text: string, pos: number): string | null {
  // Try 2-char consonants first (tʃ, dʒ)
  const twoChar = text.substring(pos, pos + 2);
  if (CONSONANT_TO_CHOSEONG[twoChar] || CONSONANT_TO_JAMO[twoChar]) {
    return twoChar;
  }

  // Try single char
  const oneChar = text[pos];
  if (CONSONANT_TO_CHOSEONG[oneChar] || CONSONANT_TO_JAMO[oneChar]) {
    return oneChar;
  }

  return null;
}

// ============================================================================
// PREPROCESSING
// ============================================================================

/**
 * Preprocess IPA string: remove optional sounds, preserve stress markers
 * Returns string with stress markers converted to special tokens
 */
function preprocessIPA(ipa: string): string {
  return ipa
    .replace(/\([^)]*\)/g, '')  // Remove optional sounds in parentheses
    .replace(/[\/\[\]]/g, '')  // Remove brackets and slashes first
    .replace(/ˈ/g, '.[P]')  // Primary stress → .[P]
    .replace(/ˌ/g, '.[S]')  // Secondary stress → .[S]
    .replace(/[′']/g, '.')  // Other stress markers → plain boundary
    .replace(/\.+/g, '.')  // Normalize multiple dots to single dot
    .replace(/^\./g, '')  // Remove leading dot
    .trim();
}

/**
 * Check if IPA text contains any vowel characters
 */
function hasIPAVowel(text: string): boolean {
  return /[iɪeɛæɑɒɔʌəɜɝʊuoa]/.test(text);
}

/**
 * Parse syllables with stress information
 * Input format: "text1.[P]text2.[S]text3.text4"
 *
 * Also merges consonant-only unstressed syllables into the following stressed syllable.
 * This handles onset consonants separated by the stress marker in IPA notation:
 * e.g., /rˈɛtɜrɪk/ → "r.[P]ɛtɜrɪk" → [{r, none}, {ɛtɜrɪk, primary}]
 *       → merged: [{rɛtɜrɪk, primary}] → "레터릭" instead of "ㄹ에터릭"
 */
function parseSyllables(text: string): SyllableInfo[] {
  const syllables: SyllableInfo[] = [];
  const parts = text.split('.');

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('[P]')) {
      syllables.push({ text: part.slice(3), stress: 'primary' });
    } else if (part.startsWith('[S]')) {
      syllables.push({ text: part.slice(3), stress: 'secondary' });
    } else {
      syllables.push({ text: part, stress: 'none' });
    }
  }

  // Merge consonant-only unstressed syllables into following stressed syllables
  // In IPA, onset consonants before a stress marker belong to the stressed syllable
  const merged: SyllableInfo[] = [];
  for (let i = 0; i < syllables.length; i++) {
    const curr = syllables[i];
    const next = syllables[i + 1];

    if (next && next.stress !== 'none' && curr.stress === 'none' && !hasIPAVowel(curr.text)) {
      next.text = curr.text + next.text;
      continue;
    }
    merged.push(curr);
  }

  return merged;
}

/**
 * Split text by long vowel marker (ː), preserving the marker position
 * Returns segments with long vowel info
 */
function splitByLongVowel(text: string): Array<{ text: string; hasLongVowel: boolean }> {
  const segments: Array<{ text: string; hasLongVowel: boolean }> = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    if (text[i] === 'ː') {
      // End current segment with long vowel marker
      if (current) {
        segments.push({ text: current, hasLongVowel: true });
        current = '';
      }
    } else {
      current += text[i];
    }
  }

  // Add final segment (no long vowel)
  if (current) {
    segments.push({ text: current, hasLongVowel: false });
  }

  return segments;
}

// ============================================================================
// TOKENIZATION
// ============================================================================

/**
 * Tokenize a segment into consonants and vowels
 */
function tokenizeSegment(segment: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < segment.length) {
    // Try vowel first
    const vowel = matchVowel(segment, i);
    if (vowel) {
      tokens.push({ type: 'vowel', ipa: vowel, length: vowel.length });
      i += vowel.length;
      continue;
    }

    // Try consonant
    const consonant = matchConsonant(segment, i);
    if (consonant) {
      tokens.push({ type: 'consonant', ipa: consonant, length: consonant.length });
      i += consonant.length;
      continue;
    }

    // Unknown character, skip
    i++;
  }

  return tokens;
}

// ============================================================================
// SEGMENT CONVERSION
// ============================================================================

/**
 * Convert a tokenized segment to Hangul
 *
 * Rules:
 * - Consonant + Vowel → Full Hangul syllable
 * - Consonant only → Compatibility Jamo (ㄱㄴㄷ...)
 * - Handle final consonants (jongseong)
 */
function convertSegment(tokens: Token[]): string {
  const result: string[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // Case 1: Consonant followed by vowel → Hangul syllable
    if (token.type === 'consonant' && i + 1 < tokens.length && tokens[i + 1].type === 'vowel') {
      const consonant = token.ipa;
      let vowel = tokens[i + 1].ipa;

      // Special handling for ʃ (sh) - convert vowels to y-series for palatalization
      if (consonant === 'ʃ') {
        const shVowelMap: Record<string, string> = {
          'ə': 'jə',  // ʃə → 셔 (shə like in -tion)
          'ɜː': 'jɜː', 'ɜ': 'jɜ', 'ʌ': 'jə',
          'a': 'ja', 'ɑː': 'jɑː', 'ɑ': 'jɑ',  // ʃa → 샤
          'o': 'jo', 'ɔː': 'jɔː', 'ɔ': 'jɔ',  // ʃo → 쇼
          'u': 'ju', 'uː': 'juː', 'ʊ': 'ju',  // ʃu → 슈
        };

        if (shVowelMap[vowel]) {
          vowel = shVowelMap[vowel];
        }
      }

      const choIdx = CONSONANT_TO_CHOSEONG[consonant];
      const jungIndices = VOWEL_TO_JUNGSEONG[vowel];

      if (choIdx !== undefined && jungIndices) {
        // Check for final consonant (jongseong)
        let jongIdx: number = JONGSEONG.NONE;
        let consumed = 2;

        if (i + 2 < tokens.length && tokens[i + 2].type === 'consonant') {
          const nextCons = tokens[i + 2].ipa;
          const jongMapping = CONSONANT_TO_JONGSEONG[nextCons];

          // Check if there's a vowel after this consonant
          const hasVowelAfter = i + 3 < tokens.length && tokens[i + 3].type === 'vowel';

          if (jongMapping !== undefined && !hasVowelAfter) {
            // Use as jongseong
            jongIdx = jongMapping;
            consumed = 3;
          }
        }

        // Assemble syllable(s)
        if (jungIndices.length === 1) {
          // Simple vowel
          result.push(assembleHangul(choIdx, jungIndices[0], jongIdx));
        } else {
          // Diphthong - split into two syllables
          result.push(assembleHangul(choIdx, jungIndices[0], JONGSEONG.NONE));
          result.push(assembleHangul(CHOSEONG.IEUNG, jungIndices[1], jongIdx));
        }

        i += consumed;
        continue;
      }
    }

    // Case 2: Vowel without consonant → Use ㅇ as choseong
    if (token.type === 'vowel') {
      const vowel = token.ipa;
      const jungIndices = VOWEL_TO_JUNGSEONG[vowel];

      if (jungIndices) {
        // Check for final consonant
        let jongIdx: number = JONGSEONG.NONE;
        let consumed = 1;

        if (i + 1 < tokens.length && tokens[i + 1].type === 'consonant') {
          const nextCons = tokens[i + 1].ipa;
          const jongMapping = CONSONANT_TO_JONGSEONG[nextCons];

          const hasVowelAfter = i + 2 < tokens.length && tokens[i + 2].type === 'vowel';

          if (jongMapping !== undefined && !hasVowelAfter) {
            jongIdx = jongMapping;
            consumed = 2;
          }
        }

        // Assemble syllable(s)
        if (jungIndices.length === 1) {
          result.push(assembleHangul(CHOSEONG.IEUNG, jungIndices[0], jongIdx));
        } else {
          result.push(assembleHangul(CHOSEONG.IEUNG, jungIndices[0], JONGSEONG.NONE));
          result.push(assembleHangul(CHOSEONG.IEUNG, jungIndices[1], jongIdx));
        }

        i += consumed;
        continue;
      }
    }

    // Case 3: Consonant without vowel → Compatibility Jamo
    if (token.type === 'consonant') {
      const consonant = token.ipa;
      const jamo = CONSONANT_TO_JAMO[consonant];

      if (jamo) {
        result.push(jamo);
      }
    }

    i++;
  }

  return result.join('');
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export interface IpaToHangulOptions {
  markStress?: 'markdown' | 'html';
}

/**
 * Check if character is a Hangul compatibility jamo (ㄱ-ㅎ, ㅏ-ㅣ)
 */
function isCompatibilityJamo(code: number): boolean {
  return code >= 0x3131 && code <= 0x318E;
}

/**
 * Check if character is a complete Hangul syllable (가-힣)
 */
function isCompleteSyllable(code: number): boolean {
  return code >= 0xAC00 && code <= 0xD7A3;
}

/**
 * Extract first stressed syllable from text
 * In Korean phonetics, stress applies to the entire syllable including:
 * - Leading consonant jamos (ㅍㄹ...)
 * - The first complete syllable with a vowel (레, 프, etc.)
 *
 * Examples:
 * - "ㅍ레버런ㅌ" → first="ㅍ레", rest="버런ㅌ"
 * - "프레버런ㅌ" → first="프레", rest="버런ㅌ"
 * - "헤로" → first="헤", rest="로"
 */
function getFirstStressedSyllable(text: string): { first: string; rest: string } {
  let firstCompleteIdx = -1;

  // Find the first complete Hangul syllable (contains vowel)
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (isCompleteSyllable(code)) {
      firstCompleteIdx = i;
      break;
    }
  }

  // If no complete syllable found, just return first character
  if (firstCompleteIdx === -1) {
    if (text.length === 0) return { first: '', rest: '' };
    return { first: text[0], rest: text.substring(1) };
  }

  // Include all leading jamos + the first complete syllable
  return {
    first: text.substring(0, firstCompleteIdx + 1),
    rest: text.substring(firstCompleteIdx + 1)
  };
}

/**
 * Apply stress marker to hangul text based on format
 * Marks the first complete syllable (including any leading consonant jamos)
 */
function applyStressMarker(hangul: string, stress: StressLevel, format?: 'markdown' | 'html'): string {
  if (!format || stress === 'none') return hangul;

  const { first, rest } = getFirstStressedSyllable(hangul);

  if (stress === 'primary') {
    if (format === 'markdown') {
      return `**${first}**${rest}`;
    } else if (format === 'html') {
      return `<strong>${first}</strong>${rest}`;
    }
  } else if (stress === 'secondary') {
    if (format === 'markdown') {
      return `*${first}*${rest}`;
    } else if (format === 'html') {
      return `<em>${first}</em>${rest}`;
    }
  }

  return hangul;
}

/**
 * Convert IPA notation to Korean Hangul pronunciation
 *
 * Features:
 * - Long vowels (ː) create segments separated by dash (-)
 * - Consonant-only sequences use compatibility Jamo (ㄱㄴㄷ...)
 * - Vowel+consonant combinations form complete Hangul syllables
 * - Optional stress marking with markdown or HTML format
 *
 * @param ipa - IPA notation string (e.g., "/ˈhɛloʊ/", "/wɜːrld/")
 * @param options - Optional configuration
 * @param options.markStress - Format for stress marking: 'markdown' (**text**) or 'html' (<strong>text</strong>)
 * @returns Korean Hangul pronunciation string
 *
 * @example
 * ipaToHangul("/ˈhɛloʊ/")  // "헤로"
 * ipaToHangul("/ˈhɛloʊ/", { markStress: 'markdown' })  // "**헤**로"
 * ipaToHangul("/ˈhɛloʊ/", { markStress: 'html' })  // "<strong>헤</strong>로"
 * ipaToHangul("/wɜːrld/")  // "워-ㄹㄷ"
 * ipaToHangul("/kæt/")     // "캩"
 */
export function ipaToHangul(ipa: string, options?: IpaToHangulOptions): string {
  if (!ipa) return '';

  // Step 1: Preprocess (converts stress markers to special tokens)
  const cleaned = preprocessIPA(ipa);
  if (!cleaned) return '';

  // Step 2: Parse syllables with stress information
  const syllables = parseSyllables(cleaned);

  // Step 3: Process each syllable
  const results: string[] = [];

  for (const syllable of syllables) {
    // Split by long vowels within each syllable
    const segments = splitByLongVowel(syllable.text);

    // Convert each segment
    const convertedSegments = segments.map((seg) => {
      const tokens = tokenizeSegment(seg.text);
      const hangul = convertSegment(tokens);

      // Add dash after segment if it had a long vowel
      if (seg.hasLongVowel) {
        return hangul + '-';
      }
      return hangul;
    });

    const hangulResult = convertedSegments.join('');

    // Apply stress marker if needed
    const markedResult = applyStressMarker(hangulResult, syllable.stress, options?.markStress);
    results.push(markedResult);
  }

  return results.join('');
}
