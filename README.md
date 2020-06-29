# Prettier Plugin - Automatically add JSX IDs
A prettier plugin to auto-generate ID attributes for JSX elements.

The motivation behind this is to intelligently add `data-testid` attributes for QA automation and data event tracking. With a couple options, the plugin can add these attributes to elements which match a couple criteria.

## Example Use Cases

### QA Automation
This can ensure that elements have unique and unchanging IDs that can be used in automation tests. Instead of targeting elements by XPath or CSS selector, which can change as the page changes, the automation engineers can target the element directly by ID.

### Automatic Event Tracking
You might want to track all UX interactions which happen on a page. Instead of manually adding all tracking, setup global click handlers and use these IDs to report what was clicked.

## Setup

```bash
npm install
```

## Run Example
You can see how this transforms [example.jsx](./example.jsx) with the following command:

```bash
npm run examples
```

## Options

### `--id-attr-name`

_Default: `data-testid`_

Use this to define the ID attribute name. By default it's set to `data-testid`, but you could change the attribute to anything you want.

For example, set the ID attribute to `my-id`:

```
npx prettier --id-attr-name=my-id  --plugin prettier-plugin-jsx-auto-ids examples/*.jsx
```


### `--component-id-attr-name`

This is the same as `--id-attr-name` except it's the attribute name to used when being placed on JSX components. This is necessary because often times component attributes are camelCase instead of dash-case.

For example:

```
npx prettier --component-id-attr-name=testID --id-attr-name=my-id  --plugin prettier-plugin-jsx-auto-ids examples/*.jsx
```


### `--id-elements`

A comma-delimited list of elements which should always get an ID.

For example, if you want all `<button>` and `<a>` elements to get IDs:

```
npx prettier --id-elements=button,a --plugin prettier-plugin-jsx-auto-ids examples/*.jsx
```

### `--id-when-attributes`

A comma-delimited list of attributes which, if present, indicate the element should get an ID.

For example, if you want all elements which contain the `onClick` or `href` to get IDs:

```
npx prettier --id-when-attributes=onClick,href --plugin prettier-plugin-jsx-auto-ids examples/*.jsx
```
