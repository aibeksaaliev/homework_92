export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
}

export interface User {
  _id: string;
  username: string;
  token: string;
  role: string;
  displayName: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  message: string;
  name: string;
  _message: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}

export interface IncomingMessage {
  type: string;
  payload: Message[];
}

export interface Message {
  _id: string;
  text: string;
  author: OnlineUser;
}

export interface OnlineUser {
  _id: string;
  username: string;
}