import mongoose, { type ObjectId } from "mongoose";
const { Schema, Document, models, model, Model } = mongoose;
const SALT_WORK_FACTOR = 10;
import bcrypt from "bcryptjs";
import type { ISession } from "./Session.model";

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageUri?: string;
  connectedProviders?: {
    Discord: string;
  };
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    imageUri: { type: String },
    connectedProviders: {
      Discord: {
        type: String,
        ref: "DiscordUser",
      },
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>("save", function (next) {
  var user = this;
  if (!(user as any).isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

export const comparePassword = function (
  userPassword: string,
  candidatePassword: string,
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, userPassword, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

let users;

try {
  users = model<IUser>("User");
} catch (error) {
  users = model<IUser>("User", UserSchema);
}

export default users as mongoose.Model<IUser>;
