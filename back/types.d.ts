import {WebSocket} from "ws";
import {ObjectId} from "mongoose";

export interface ActiveConnections {
  [id: string]: WebSocket;
}

export interface IncomingMessage {
  type: string;
  payload: string;
}

export interface IUser {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

