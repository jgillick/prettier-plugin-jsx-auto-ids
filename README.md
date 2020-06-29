# Prettier Plugin - Add JSX IDs
A prettier plugin to auto-generate ID attributes for JSX elements.

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
npm run example
```
