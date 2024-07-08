import type { IUser } from "./models/User.model";
import SessionModel, { type ISession } from "./models/Session.model";
import dayjs from "dayjs";
import UserModel from "./models/User.model";

export enum SessionError {
  SESSION_NOT_FOUND = "Session not found",
  SESSION_EXPIRED = "Session expired",
  USER_NOT_FOUND = "User not found",
}

export const Session = {
  Create: async (user: IUser): Promise<ISession> => {
    const expiresAt = dayjs().add(1, "day").toDate();
    const session = new SessionModel({ user, expiresAt });
    await session.save();

    return session;
  },
  Delete: async (sessionId?: string) => {
    if (!sessionId) return;
    await SessionModel.deleteOne({ _id: sessionId });
  },
  Get: async (sessionId?: string) => {
    if (!sessionId) return null;
    return await SessionModel.findOne({ _id: sessionId });
  },
  Auth: async (
    sessionId?: string,
  ): Promise<{
    success: boolean;
    message?: string;
    User?: IUser;
    Session?: ISession;
  }> => {
    const session = await Session.Get(sessionId);
    if (!session)
      return {
        success: false,
        message: SessionError.SESSION_NOT_FOUND,
      };

    if (new Date(session.expiresAt) < new Date()) {
      await SessionModel.deleteOne({ _id: session._id });
      return {
        success: false,
        message: SessionError.SESSION_EXPIRED,
      };
    }

    const user = await UserModel.findOne({ _id: session.user });
    if (!user)
      return {
        success: false,
        message: SessionError.USER_NOT_FOUND,
      };

    return { success: true, User: user, Session: session };
  },
  CurrentUser: async (sessionId?: string): Promise<IUser | null> => {
    const auth = await Session.Auth(sessionId)
      .catch(() => null)
      .then((auth) => ((auth?.User as IUser | null) ? auth : null));
    if (!auth) return null;
    return auth.User ? auth.User : null;
  },
};
