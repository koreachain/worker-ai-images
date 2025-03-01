export default {
  async fetch(request, env) {
    // Allow only POST requests
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    // Validate Authorization token from header
    const authHeader = request.headers.get("Authorization");
    const expectedToken = env.TOKEN; // Set this in your environment
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Parse the JSON body
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response("Invalid JSON", { status: 400 });
    }

    // Ensure a prompt is provided
    if (!body.prompt) {
      return new Response("Missing prompt", { status: 400 });
    }

    const inputs = {
      prompt: body.prompt,
    };

    // Run the image generation using Stability AI
    const aiResponse = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs
    );

    return new Response(aiResponse, {
      headers: {
        "content-type": "image/png",
      },
    });
  },
} satisfies ExportedHandler<Env>;
