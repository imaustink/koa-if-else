import test from "ava";
import { ify } from "../index";
import { Context, Next } from "koa";

class NextSpy {
  callCount: number = 0;
  next = () => {
    this.callCount++;
  };
}

test("if should work", async (t) => {
  let ctx;

  const spy = new NextSpy();
  const middleware = ify(
    ({ showMessage }: any) => showMessage,
    async (ctx: { body: string }) => (ctx.body = "Welcome!")
  );

  ctx = {
    showMessage: true,
  } as any;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    showMessage: true,
    body: "Welcome!",
  } as any);

  ctx = {
    showMessage: false,
  } as any;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    showMessage: false,
  } as any);
});

test("if else should work", async (t) => {
  let ctx;
  const message = "Hello World!";
  const messageJson = `{"message":"${message}"}`;
  const messageXml = `<message>${message}</message>`;

  const spy = new NextSpy();
  const middleware = ify(
    ({ type }: { type: string }) => type === "json",
    (ctx: { body: string }) => (ctx.body = messageJson)
  ).elsey((ctx: { body: string }) => (ctx.body = messageXml));

  ctx = {
    type: "json",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "json",
    body: messageJson,
  } as Context);

  ctx = {
    type: "html",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "html",
    body: messageXml,
  } as Context);
});

test("if else if should work", async (t) => {
  let ctx;
  const message = "Hello World!";
  const messageJson = `{"message":"${message}"}`;
  const messageXml = `<message>${message}</message>`;

  const spy = new NextSpy();
  const middleware = ify(
    ({ type }: { type: string }) => type === "json",
    (ctx: { body: string }) => (ctx.body = messageJson)
  ).elseyIfy(
    ({ type }: { type: string }) => type === "html",
    (ctx: { body: string }) => (ctx.body = messageXml)
  );

  ctx = {
    type: "json",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "json",
    body: messageJson,
  } as Context);

  ctx = {
    type: "html",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "html",
    body: messageXml,
  } as Context);

  ctx = {
    type: "*",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "*",
  } as Context);
});

test("if else if else should work", async (t) => {
  let ctx;
  const message = "Hello World!";
  const messageJson = `{"message":"${message}"}`;
  const messageXml = `<message>${message}</message>`;

  const spy = new NextSpy();
  const middleware = ify(
    ({ type }: { type: string }) => type === "json",
    (ctx: { body: string }) => (ctx.body = messageJson)
  )
    .elseyIfy(
      ({ type }: { type: string }) => type === "html",
      (ctx: { body: string }) => (ctx.body = messageXml)
    )
    .elsey((ctx: { body: string }) => (ctx.body = message));

  ctx = {
    type: "json",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "json",
    body: messageJson,
  } as Context);

  ctx = {
    type: "html",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "html",
    body: messageXml,
  } as Context);

  ctx = {
    type: "*",
  } as Context;
  await middleware(ctx, spy.next as Next);
  t.deepEqual(ctx, {
    type: "*",
    body: message,
  } as Context);
});

test("calls next when no matches are found", async (t) => {
  let ctx;
  const spy = new NextSpy();
  const middleware = ify(
    ({ type }: { type: string }) => type === "json",
    (ctx: { body: string }) => (ctx.body = null)
  );

  ctx = {
    type: "json",
  } as Context;
  await middleware(ctx, spy.next as Next);

  t.is(spy.callCount, 1);
});
