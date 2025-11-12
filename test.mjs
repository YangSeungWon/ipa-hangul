#!/usr/bin/env node

import { ipaToHangul } from './dist/index.mjs';

// Test cases with expected results
const tests = [
  // Basic words
  { ipa: '/həˈləʊ/', expected: '허로', description: 'hello - basic word' },
  { ipa: '/kæt/', expected: '캩', description: 'cat - final t → ㅌ' },
  { ipa: '/bʊk/', expected: '붘', description: 'book - final k → ㅋ' },

  // Long vowels
  { ipa: '/siː/', expected: '시-', description: 'see - long vowel with dash' },
  { ipa: '/kɑːr/', expected: '카-ㄹ', description: 'car - long vowel + consonant' },

  // Consonant clusters
  { ipa: '/wɝld/', expected: '월ㄷ', description: 'world - consonant-only as Jamo' },
  { ipa: '/fɪlm/', expected: '필ㅁ', description: 'film - final cluster' },
  { ipa: '/ˈprɪti/', expected: 'ㅍ리티', description: 'pretty - initial cluster pr' },

  // Syllable boundaries with stress markers
  { ipa: '/pɹəˌnaʊn.siˈeɪ.ʃən/', expected: 'ㅍ러나운시에이션', description: 'pronunciation - syllable boundaries' },
  { ipa: '/æp.ɹɪˈhɛn.ʃən/', expected: '앱리헨션', description: 'apprehension - stress as boundary' },
  { ipa: '/ˌpɹəʊ.pɹi.əʊˈsɛp.ʃən/', expected: 'ㅍ로ㅍ리오셉션', description: 'proprioception - complex syllables' },

  // sh (ʃ) palatalization
  { ipa: '/ʃən/', expected: '션', description: 'shən - palatalization' },
  { ipa: '/ʃɑː/', expected: '샤-', description: 'sha - palatalization' },
  { ipa: '/ʃɔː/', expected: '쇼-', description: 'sho - palatalization' },
  { ipa: '/ʃuː/', expected: '슈-', description: 'shu - palatalization' },

  // Multi-syllable words
  { ipa: '/ˈɪntərnɛt/', expected: '인털넽', description: 'internet - multi-syllable' },
  { ipa: '/kənˈsɑː.lə.deɪt/', expected: '컨사-러데잍', description: 'consolidate - complex' },

  // Optional sounds (removed)
  { ipa: '/ˈɹʌmb(ə)l/', expected: '럼ㅂㄹ', description: 'rumble - optional sound removed' },
];

// Test cases with stress marking (markdown)
const markdownTests = [
  { ipa: '/həˈləʊ/', expected: '허**로**', description: 'hello - markdown primary stress' },
  { ipa: '/ˈɪntərnɛt/', expected: '**인**털넽', description: 'internet - markdown primary stress' },
  { ipa: '/pɹəˌnaʊn.siˈeɪ.ʃən/', expected: 'ㅍ러*나*운시**에**이션', description: 'pronunciation - markdown (primary ** and secondary *)' },
  { ipa: '/kənˈsɑː.lə.deɪt/', expected: '컨**사**-러데잍', description: 'consolidate - markdown primary stress' },
  { ipa: '/ˌpɹəʊ.pɹi.əʊˈsɛp.ʃən/', expected: '*ㅍ*로ㅍ리오**셉**션', description: 'proprioception - markdown (secondary * and primary **)' },
];

// Test cases with stress marking (html)
const htmlTests = [
  { ipa: '/həˈləʊ/', expected: '허<strong>로</strong>', description: 'hello - html primary stress' },
  { ipa: '/ˈɪntərnɛt/', expected: '<strong>인</strong>털넽', description: 'internet - html primary stress' },
  { ipa: '/pɹəˌnaʊn.siˈeɪ.ʃən/', expected: 'ㅍ러<em>나</em>운시<strong>에</strong>이션', description: 'pronunciation - html (primary strong and secondary em)' },
  { ipa: '/kənˈsɑː.lə.deɪt/', expected: '컨<strong>사</strong>-러데잍', description: 'consolidate - html primary stress' },
  { ipa: '/ˌpɹəʊ.pɹi.əʊˈsɛp.ʃən/', expected: '<em>ㅍ</em>로ㅍ리오<strong>셉</strong>션', description: 'proprioception - html (secondary em and primary strong)' },
];

let passed = 0;
let failed = 0;

console.log('Running ipa-hangul tests...\n');

// Test basic functionality (no stress marking)
console.log('=== Basic Tests (no stress marking) ===');
for (const test of tests) {
  const result = ipaToHangul(test.ipa);
  const success = result === test.expected;

  if (success) {
    passed++;
    console.log(`✓ ${test.description}`);
  } else {
    failed++;
    console.log(`✗ ${test.description}`);
    console.log(`  Input:    ${test.ipa}`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got:      ${result}`);
  }
}

// Test markdown stress marking
console.log('\n=== Markdown Stress Tests ===');
for (const test of markdownTests) {
  const result = ipaToHangul(test.ipa, { markStress: 'markdown' });
  const success = result === test.expected;

  if (success) {
    passed++;
    console.log(`✓ ${test.description}`);
  } else {
    failed++;
    console.log(`✗ ${test.description}`);
    console.log(`  Input:    ${test.ipa}`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got:      ${result}`);
  }
}

// Test HTML stress marking
console.log('\n=== HTML Stress Tests ===');
for (const test of htmlTests) {
  const result = ipaToHangul(test.ipa, { markStress: 'html' });
  const success = result === test.expected;

  if (success) {
    passed++;
    console.log(`✓ ${test.description}`);
  } else {
    failed++;
    console.log(`✗ ${test.description}`);
    console.log(`  Input:    ${test.ipa}`);
    console.log(`  Expected: ${test.expected}`);
    console.log(`  Got:      ${result}`);
  }
}

const totalTests = tests.length + markdownTests.length + htmlTests.length;
console.log(`\n${passed} passed, ${failed} failed out of ${totalTests} tests`);

if (failed > 0) {
  process.exit(1);
}
