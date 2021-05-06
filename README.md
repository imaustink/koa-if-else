# koa-if-else

## if

```js
import koa from "koa";
import { ify } from "koa-if-else";

const app = new Koa();

app.use(
  ify(
    (ctx) => ctx.query.one,
    (ctx) => (ctx.state.result = "One!")
  ),
  (ctx) => (ctx.body = ctx.state.result)
);
```

## if/else

```js
import koa from "koa";
import { ify } from "koa-if-else";

const app = new Koa();

app.use(
  ify(
    (ctx) => ctx.query.one,
    (ctx) => (ctx.state.result = "One!")
  )
    .elsey((ctx) => (ctx.state.result = "Something else!"),
  (ctx) => (ctx.body = ctx.state.result)
);
```

## if/elseif/else

```js
import koa from "koa";
import { ify } from "koa-if-else";

const app = new Koa();

app.use(
  ify(
    (ctx) => ctx.query.one,
    (ctx) => (ctx.state.result = "One!")
  )
    .elseyIfy(
      (ctx) => ctx.query.two,
      (ctx) => (ctx.state.result = "Two!")
    )
    .elsey((ctx) => (ctx.state.result = "Something else!"),
  (ctx) => (ctx.body = ctx.state.result)
);
```
