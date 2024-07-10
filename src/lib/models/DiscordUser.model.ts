import mongoose, { type ObjectId } from "mongoose";

export interface IDiscordUser extends Document {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  linkedUser: ObjectId;
}

const DiscordUserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    linkedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, _id: false },
);

export default mongoose.models.DiscordUser ||
  mongoose.model<IDiscordUser>("DiscordUser", DiscordUserSchema);
