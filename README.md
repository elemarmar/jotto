# Jotto App

Description of the project and things I'm going to use

- use of `data-test` attributes
- use of `prop-types` package to control data type of props
- use of `check-prop-types` to check the errors thrown by props data type
- use of `beforeEach` for wrapper, avoiding repetition
- **abstractions** 
  - create utils functions in `test/testUtils.js`: `findByTestAttr` and `checkProps`
  - enzyme adapter in `setupTests.js`

> Too many abstractions might result in hard-to-read tests 👉🏻 less useful in diagnosing failing tests

> ⚠️ `setup()` not abstract because it's going to be different for each component

<br />



## Index





<br /> 

---



## 1. App planning

// 1. Visuals

// 2. Components needed



## 2. Testing

### Congrats component

```bash
/ src /
|____ Congrats.js
|____ Congrats.test.js
```

#### 👉🏻 **What it does**

It renders a congratulations message when the user has guessed the word, that is, when the state `blabla` is set to `true`. Otherwise, it shouldn't display any message.

<br />

#### ❓ **What tests do we want?**

- it renders without errors
- it doesn't render text when `success` prop is  `false`
- it renders none empty when `success` prop is  `true`

>  ⚠️ we don't want to test the text in case it is changed



<br />

#### **🌲 Structure of tests from App.test.js** 

```jsx
test('renders without error', () => {
  // code wil go here
});
test('renders no text when `success` prop is false', () => {
    // code wil go here
});
test('renders non-empty congrats message when `succes` prop is true', () => {
    // code wil go here
})
```

<br />

#### ⚙️ **Create tools**

- Create a setup function that will make a shallow wrapper out of our `Congrats` component.

  ```jsx
  //...
  const defaultProps = { success: false };
  
  const setup = (props={}) => {
    const setupProps = { ...defaultProps, ...props } // props will override defaultProps
    return shallow(<Congrats {...setupProps} />);
  }
  ```

- Create a function that will find the node with a specified `data-test`attribute value

  **test/testUtils.js**: 

  ```jsx
  export const findByTestAttr = (wrapper, val) => {
    wrapper.find(`[data-test="${val}"]`)
  }
  ```

  > ℹ️ We create this function outside of the Congrats component, in an external `testUtils.js` file so that we can import it in any file.

* create a generic `checkPropTypes` test that can be used in any component: asks for props and the component and tests if there is any error with the props data types.

  ```jsx
  import checkPropTypes from 'check-prop-types'
  
  export const checkProps = (component, conformingProps) => {
    const propError = checkPropTypes(
      component.propTypes, 
      conformingProps,
    	'prop',
    	component.name);
    expect(propError).toBeUndefined();
  }
  
  ```

  

<br />



#### **🧪 Writting the tests**

**Congrats.test.js**

```jsx
test('renders without error', () => {
  const wrapper = setup();
  const component = findByTestAttr(wrapper, 'component-congrats');
  expect(component.length).toBe(1);
})

test('renders no text when `success` prop is false', () => {
  const wrapper = setup({ sucess: false });
  const component = findByTestAttr(wrapper, 'component-congrats');
  expect(component.text()).toBe('');
});

test('renders non-empty congrats message when `succes` prop is true', () => {
	const wrapper = setup({ sucess: true });
  const message = findByTestAttr(wrapper, 'congrats-message');
  expect(message.text().length).not.toBe(0);
})
```

> 🔴 All these tests should fail

**Congrats.js**

```jsx
const Congrats = (props) => {
	if (props.success) {
		return (
			<div data-test="component-congrats">
				<span data-test="congrats-message">
					Congratulations! You guessed the word!
				</span>
			</div>
		);
	} else {
		return  <div data-test="component-congrats" />
	}
}
```

> 🟢 all tests should pass!

➕**Adding another test: testing the prop<span id="prop">types!</span>**

**Congrats.test.js**

```jsx
//...
import checkPropTypes from 'check-prop-types'
//...

test('does not throw warning with expected props', () => {
  const expectedProps = { success: false };
  const propError = checkPropTypes(Congrats.propTypes, expectedProps, 'prop', Congrats.name);
  expect(propError).toBeUndefined();
});
```

> 👉🏻 `propError` wil be **undefined** if the props pass all the tests.

> ⚠️ After creating the utility function `checkProps` in `src/test/testUtils.js` we will import that function instead and use it instead of `checkPropTypes(...)`

```jsx
test('does not throw warning with expected props', () => {
  const expectedProps = { success: false };
	checkProps(Congrats, expectedProps);
});
```

**Congrats.js**

```jsx
Congrats.propTypes = {
  success: PropTypes.bool.isRequired,
};
```



<br />



---



<br />



## GuessedWords component

```bash
/ src /
|___ GuessedWords.js
|___ GuessedWords.test.js
```



#### 👉🏻 What it does

It displays the user guesses and how many words match. If no word has been guessed, it displays instructions.

It will receive an array of objects from the parent as a prop with the shape:

```js
[
  { guessedWord: "train", letterMatchCount: 3 },
  { guessedWord: "agile", letterMatchCount: 2 },
]
```

> `guessedWord` is a string with the guessed word itself.
>
> `letterMatchCounte` is an int indicating how many letters of the guessed word match the secret word.



#### ❓ **What tests do we want?**

- it renders without errors
- Proptypes test





#### 🌲 Structure 

```jsx
test('does not throw warning with expected props', () => {
  // code here
});

describe('if there are no words guessed', () => {
  test('renders without error', () => {
   // code here   
  });
  test('renders instructions to guess a word', () => {
    // code here
  })

});

describe('if there are words guessed', () => {
  test('renders without error', () => {
    // code here
  });
  test('renders "guessed words" section', () => {
    // code here
  });
  test('correct number of guessed words', () => {
    //code here
  });
});
```



#### 🧪 Writing tests

👉🏻 Case #1: No words guessed

**GuessedWords.test.js**

```jsx
const defaultProps = [ {
  guessedWords: { guessedWord: 'train', letterMatchCount: 3 }
  ]
};

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
  	wrapper = setup({ guessedWords: [] });
  })
  test('renders without error', () => {
   	const component = findTestAttr(wrapper, 'component-guessed-words');
    expect(component.length).toBe(1);
  });
  
  test('renders instructions to guess a word', () => {
    const instructions = findByTestAttr(wrapper, 'guess-instructions');
    expect(instructions.text().length).not.toBe(0);
  })
});


```

> 🔴 all tests except for the proptypes one should fail!

**GuessedWords.js**

```jsx
const GuessedWords = (props) => {
	let contents;
	if (props.guessedWords.length === 0) {
		contents = <span data-test="guess-instructions">Try to guess the secret word! </span>
	} else {

	}

	return (
		<div data-test="component-guessed-words">
			{ contents }
		</div>
		);
}
```

> 🟢 all tests should pass!



<br />

👉🏻 Case #2: There are guessed words 

```jsx
describe('if there are words guessed', () => {
  let wrapper;
  
  // we add more words for testing purposes
  const guessedWords = [
    { guessedWord: 'train', letterMatchCount: 3 },
    { guessedWord: 'sunny', letterMatchCount: 1 },
    { guessedWord: 'return', letterMatchCount: 5 },
  ];
  beforeEach(() => {
    wrapper = setup({ guessedWords });
  })
  
  test('renders without error', () => {
    const component = findByTestAttr(wrapper, 'guess-instructions');
    expect(instructions.length).toBe(1);
  });
  test('renders "guessed words" section', () => {
    const guessedWordsNode = findTestAttr(wrapper, 'guess-words');
    expect(guessedWordsNode.length).toBe(1);
  });
  test('correct number of guessed words', () => {
    const guessedWordsNodes = findTestAttr(wrapper, 'guessed-word');
    expect(guessedWordsNodes.length).toBe(guessedWords.length);
  });
});
```

> 🔴 'renders "guessed words" section' and 'correct number of guesses words' should fail

**GuessedWords.js**

```jsx
const GuessedWords = (props) => {
	let contents;
	if (props.guessedWords.length === 0) {
		contents = <span data-test="guess-instructions">Try to guess the secret word! </span>
	} else {
    const guessedWordsRows = props.guessedWords.map((word, index) => (
      <tr data-test="guessed-word" key={index}>
        <td>{word.guessedWord}</td>
        <td>{word.letterMatchCount}</td>		
      </tr>
    ));
    contents = (
      <div data-test="guessed-words">
        <h3>Guessed Words</h3>
        <table>
          <thead>
            <tr><th>Guess</th><th>Matching Letters</th></tr>
          </thead>
          <tbody>
            { guessedWordsRows }
          </tbody>
        </table>
      </div>
    );
	}

	return (
		<div data-test="component-guessed-words">
			{ contents }
		</div>
	);
}
```

> 🟢 all tests should pass!



jest methods:

.not

toBeUndefined()

```js

```

