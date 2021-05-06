# koa-if-else

```js
import koa from "koa";
import { ify } from "koa-if-else";

const app = new Koa();

app.use(
  ify(
    (ctx) => ctx.query.one,
    (ctx) => (ctx.state.type = "1")
  )
    .elseyIfy(
      (ctx) => ctx.query.two,
      (ctx) => (ctx.state.type = "2")
    )
    .elsey((ctx) => (ctx.state.type = "?"))
);
```
