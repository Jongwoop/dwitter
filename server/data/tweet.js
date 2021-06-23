import MongoDb from "mongodb";
import { getTweets } from "../database/database.js";
import * as UserRepository from "./auth.js";
const ObjectID = MongoDb.ObjectID;

// profile server
// user document server  => NoSQL -> server1, server 2, server3 (no relation)
// duplication > relation
//

export async function getAll() {
  return getTweets() //
    .find()
    .sort({ createdAt: -1 }) // descending
    .toArray() // cursor, _id
    .then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets() //
    .find({ username })
    .sort({ createdAt: -1 }) // descending
    .toArray() // cursor, _id
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets() //
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  return UserRepository.findById(userId)
    .then((user) =>
      getTweets().insertOne({
        text,
        createdAt: new Date(),
        userId,
        name: user.name,
        username: user.username,
        url: user.url,
      })
    )
    .then((result) => result.ops[0])
    .then(mapOptionalTweet);
}

export async function update(id, text) {
  return getTweets()
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { text } },
      { returnOriginal: false }
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets().deleteOne({ _id: new ObjectID(id) });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}
