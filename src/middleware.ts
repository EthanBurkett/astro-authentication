import { defineMiddleware } from "astro:middleware";
import SessionModel from "./lib/models/Session.model";
import UserModel, { type IUser } from "./lib/models/User.model";
import type { APIContext } from "astro";

const protectedRoutes = ["/dashboard"];

export type Locals = {
  user?: IUser;
} & APIContext["locals"];

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  if (protectedRoutes.includes(url.pathname)) {
    const session = await SessionModel.findOne({
      _id: context.cookies.get("sid")
        ? context.cookies.get("sid")!.value
        : null,
    }).catch(() => {
      return null;
    });
    if (!session) {
      return context.redirect("/login");
    }

    const sessionExpired = new Date(session.expiresAt) < new Date();
    if (sessionExpired) {
      await SessionModel.deleteOne({ _id: session._id });
      return context.redirect("/login");
    }

    const user = await UserModel.findOne({ _id: session.user });
    if (!user) {
      return context.redirect("/login");
    }

    (context.locals as Locals).user = user;
  }

  return next();
});
