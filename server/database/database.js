import Mongoose from "mongoose";
import { config } from "../config.js";

export function connectDB() {
  return Mongoose.connect(config.db.host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

// _id => id
export function useVirtualId(schema) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toOject", { virtuals: true });
}

// TODO(ellie): Delete blow
let db;

export function getTweets() {
  return db.collection("tweets");
}
