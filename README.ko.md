# ipa-hangul

IPA (국제 음성 기호) 발음을 한글로 변환합니다.

[English](./README.md) | 한국어

## 주요 기능

- 🎯 **IPA를 읽기 쉬운 한글로 변환**
- 📏 **장모음 대시 표시** - `/siː/` → `시-`
- 🔤 **자음 클러스터를 자모로** - `/wɝld/` → `월ㄷ`
- ⭐ **선택적 강세 표시** - 마크다운 (`**텍**스트`) 또는 HTML (`<strong>텍</strong>스트`)
- 🏗️ **모듈식 구조** - 유지보수 용이
- 📦 **제로 디펜던시**
- 💯 **TypeScript 지원** - 완전한 타입 정의
- 🚀 **이중 포맷** - ESM 및 CommonJS

## 설치

```bash
npm install ipa-hangul
```

## 사용법

```typescript
import { ipaToHangul } from 'ipa-hangul';

// 기본 예시
ipaToHangul('/həˈləʊ/');    // "허로"
ipaToHangul('/kæt/');       // "캩"
ipaToHangul('/bʊk/');       // "붘"

// 장모음 (대시로 표시)
ipaToHangul('/siː/');       // "시-"
ipaToHangul('/kɑːr/');      // "카-ㄹ"

// 자음 클러스터 (자모로 표시)
ipaToHangul('/wɝld/');      // "월ㄷ"
ipaToHangul('/fɪlm/');      // "필ㅁ"
ipaToHangul('/strɛŋkθs/');  // "ㅅㅌ렝ㅋㅅㅅ"

// 선택적 소리 (제거됨)
ipaToHangul('/ˈɹʌmb(ə)l/'); // "럼ㅂㄹ"

// 마크다운 강세 표시
ipaToHangul('/həˈləʊ/', { markStress: 'markdown' });
// "허**로**" (1차 강세 **)

ipaToHangul('/ˈɪntərnɛt/', { markStress: 'markdown' });
// "**인**털넽" (1차 강세)

ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'markdown' });
// "ㅍ러*나*운시**에**이션" (1차 ** 및 2차 *)

// HTML 강세 표시
ipaToHangul('/həˈləʊ/', { markStress: 'html' });
// "허<strong>로</strong>" (1차 강세 <strong>)

ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'html' });
// "ㅍ러<em>나</em>운시<strong>에</strong>이션" (1차 <strong> 및 2차 <em>)
```

## 기능 설명

- **IPA-한글 변환**: 한글 자모 조립 사용
- **복잡한 IPA 처리**: 이중모음, 자음 클러스터, 음절 자음 지원
- **깔끔한 API**: 단일 함수로 문자열 입출력
- **TypeScript**: 완전한 타입 정의 포함
- **제로 디펜던시**: 런타임 의존성 없음
- **이중 포맷**: ESM 및 CommonJS 지원

## 지원하는 IPA 기능

### 자음
- 단순 자음: p, b, t, d, k, g, m, n, ŋ, f, v, θ, ð, s, z, ʃ, ʒ, h, l, r, ɹ
- 파찰음: tʃ, dʒ
- 자음 클러스터: pɹ, bɹ, tɹ, dɹ, kɹ, gɹ, fɹ, pl, bl, kl, gl, fl, sl

### 모음
- 단순 모음: i, ɪ, e, ɛ, æ, ɑ, ɒ, ɔ, ʌ, ə, ɜ, ʊ, u
- 장모음: iː, ɑː, ɔː, ɜː, uː
- 이중모음: eɪ, aɪ, ɔɪ, aʊ, əʊ, oʊ, ɪə, eə, ʊə
- 반모음 조합: w + 모음, j + 모음
- 음절 자음: l̩, n̩, m̩

### 특수 처리
- **강세 표시** (ˈ 1차 강세, ˌ 2차 강세):
  - 기본값: 음절 경계로 사용, 표시 안 함
  - `markStress: 'markdown'`: 1차 강세 `**강**`, 2차 강세 `*약*`
  - `markStress: 'html'`: 1차 강세 `<strong>강</strong>`, 2차 강세 `<em>약</em>`
- **선택적 소리** 괄호 안은 제거됨
- **구분 기호** (/, [, ], .) 무시됨

## 동작 원리

한글 자모(字母) 조립을 사용하여 한글 음절을 구성합니다:

1. **초성(初聲)**: 초성 자음 (19가지)
2. **중성(中聲)**: 모음 (21가지)
3. **종성(終聲)**: 받침 자음 (27가지 + 없음)

각 IPA 소리는 가장 가까운 한글 자모에 매핑되어 유효한 한글 음절로 조립됩니다.

## 예시

| 단어 | IPA | 한글 | 참고 |
|------|-----|--------|-------|
| hello | /həˈləʊ/ | 허로 | 강세 표시를 음절 경계로 |
| cat | /kæt/ | 캩 | 종성 't' → ㅌ |
| book | /bʊk/ | 붘 | 종성 'k' → ㅋ |
| internet | /ˈɪntərnɛt/ | 인털넽 | 다중 음절 |
| world | /wɝld/ | 월ㄷ | 자음만 'ld'를 자모로 |
| see | /siː/ | 시- | 장모음 대시 표시 |
| rumble | /ˈɹʌmb(ə)l/ | 럼ㅂㄹ | 선택적 소리 제거 |

### 강세 표시 예시

| 단어 | IPA | 기본 | 마크다운 사용 시 | HTML 사용 시 |
|------|-----|---------|---------------|-----------|
| hello | /həˈləʊ/ | 허로 | 허**로** | 허`<strong>`로`</strong>` |
| internet | /ˈɪntərnɛt/ | 인털넽 | **인**털넽 | `<strong>`인`</strong>`털넽 |
| pronunciation | /pɹəˌnaʊn.siˈeɪ.ʃən/ | ㅍ러나운시에이션 | ㅍ러*나*운시**에**이션 | ㅍ러`<em>`나`</em>`운시`<strong>`에`</strong>`이션 |

## API

### `ipaToHangul(ipa: string, options?: IpaToHangulOptions): string`

IPA 표기를 한글 발음으로 변환합니다.

**매개변수:**
- `ipa`: IPA 표기 문자열 (강세 표시, 괄호, 선택적 소리 포함 가능)
- `options` (선택): 설정 객체
  - `markStress?: 'markdown' | 'html'`: 강세 표시 형식
    - `'markdown'`: 1차 강세 `**강**`, 2차 강세 `*약*`
    - `'html'`: 1차 강세 `<strong>강</strong>`, 2차 강세 `<em>약</em>`
    - 기본값: 강세 표시 없음 (강세 표시를 음절 경계로 사용)

**반환값:**
- 한글 발음 문자열 (선택적으로 강세 표시 포함)

**예시:**
```typescript
import { ipaToHangul } from 'ipa-hangul';

// 기본 사용 (강세 표시 없음)
const basic = ipaToHangul('/həˈləʊ/');
console.log(basic); // "허로"

// 마크다운 강세 표시
const markdown = ipaToHangul('/həˈləʊ/', { markStress: 'markdown' });
console.log(markdown); // "허**로**"

// HTML 강세 표시
const html = ipaToHangul('/həˈləʊ/', { markStress: 'html' });
console.log(html); // "허<strong>로</strong>"

// 1차 및 2차 강세
const complex = ipaToHangul('/pɹəˌnaʊn.siˈeɪ.ʃən/', { markStress: 'markdown' });
console.log(complex); // "ㅍ러*나*운시**에**이션"
```

## 한계

- **근사치**: 한글로 모든 영어 발음을 완벽하게 표현할 수 없음
- **매핑 선택**: 일부 IPA 소리는 같은 한글 자음에 매핑됨 (예: f/p → ㅍ)
- **종성 단순화**: 일부 종성 자음은 비전통적 매핑 사용 (예: t → ㅌ 대신 ㄷ)
- **성조 미지원**: 분절 자질만 변환, 초분절 자질 미지원

## 기여

기여를 환영합니다! 이슈나 풀 리퀘스트를 자유롭게 제출해주세요.

## 라이선스

MIT
