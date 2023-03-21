import {WebSocket} from "ws";
import {ObjectId} from "mongoose";

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface Message {
  text: string;
  author: ObjectId;
  id: string;
}

export interface IncomingMessage {
  type: string;
  payload: Message;
}

export interface IUser {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface IMessage {
  text: string;
  author: ObjectId;
}

