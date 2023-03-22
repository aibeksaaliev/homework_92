import mongoose, {Schema, Types} from "mongoose";
import {IMessage} from "../types";
import User from "./User";

const MessageSchema = new Schema<IMessage>({
  text: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => User.findById(value),
      message: "User does not exist"
    }
  },
  postedAt: {
    type: Date,
    required: true
  }
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;