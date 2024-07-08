import type { IUser } from "./models/User.model";
import SessionModel, { type ISession } from "./models/Session.model";
import dayjs from "dayjs";
import UserModel from "./models/User.model";

export const Session = {
  Create: async (user: IUser): Promise<ISession> => {
    const expiresAt = dayjs().add(1, "day").toDate();
    const session = new SessionModel({ user, expiresAt });
    await session.save();

    return session;
  },
  Get: async (sessionId?: string) => {
    if (!sessionId) return null;
    return await SessionModel.findOne({ _id: sessionId });
  },
  Auth: async (
    sessionId?: string,
  ): Promise<{
    User: IUser;
    Session: ISession;
  }> => {
    const session = await Session.Get(sessionId);
    if (!session) throw new Error("Session not found");

    if (new Date(session.expiresAt) < new Date()) {
      await SessionModel.deleteOne({ _id: session._id });
      throw new Error("Session expired");
    }

    const user = await UserModel.findOne({ _id: session.user });
    if (!user) throw new Error("User not found");

    return { User: user, Session: session };
  },
  CurrentUser: async (sessionId?: string): Promise<IUser | null> => {
    const auth = await Session.Auth(sessionId)
      .catch(() => null)
      .then((auth) => ((auth?.User as IUser | null) ? auth : null));
    if (!auth) return null;
    return auth.User;
  },
};
