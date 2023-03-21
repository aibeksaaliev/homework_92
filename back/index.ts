import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import {ActiveConnections} from "./types";
import {randomUUID} from "crypto";
import usersRouter from "./routers/users";

const app = express();
expressWs(app);

const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);

const router = express.Router();

const activeConnections: ActiveConnections = {};
