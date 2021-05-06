import { Context, Middleware } from "koa";

export type ConditionEvaluator = (ctx: Context) => Promise<any> | any;
export interface IfyElseyMiddleware extends Middleware {
  ify: (
    conditionEvaluator: ConditionEvaluator,
    middleware: Middleware
  ) => IfyElseyMiddleware;
  elsey: (middleware: Middleware) => IfyElseyMiddleware;
  elseyIfy: (
    conditionEvaluator: ConditionEvaluator,
    middleware: Middleware
  ) => IfyElseyMiddleware;
}
