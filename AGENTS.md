# Repository instructions

These instructions apply to all work in this repository.

## Website styling

- Put all new or changed website styling in `.scss` files.
- Do not add JSX `style={{ ... }}` props, JavaScript style objects, `styled-components`, or any
  other CSS-in-JS styling in future work.
- Prefer a component-level stylesheet such as `ComponentName.scss`, imported by the component.
  Shared variables, mixins, and global rules should live in an appropriately named shared SCSS
  file under `luvio-web/src`.
- Keep responsive breakpoints and interaction states in SCSS rather than in component code.
- Existing `styled-components` and inline styles are legacy code. Do not perform a broad migration
  unless the user requests it, but when a task changes an existing component's styling, migrate the
  styles touched by that task to SCSS instead of extending the legacy approach.
- The project does not currently declare `sass` directly. The first future task that adds an SCSS
  file must add `sass` to `luvio-web/package.json` and update `luvio-web/package-lock.json` in the
  same change.
- For visible UI changes, run the tests and production build and verify desktop and mobile layouts.
