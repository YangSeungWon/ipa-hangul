#!/usr/bin/env node

import { ipaToHangul } from './dist/index.mjs';

// Test cases with expected results
const tests = [
  // Basic words
  { ipa: '/ˈhɛloʊ/', expected: '헤로', description: 'hello - basic word' },
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

let passed = 0;
let failed = 0;

console.log('Running ipa-hangul tests...\n');

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

console.log(`\n${passed} passed, ${failed} failed out of ${tests.length} tests`);

if (failed > 0) {
  process.exit(1);
}
