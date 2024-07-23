import mongoose, { type ObjectId } from "mongoose";
import type { IUser } from "./User.model";
const { Schema, model } = mongoose;

export interface IServer extends Document {
  _id: ObjectId;
  display_name: string;
  name: string;
  user: IUser;
  address: string;
  port: string;
  plugin_port: string;
  plugin_api_key: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServerSchema = new Schema<IServer>(
  {
    display_name: { type: String, required: true },
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    port: { type: String, required: true },
    plugin_port: { type: String, required: true },
    plugin_api_key: { type: String, required: true },
  },
  { timestamps: true },
);

let ServerModel: mongoose.Model<IServer>;

try {
  ServerModel = model("Server") as mongoose.Model<IServer>;
} catch {
  ServerModel = model("Server", ServerSchema);
}

export default ServerModel;
