# @mpt/preact-router
This is meant to be an alternative for [preact-router](https://www.npmjs.com/package/preact-router) that covers more complex use cases.

_Note that this is **not a drop in replacement** for preact-router._

## Features
+ history and hash based routing.
+ manual & custom route matching and formatting.
+ static & regular expression based routes.
+ nested router views.

<br>



# Setup
```bash
npm i @mpt/preact-router
```
_Note that this package can only be used as es modules for now._

```tsx
import { HistoryRouter, StaticRoute, RouterView } from "@mpt/preact-router";

const routes = [
  [new StaticRoute("/"), () => <>Hello World!</>],
];

function Fallback() {
  return <>Not found :(</>;
}

render(
  <HistoryRouter>
    <RouterView routes={routes} fallback={Fallback} />
  </HistoryRouter>,
  document.body
);
```
The `RouterView` displays the first route that matches the current path. Otherwise it displays the fallback if provided.

## Static Routes
Static routes can be used to match a static path and optionally all child paths.
```ts
import { StaticRoute } from "@mpt/preact-router";

new StaticRoute("/foo")
// Matches exactly "/foo"

new StaticRoute("/foo", true)
// Matches "/foo" and all child paths such as "/foo/bar/baz"
```

## RegExp Routes
Regular expression routes can be used to parse dynamic parts from the path.
```tsx
import { RegExpRoute } from "@mpt/preact-router";

function Page(props) {
  // Captured parts are passed to the routed component props:
  return <>Book id: {props.params[0]}</>;
}

const routes = [
  // Matches "/book/1234" and all children
  [new RegExpRoute(/^\/book\/(\d+)(?:\/|$)/), Page]
];
```

## Manual Routing
Manual routing can be used to route a value based on the current path instead of rendering components.
```tsx
import { routeValue } from "@mpt/preact-router";

const routes = [
  [new StaticRoute("/foo"), "foo"],
  [new StaticRoute("/bar"), "bar"],
];

function App() {
  // Note that the "routeValue" function relies on preact hooks to get the current path.
  const value = routeValue(routes);
  // Returns the first matched value or null if no route matches.

  return <>{value}</>;
}
```
*To see what can be done with manual routing, you can take a look at https://mxjp.de/ .*

## Nested Routing
A router view provides information on the matched path to all of it's children, so that router views can be arbitrarily nested:
```tsx
render(
  <HistoryRouter>
    <RouterView routes={[
      [new StaticRoute("/foo", true), () => <>
        <RouterView routes={[
          [new StaticRoute("/bar", true), () => {
            const route = useContext(routedContext);
            return <>{route.rest}</>;
          }]
        ]} />
      </>]
    ]} />
  </HistoryRouter>,
  document.body
);
```
When the location is "/foo/bar/baz", the above code renders "/baz".

## Navigation
Both the `HistoryRouter` and `HashRouter` provide an api for programmatic navigation.
```tsx
import { routerContext } from "@mpt/preact-router";

const someRoute = new StaticRoute("/foo");

function App() {
  // Returns an api for the currently used router:
  const router = useContext(routerContext);

  return <>
    <button onClick={() => {
      // Navigate to "/foo":
      router.push(someRoute.format());

      // Use the history api to replace the path with "/foo":
      router.replace(someRoute.format());
    }}>Foo</button>
  </>;
}
```
*Note, that the replace function does the exact same as the push function if the `HashRouter` is used.*

## Path Normalization
The following conventions are used to normalize, combine and match route paths:
+ Normalized paths with at least one component always start with a "/".
+ A trailing slash indicates that the path represents a directory.
+ Paths must never contain empty components e.g. `/foo//bar`.

<br>



# Troubleshooting
If routes are not matched as expected, the `DebugView` component can be used to display all available information in a specific context:
```tsx
import { DebugView } from "@mpt/preact-router";

// location.pathname === "/foo/bar/baz?a=b"
render(
  <>
    <DebugView />
    <!-- no context -->

    <HistoryRouter>
      <DebugView />
      <!-- path="" rest="/foo/bar/baz" params="a=b" -->

      <RouterView routes={[
        [new StaticRoute("/foo", true), () => <>
          <DebugView />
          <!-- path="/foo" rest="/bar/baz" params="a=b" -->
        </>]
      ]} />
    </HistoryRouter>
  </>,
  document.body
)
```

<br>



# Changelog

## 3.3.0
+ Add `routeValueInContext` function.

## 3.2.0
+ Add `splitPath` function.
+ Add `deriveRoutedContext` function.
+ Add `RoutePathMatch` interface without the params property that `RouteMatch` now extends.

## 3.1.0
+ Add `onNavigate` event to router interface.
