// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const isAuthPage = url.pathname === "/login" || url.pathname === "/register";

  // Rutas que requieren sesión
  const protectedPaths = ["/dashboard", "/orders", "/products", "/profile"];
  const isProtected = protectedPaths.some((p) => url.pathname.startsWith(p));

  // Si no hay sesión y es protegida => a /login con redirect de regreso
  if (!session && isProtected) {
    const redirectUrl = url.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", url.pathname + url.search);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y visita login/register => sacarlo al inicio
  if (session && isAuthPage) {
    const home = url.clone();
    home.pathname = "/";
    home.search = "";
    return NextResponse.redirect(home);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
