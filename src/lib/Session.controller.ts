import type { IUser } from "./models/User.model";
import SessionModel, { type ISession } from "./models/Session.model";
import dayjs from "dayjs";

export const Session = {
  Create: async (user: IUser): Promise<ISession> => {
    const expiresAt = dayjs().add(1, "day").toDate();
    const session = new SessionModel({ user, expiresAt });
    await session.save();

    return session;
  },
  Get: async (sessionId: string) => {
    return await SessionModel.findOne({ _id: sessionId });
  },
};
