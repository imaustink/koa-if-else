import compose from "koa-compose";
import { Context, Middleware, Next } from "koa";
import { ConditionEvaluator, IfyElseyMiddleware } from "./types";

export function ify(
  condition: ConditionEvaluator,
  ...middlewares: Middleware[]
): IfyElseyMiddleware {
  const stack: {
    condition?: ConditionEvaluator;
    middlewares: Middleware[];
  }[] = [];
  function registerIf(
    condition: ConditionEvaluator,
    ...middlewares: Middleware[]
  ) {
    stack.push({ condition, middlewares });
    return middleware;
  }
  function registerElse(...middlewares: Middleware[]) {
    stack.push({ middlewares });
    return middleware;
  }
  function registerElseIf(
    condition: ConditionEvaluator,
    ...middlewares: Middleware[]
  ) {
    stack.push({ middlewares, condition });
    return middleware;
  }
  async function middleware(ctx: Context, next: Next) {
    let calledNext = false;
    for (let i = 0; i < stack.length; i++) {
      const { condition, middlewares } = stack[i];
      if (condition) {
        const result = await condition(ctx);
        if (result) {
          calledNext = true;
          return compose(middlewares).call(null, ctx, next);
        }
      } else if (!stack[i + 1]) {
        calledNext = true;
        return compose(middlewares).call(null, ctx, next);
      }
    }
    if (!calledNext) {
      await next();
    }
  }

  middleware.ify = registerIf;
  middleware.elsey = registerElse;
  middleware.elseyIfy = registerElseIf;

  registerIf(condition, ...middlewares);

  return middleware;
}

export { ConditionEvaluator, IfyElseyMiddleware };
