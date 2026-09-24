import { reviewApp } from "../src/app";

// Vercel serverless entry point for GitHub webhooks (POST /api/review).
export async function POST(request: Request) {
  const id = request.headers.get("x-github-delivery");
  const name = request.headers.get("x-github-event");
  const signature = request.headers.get("x-hub-signature-256");
  if (!id || !name || !signature) {
    return new Response("Missing GitHub webhook headers", { status: 400 });
  }

  try {
    await reviewApp.webhooks.verifyAndReceive({
      id,
      //@ts-ignore
      name,
      signature,
      payload: await request.text(),
    });
    return new Response("ok");
  } catch (error) {
    console.log(error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
