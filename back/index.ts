import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import {ActiveConnections, IncomingMessage, IUser} from "./types";
import {randomUUID} from "crypto";
import usersRouter from "./routers/users";
import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Message from "./models/Message";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);

const router = express.Router();

const activeConnections: ActiveConnections = {};

router.ws('/chat', async (ws) => {
  const id = randomUUID();
  activeConnections[id] = ws;

  let user: IUser | null = null;

  ws.on('message', async (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

    switch (decodedMessage.type) {
      case "LOGIN":
        const authorizedUSer = await User.findOneAndUpdate({token: decodedMessage.payload}, {online: true});
        if (!authorizedUSer) break;

        user = authorizedUSer;

        const onlineUsers = await User.find({online: true});
        const lastMessages = await Message.find().sort({postedAt: 1}).limit(30).populate("author", "username");
        Object.keys(activeConnections).forEach(connId => {
          const conn = activeConnections[connId];

          conn.send(JSON.stringify({
            type: 'LAST_MESSAGES',
            payload: lastMessages,
          }));

          conn.send(JSON.stringify({
            type: 'ONLINE_USERS',
            payload: onlineUsers
          }));
        });
        break;
      case "SEND_MESSAGE":
        const message = await Message.create({
          text: decodedMessage.payload,
          author: user?._id,
          postedAt: new Date()
        });

        await message.save();
        const newMessage = await Message.findById(message._id).populate("author", "username");

        Object.keys(activeConnections).forEach(connId => {
          const conn = activeConnections[connId];

          conn.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: [newMessage],
          }));
        });
        break;
      default:
        console.log('Unknown message type:', decodedMessage.type);
    }
  });

  ws.on('close', async () => {
    if (user) {
      await User.findByIdAndUpdate(user._id, {online: false});
      const onlineUsers = await User.find({online: true});
      const lastMessages = await Message.find().sort({ postedAt: 1 }).limit(30).populate("author", "username");
      Object.keys(activeConnections).forEach(connId => {
        const conn = activeConnections[connId];

        conn.send(JSON.stringify({
          type: 'LAST_MESSAGES',
          payload: lastMessages,
        }));

        conn.send(JSON.stringify({
          type: 'ONLINE_USERS',
          payload: onlineUsers
        }));
      });
    }

    delete activeConnections[id];
  })
});

app.use(router);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log("We are live on " + port);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
