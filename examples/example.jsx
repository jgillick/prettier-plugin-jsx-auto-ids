/* eslint no-console: off, react/react-in-jsx-scope: off, react/prop-types: off */

export default function FooComponent() {
  function clickHandler() {
    console.log('Clicked!');
  }

  return (
    <div>
      <button type="button">Action</button>
      <div onClick={clickHandler}>Secret button</div>
      <p>
        <h1>Hello World</h1>
        <span data-testid="duplicate-id">One</span>
        <span data-testid="duplicate-id">Two</span>
      </p>
      <p>
        <a href="#">Going somewhere</a>
      </p>
      <OtherComponent onClick={() => console.log('hello')} />
    </div>
  );
}

function OtherComponent({ testID, onClick }) {
  return <div data-testid={testID} onClick={onClick}>Hello world</div>;
}
