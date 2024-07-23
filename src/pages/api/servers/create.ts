import type { APIRoute } from "astro";
import ServerModel from "../../../lib/models/Server.model";
import { z } from "zod";

export const POST: APIRoute = async ({ request }) => {
  // verify origin is from the client
  const origin = request.headers.get("origin");
  // TODO: enable after code is complete
  // if (!origin) {
  //   return new Response(null, { status: 400 });
  // }

  // if (!origin.includes("http://localhost")) {
  //   return new Response(null, { status: 400 });
  // }

  const data = await request.json().catch(() => {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON",
      }),
      { status: 400 },
    );
  });
  console.log(data);
  const schema = z.object({
    display_name: z.string(),
    name: z.string(),
    address: z.string(),
    port: z.string(),
    plugin_port: z.string(),
    api_key: z.string(),
    user: z.string(),
  });

  const validated = schema.safeParse(data);
  if (!validated.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid body",
      }),
      { status: 400 },
    );
  }

  const { name, address, port, plugin_port, api_key, user, display_name } =
    validated.data;
  console.log(validated.data);

  const existing = await ServerModel.findOne({
    address,
    port,
  });

  if (existing)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Server already exists",
      }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );

  const server = new ServerModel({
    display_name,
    name,
    address,
    port,
    plugin_port,
    plugin_api_key: api_key,
    user,
  });

  await server.save();

  return new Response(
    JSON.stringify({
      data: server,
      success: true,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost",
      },
    },
  );
};
