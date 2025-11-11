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

interface Token {
  type: TokenType;
  ipa: string;
  length: number;
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
 * Preprocess IPA string: remove optional sounds, stress markers, delimiters
 */
function preprocessIPA(ipa: string): string {
  return ipa
    .replace(/\([^)]*\)/g, '')  // Remove optional sounds in parentheses
    .replace(/[ˈˌ′'\/\[\].]/g, '')  // Remove stress markers and delimiters
    .trim();
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
      const vowel = tokens[i + 1].ipa;

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

/**
 * Convert IPA notation to Korean Hangul pronunciation
 *
 * Features:
 * - Long vowels (ː) create segments separated by dash (-)
 * - Consonant-only sequences use compatibility Jamo (ㄱㄴㄷ...)
 * - Vowel+consonant combinations form complete Hangul syllables
 *
 * @param ipa - IPA notation string (e.g., "/ˈhɛloʊ/", "/wɜːrld/")
 * @returns Korean Hangul pronunciation string
 *
 * @example
 * ipaToHangul("/ˈhɛloʊ/")  // "헤로"
 * ipaToHangul("/wɜːrld/")  // "워-ㄹㄷ"
 * ipaToHangul("/kæt/")     // "캩"
 */
export function ipaToHangul(ipa: string): string {
  if (!ipa) return '';

  // Step 1: Preprocess
  const cleaned = preprocessIPA(ipa);
  if (!cleaned) return '';

  // Step 2: Split by long vowels
  const segments = splitByLongVowel(cleaned);

  // Step 3: Convert each segment
  const convertedSegments = segments.map((seg) => {
    const tokens = tokenizeSegment(seg.text);
    const hangul = convertSegment(tokens);

    // Add dash after segment if it had a long vowel
    if (seg.hasLongVowel) {
      return hangul + '-';
    }
    return hangul;
  });

  return convertedSegments.join('');
}
