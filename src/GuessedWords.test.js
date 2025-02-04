import React from 'react';
import { shallow } from 'enzyme';
import { findByTestAttr, checkProps } from '../test/testUtils';
import GuessedWords from './GuessedWords';


// default props
const defaultProps = {
  guessedWords: [ { guessedWord: 'train', letterMatchCount: 3 } ]
};

// setup function
const setup = (props={}) => {
  	const setupProps = { ...defaultProps, ...props };
  return shallow(<GuessedWords {...setupProps } />);
} 

test('does not throw warning with expected props', () => {
  	checkProps(GuessedWords, defaultProps);
})

describe('if there are no words guessed', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = setup( { guessedWords: [] } );
	})

  test('renders without error', () => {
   	const component = findByTestAttr(wrapper, 'component-guessed-words');
   	expect(component.length).toBe(1);
  });
  test('renders instructions to guess a word', () => {
    const instructions = findByTestAttr(wrapper, 'guess-instructions');
    expect(instructions.text().length).not.toBe(0);
  })
});

describe('if there are words guessed', () => {
  let wrapper;

  // we add more words for testing purposes
  const guessedWords = [
    { guessedWord: 'train', letterMatchCount: 3 },
    { guessedWord: 'sunny', letterMatchCount: 1 },
    { guessedWord: 'return', letterMatchCount: 5 },
  ];

  beforeEach(() => {
  	wrapper = setup( { guessedWords });
  })

  test('renders without error', () => {
  	const component = findByTestAttr(wrapper, 'component-guessed-words');
   	expect(component.length).toBe(1);
  });
  test('renders "guessed words" section', () => {
    const guessedWordsNode = findByTestAttr(wrapper, 'guessed-words');
    expect(guessedWordsNode.length).toBe(1);
  });
  test('correct number of guessed words', () => {
    const guessedWordsNodes = findByTestAttr(wrapper, 'guessed-word');
    expect(guessedWordsNodes.length).toBe(guessedWords.length);
  });
});