import mongoose, { type ObjectId } from "mongoose";
import type { IUser } from "./User.model";
import bcrypt from "bcryptjs";
const SALT_WORK_FACTOR = 10;

export interface ISession extends Document {
  _id: string;
  encryptedSession?: string;
  user: IUser;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, required: true },
    encryptedSession: { type: String },
  },
  { timestamps: true },
);

let sessions;

try {
  sessions = mongoose.model<ISession>("Session");
} catch (error) {
  sessions = mongoose.model<ISession>("Session", SessionSchema);
}

export default sessions as mongoose.Model<ISession>;
