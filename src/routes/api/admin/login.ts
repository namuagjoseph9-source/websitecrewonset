import { createFileRoute } from "@tanstack/react-router";

import { ADMIN_COOKIE, ADMIN_SESSION, PLAYER_COOKIE } from "@/lib/session.constants";

function cookie(name: string, value: string, maxAge: number) {
  const secure = process.env["NODE_ENV"] === "production" ? "; Secure" : "";
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { username, password } = (await request.json()) as {
          username?: string;
          password?: string;
        };

        const isAdmin = username === "admin" && password === "admin";

        if (!isAdmin) {
          return Response.json({ error: "Invalid admin credentials." }, { status: 401 });
        }

        const headers = new Headers({ "content-type": "application/json" });
        headers.append("set-cookie", cookie(ADMIN_COOKIE, ADMIN_SESSION, 60 * 60 * 8));
        headers.append("set-cookie", cookie(PLAYER_COOKIE, "", 0));

        return new Response(JSON.stringify({ success: true, destination: "/admin" }), { headers });
      },
    },
  },
});
