import { createFileRoute } from "@tanstack/react-router";

import { ADMIN_COOKIE, PLAYER_COOKIE, PLAYER_SESSION } from "@/lib/session.constants";

function cookie(name: string, value: string, maxAge: number) {
  const secure = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export const Route = createFileRoute("/api/player/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { username, password } = (await request.json()) as {
          username?: string;
          password?: string;
        };

        const isPlayer = username === "player@gmail.com" && password === "player";

        if (!isPlayer) {
          return Response.json({ error: "Invalid email or password." }, { status: 401 });
        }

        const headers = new Headers({ "content-type": "application/json" });
        headers.append("set-cookie", cookie(PLAYER_COOKIE, PLAYER_SESSION, 60 * 60 * 8));
        // Never grant admin access from the public/player login endpoint.
        headers.append("set-cookie", cookie(ADMIN_COOKIE, "", 0));

        return new Response(JSON.stringify({ success: true, destination: "/portal" }), { headers });
      },
    },
  },
});
