import mongoose, { type ObjectId } from "mongoose";
import type { IUser } from "./User.model";

export interface ISession extends Document {
  _id: ObjectId;
  user: IUser;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema: mongoose.Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, required: true },
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
