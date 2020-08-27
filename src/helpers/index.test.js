import { getLetterMatchCount } from './';

describe('getLetterMatchCount', () => {
  const secretWord = 'party';
  
  test('returns correct count when there are no matching letters', () => {
    const letterMatchCount = getLetterMatchCount('bones', secretWord);
    expect(letterMatchCount).toBe(0);
  });
  test('returns correct count when there are 3 matching letters', () => {
    const letterMatchCount = getLetterMatchCount('bart', secretWord);
    expect(letterMatchCount).toBe(3);
  });
  test('returns correct count when there are duplicate letters in the guess', () => {
    const letterMatchCount = getLetterMatchCount('algebra', secretWord);
    expect(letterMatchCount).toBe(2);
  })
})