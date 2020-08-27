# Jotto App

Description of the project and things I'm going to use

- use of `data-test` attributes
- use of `prop-types` package to control data type of props
- use of `check-prop-types` to check the errors thrown by props data type

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

👉🏻 **What it does**

It renders a congratulations message when the user has guessed the word, that is, when the state `blabla` is set to `true`. Otherwise, it shouldn't display any message.

<br />

❓ **What tests do we want?**

- it renders without errors
- it doesn't render text when `success` prop is  `false`
- it renders none empty when `success` prop is  `true`

>  ⚠️ we don't want to test the text in case it is changed



<br />

**🌲 Structure of tests from App.test.js** 

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

⚙️ **Create tools**

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



**🧪 Writting the tests**

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

➕**Adding another test: testing the prop <span id="prop">types!</span>**

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



jest methods:

.not

toBeUndefined()