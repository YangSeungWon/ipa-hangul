# ipa-hangul

Convert IPA (International Phonetic Alphabet) pronunciation to Korean Hangul.

English | [한국어](./README.ko.md)

## Features

- 🎯 **Convert IPA to readable Hangul**
- 📏 **Long vowels marked with dash (-)** - `/siː/` → `시-`
- 🔤 **Consonant clusters as Jamo** - `/wɝld/` → `월ㄷ`
- ⭐ **Optional stress marking** - Markdown (`**텍**스트`) or HTML (`<strong>텍</strong>스트`)
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
ipaToHangul('/həˈləʊ/');    // "허로"
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

// Stress marking with Markdown
ipaToHangul('/həˈləʊ/', { markStress: 'markdown' });
// "허**로**" (primary stress with **)

ipaToHangul('/ˈɪntərnɛt/', { markStress: 'markdown' });
// "**인**털넽" (primary stress)

ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'markdown' });
// "ㅍ러*나*운시**에**이션" (primary ** and secondary *)

// Stress marking with HTML
ipaToHangul('/həˈləʊ/', { markStress: 'html' });
// "허<strong>로</strong>" (primary stress with <strong>)

ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'html' });
// "ㅍ러<em>나</em>운시<strong>에</strong>이션" (primary <strong> and secondary <em>)
```

## Features

- **IPA to Hangul conversion**: Uses Korean Jamo assembly
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
- **Stress markers** (ˈ primary, ˌ secondary):
  - Default: Used as syllable boundaries, not displayed
  - With `markStress: 'markdown'`: Primary `**강**`, Secondary `*약*`
  - With `markStress: 'html'`: Primary `<strong>강</strong>`, Secondary `<em>약</em>`
- **Optional sounds** in parentheses are removed
- **Delimiters** (/, [, ], .) are ignored

## How it works

The converter uses Korean Jamo (자모) assembly to construct Hangul syllables:

1. **Choseong (초성)**: Initial consonant (19 options)
2. **Jungseong (중성)**: Vowel (21 options)
3. **Jongseong (종성)**: Final consonant (27 options + none)

Each IPA sound is mapped to the closest Korean equivalent, then assembled into valid Hangul syllables.

## Examples

| Word | IPA | Hangul | Notes |
|------|-----|--------|-------|
| hello | /həˈləʊ/ | 허로 | Stress marker as boundary |
| cat | /kæt/ | 캩 | Final 't' → ㅌ |
| book | /bʊk/ | 붘 | Final 'k' → ㅋ |
| internet | /ˈɪntərnɛt/ | 인털넽 | Multi-syllable |
| world | /wɝld/ | 월ㄷ | Consonant-only 'ld' as Jamo |
| see | /siː/ | 시- | Long vowel marked with dash |
| rumble | /ˈɹʌmb(ə)l/ | 럼ㅂㄹ | Optional sounds removed |

### Stress Marking Examples

| Word | IPA | Default | With Markdown | With HTML |
|------|-----|---------|---------------|-----------|
| hello | /həˈləʊ/ | 허로 | 허**로** | 허`<strong>`로`</strong>` |
| internet | /ˈɪntərnɛt/ | 인털넽 | **인**털넽 | `<strong>`인`</strong>`털넽 |
| pronunciation | /pɹəˌnaʊn.siˈeɪ.ʃən/ | ㅍ러나운시에이션 | ㅍ러*나*운시**에**이션 | ㅍ러`<em>`나`</em>`운시`<strong>`에`</strong>`이션 |

## API

### `ipaToHangul(ipa: string, options?: IpaToHangulOptions): string`

Converts IPA notation to Korean Hangul pronunciation.

**Parameters:**
- `ipa`: IPA notation string (can include stress markers, brackets, optional sounds)
- `options` (optional): Configuration object
  - `markStress?: 'markdown' | 'html'`: Format for stress marking
    - `'markdown'`: Primary stress `**강**`, Secondary stress `*약*`
    - `'html'`: Primary stress `<strong>강</strong>`, Secondary stress `<em>약</em>`
    - Default: No stress marking (stress markers used as syllable boundaries)

**Returns:**
- Korean Hangul pronunciation string (with optional stress markers)

**Examples:**
```typescript
import { ipaToHangul } from 'ipa-hangul';

// Basic usage (no stress marking)
const basic = ipaToHangul('/həˈləʊ/');
console.log(basic); // "허로"

// Markdown stress marking
const markdown = ipaToHangul('/həˈləʊ/', { markStress: 'markdown' });
console.log(markdown); // "허**로**"

// HTML stress marking
const html = ipaToHangul('/həˈləʊ/', { markStress: 'html' });
console.log(html); // "허<strong>로</strong>"

// Primary and secondary stress
const complex = ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'markdown' });
console.log(complex); // "ㅍ러*나*운시**에**이션"
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
