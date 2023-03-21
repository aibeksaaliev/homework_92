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
  }
});

const Message = mongoose.model('Artist', MessageSchema);
export default Message;