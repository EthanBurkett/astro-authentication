import { defineMiddleware } from "astro:middleware";
import SessionModel, { type ISession } from "./lib/models/Session.model";
import UserModel, { type IUser } from "./lib/models/User.model";
import type { APIContext } from "astro";
import { Session } from "./lib/Session.controller";

const protectedRoutes = ["/dashboard/*"];
const dontAllowWhenLoggedIn = ["/login", "/register"];

export type Locals = {
  user?: IUser;
} & APIContext["locals"];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const sid = context.cookies.get("sid")?.value;

  if (new RegExp(dontAllowWhenLoggedIn.join("|")).test(url.pathname)) {
    const CurrentUser = await Session.CurrentUser(sid);

    if (CurrentUser) {
      return context.redirect("/dashboard");
    }
  }

  if (new RegExp(protectedRoutes.join("|")).test(url.pathname)) {
    const session = await Session.Get(sid).catch(() => null);

    if (!session) {
      return context.redirect("/login");
    }

    const auth = await Session.Auth(session._id)
      .catch(() => {
        return context.redirect("/login");
      })
      .then((auth) => auth as { User: IUser; Session: ISession });

    (context.locals as Locals).user = auth.User;
  }

  return next();
});
