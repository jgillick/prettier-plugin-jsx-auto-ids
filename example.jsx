
function FooComponent() {
  return (
    <div>
      <button type="button" data-testid="foobar">Action</button>
      <p>
        <h1>Hello World</h1>
        <span data-testid="duplicate-id">One</span>
        <span data-testid="duplicate-id">Two</span>
      </p>
    </div>
  )
}
