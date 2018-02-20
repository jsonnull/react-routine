# Getting Started

This tutorial will show you how to begin using `react-routine` to create React
components that manage state over their entire lifecycle.

Writing complex React components using the
[`React.Component` API](https://reactjs.org/docs/react-component.html) can
sometimes result in components which perform state manipulation in multiple
lifecycle methods. When this happens, there's no obvious order of execution—
whether a `componentWillUpdate` method is called depends on the component's
parent as well as calls to `setState`.

While `react-routine` doesn't change this, it _does_ make it obvious when you
_expect_ a lifecycle method to be called. This makes the flow of data through
your component much easier to reason about.

## Installation

Let's begin by installing `react-routine` in an example project.

This tutorial expects you to already know how to set up a project using React.
You may consider using the
[CodeSandbox starter project](https://codesandbox.io/s/kkn34pomz3) to get
started quickly, or
[`create-react-app`](https://github.com/facebook/create-react-app) if you want
a local React app to play with.

In the command line run

```sh
yarn install react-routine
```

or

```sh
npm install --save-dev react-routine
```

### CodeSandbox starter

I've made a starter project available on CodeSandbox. This is a minimal project
set up with `react-routine` which is ready to be forked and edited.

[Try `react-routine` on CodeSandbox](https://codesandbox.io/s/kkn34pomz3).

## Hello Routines

`Routine` is borrowed from the notion of
[`coroutine`](https://en.m.wikipedia.org/wiki/Coroutine). I don't want to
debate the technicalities of differences between coroutines and generators, but
for our purposes it is sufficient to say that a `routine` is a task which 
facilitates two-way communication with a React component and may pause to wait
for certain events.

The simplest `routine` is an empty one, so let's create an empty `routine` and
render it using React.

```js
import React from 'react';
import { render } from 'react-dom';
import { routine } from 'react-routine';

const controller = function* () {
  // An empty routine 
}

const Render = props => (
  <div>My Component</div>
)

const Component = routine(controller)(Render)

render(<Component />, document.getElementById('root'));
```

Let's review what we have here.

We've defined a generator called `controller`, which is the meat of our
`routine`. It describes the behavior of our component over time. In this case,
we've left it empty so it'll have no effect on the final component.

We've also defined a function component called `Render`. This is a standard
function component, which takes `props` and returns a React element.

Finally, we've defined `Component`, which is a new React component that
combines the `Render` component with the behavior of our `controller`. This
is the result of our call to `routine`.

Notice how if we leave off the final function invocation at `routine`, what we
have is a Higher-Order Component (HOC) which can transform any component into
a `routine` with our `controller`.

Because we've left our controller empty, this example will simply render our
`Render` component as-is. If we want to add some behavior, it's time to start
filling in our `controller`.

## Writing A Simple Component

Now that we have a simple `routine` we can work with, let's add some behavior
to it. A good place to start here is by setting some state in the component. We
can try this now by yielding a `setState` effect in our `controller`.

```js
import { routine, setState } from 'react-routine';

const controller = function* () {
  // Let's try setting some state
  yield setState({ title: 'My Awesome Routine' })
}
```

However, if we try to render this component now we'll get an error. Whoops!
We've called `setState` but our component is not ready to handle calls to
`setState` yet. This is because our routine kicks off in what would normally be
the `constructor` of our component, but you have to wait until the
`componentWillMount` method before you can make calls to `setState`.

We can instruct our `routine` to wait until `componentWillMount` by yielding
another effect.

```js
import { routine, setState, componentWillMount } from 'react-routine';

const controller = function* () {
  // Wait for component to mount
  yield componentWillMount()

  // Now we can set our state
  yield setState({ title: 'My Awesome Routine' })
}
```

Hurrah! Now our `Render` component is a short step away from displaying our
state:

```js
const Render = props => (
  <div>{ props.title }</div>
)
```

You'll notice that our state had a field called `title` and it became a field
on the `props` which were made available to our final component.

TODO: There's actually a way to control how fields from `state` get written to
`props`! Needs documentation.
