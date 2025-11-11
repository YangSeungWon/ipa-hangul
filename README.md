# ipa-hangul

Convert IPA (International Phonetic Alphabet) pronunciation to Korean Hangul.

## Features

- 🎯 **Accurate IPA-to-Hangul conversion** based on phonetic rules
- 📏 **Long vowels marked with dash (-)** - `/siː/` → `시-`
- 🔤 **Consonant clusters as Jamo** - `/wɝld/` → `월ㄷ`
- 🏗️ **Modular & maintainable** code structure
- 📦 **Zero dependencies**
- 💯 **TypeScript support** with full type definitions
- 🚀 **Dual format** - ESM and CommonJS

## Installation

```bash
npm install ipa-hangul
```

## Usage

```typescript
import { ipaToHangul } from 'ipa-hangul';

// Basic examples
ipaToHangul('/ˈhɛloʊ/');    // "헤로"
ipaToHangul('/kæt/');       // "캩"
ipaToHangul('/bʊk/');       // "붘"

// Long vowels (marked with -)
ipaToHangul('/siː/');       // "시-"
ipaToHangul('/kɑːr/');      // "카-ㄹ"

// Consonant clusters (as Jamo)
ipaToHangul('/wɝld/');      // "월ㄷ"
ipaToHangul('/fɪlm/');      // "필ㅁ"
ipaToHangul('/strɛŋkθs/');  // "ㅅㅌ렝ㅋㅅㅅ"

// Optional sounds (removed)
ipaToHangul('/ˈɹʌmb(ə)l/'); // "럼ㅂㄹ"
```

## Features

- **Accurate conversion**: Based on Korean phonetic rules and Jamo assembly
- **Handles complex IPA**: Supports diphthongs, consonant clusters, syllabic consonants
- **Clean API**: Single function with string input/output
- **TypeScript**: Full type definitions included
- **Zero dependencies**: No runtime dependencies
- **Dual format**: ESM and CommonJS support

## Supported IPA Features

### Consonants
- Simple consonants: p, b, t, d, k, g, m, n, ŋ, f, v, θ, ð, s, z, ʃ, ʒ, h, l, r, ɹ
- Affricates: tʃ, dʒ
- Consonant clusters: pɹ, bɹ, tɹ, dɹ, kɹ, gɹ, fɹ, pl, bl, kl, gl, fl, sl

### Vowels
- Simple vowels: i, ɪ, e, ɛ, æ, ɑ, ɒ, ɔ, ʌ, ə, ɜ, ʊ, u
- Long vowels: iː, ɑː, ɔː, ɜː, uː
- Diphthongs: eɪ, aɪ, ɔɪ, aʊ, əʊ, oʊ, ɪə, eə, ʊə
- Semi-vowel combinations: w + vowel, j + vowel
- Syllabic consonants: l̩, n̩, m̩

### Special handling
- Stress markers (ˈ, ˌ) are removed
- Optional sounds in parentheses are removed
- Delimiters (/, [, ], .) are ignored

## How it works

The converter uses Korean Jamo (자모) assembly to construct Hangul syllables:

1. **Choseong (초성)**: Initial consonant (19 options)
2. **Jungseong (중성)**: Vowel (21 options)
3. **Jongseong (종성)**: Final consonant (27 options + none)

Each IPA sound is mapped to the closest Korean equivalent, then assembled into valid Hangul syllables.

## Examples

| Word | IPA | Hangul | Notes |
|------|-----|--------|-------|
| hello | /ˈhɛloʊ/ | 헤로 | Stress marker removed |
| cat | /kæt/ | 캩 | Final 't' → ㅌ |
| book | /bʊk/ | 붘 | Final 'k' → ㅋ |
| internet | /ˈɪntərnɛt/ | 인털넽 | Multi-syllable |
| world | /wɝld/ | 월ㄷ | Consonant-only 'ld' as Jamo |
| pretty | /ˈprɪti/ | 프리티 | Consonant cluster 'pr' |
| see | /siː/ | 시- | Long vowel marked with dash |
| rumble | /ˈɹʌmb(ə)l/ | 럼ㅂㄹ | Optional sounds removed |

## API

### `ipaToHangul(ipa: string): string`

Converts IPA notation to Korean Hangul pronunciation.

**Parameters:**
- `ipa`: IPA notation string (can include stress markers, brackets, optional sounds)

**Returns:**
- Korean Hangul pronunciation string

**Example:**
```typescript
import { ipaToHangul } from 'ipa-hangul';

const pronunciation = ipaToHangul('/ˈhɛloʊ/');
console.log(pronunciation); // "헤로"
```

## Limitations

- **Approximation**: Korean Hangul cannot perfectly represent all English sounds
- **Mapping choices**: Some IPA sounds map to the same Korean consonant (e.g., f/p → ㅍ)
- **Simplified finals**: Some final consonants use unconventional mappings (e.g., t → ㅌ instead of ㄷ)
- **No tone support**: Only segmental features are converted, not suprasegmental features

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT
