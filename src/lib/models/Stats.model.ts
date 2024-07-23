import mongoose, { type ObjectId } from "mongoose";
const { Schema, model } = mongoose;

export interface IStats<TValue> extends Document {
  _id: ObjectId;
  userId: string;
  serverId: "global" | {};
  name: string;
  value: TValue;
  date: Date;
}

const StatsSchema = new Schema<IStats<{}>>({
  userId: { type: String, required: true },
  serverId: { type: String, required: true, default: "global" },
  name: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  date: { type: Date, required: true },
});

let Stats: mongoose.Model<IStats<{}>>;

try {
  Stats = model<IStats<{}>>("Stats");
} catch {
  Stats = model("Stats", StatsSchema);
}

export default Stats;
