# Jotto App

Description of the project and things I'm going to use

- use of `data-test` attributes

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
  const setup = (props={}) => {
    return shallow(<Congrats {...props} />);
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
export default (props) => {
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





jest methods:

.not