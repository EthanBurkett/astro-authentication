import { defineMiddleware } from "astro:middleware";
import SessionModel, { type ISession } from "./lib/models/Session.model";
import UserModel, { type IUser } from "./lib/models/User.model";
import type { APIContext } from "astro";
import { Session, SessionError } from "./lib/Session.controller";
import type { IServer } from "./lib/models/Server.model";
import ServerModel from "./lib/models/Server.model";
import { useServers } from "./Stores/User.servers";

const protectedRoutes = ["/dashboard/*"];
const dontAllowWhenLoggedIn = ["/login", "/register"];

export type Locals = {
  user?: IUser;
  servers?: IServer[];
} & APIContext["locals"];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const sid = context.cookies.get("sid")?.value;
  const session = await Session.Get(sid).catch(() => null);
  const auth = await Session.Auth(session?._id).catch(() => null);

  (context.locals as Locals).user = auth?.User;

  if (new RegExp(dontAllowWhenLoggedIn.join("|")).test(url.pathname)) {
    const CurrentUser = await Session.CurrentUser(sid);

    if (CurrentUser) {
      return context.redirect("/dashboard");
    }

    return next();
  }

  if (new RegExp(protectedRoutes.join("|")).test(url.pathname)) {
    if (!session) return context.redirect("/login");
    if (!auth) return context.redirect("/login");

    if (!auth.success) {
      switch (auth.message) {
        case SessionError.USER_NOT_FOUND:
          await Session.Delete(session._id);
          return context.redirect("/login");
        default:
          return context.redirect("/login");
      }
    }
    const servers = useServers.get();

    const dbServers = await ServerModel.find({
      user: (context.locals as Locals).user?._id,
    }).populate("user");
    useServers.set(dbServers);

    useServers.subscribe((servers) => {
      (context.locals as Locals).servers = servers as IServer[];
    });

    (context.locals as Locals).servers = servers;
  }

  return next();
});
