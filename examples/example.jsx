/* eslint no-console: off */
/* eslint react/react-in-jsx-scope: off */

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
    </div>
  );
}
