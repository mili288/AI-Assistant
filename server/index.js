import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import Whisper from "whisper-nodejs";
import dotenv from "dotenv";
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import promptRoutes from './routes/promptRoutes.js'

dotenv.config();

const whisper = new Whisper(process.env.OPENAI_API_KEY);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

dotenv.config();

app.use(express.json());

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("prompt", async (text) => {
    console.log(`Received prompt: ${text}`);
  });

  socket.on("response", async (text) => {
    console.log(`Generated response: ${text}`);
    const audio = await whisper.speechSynthesize(text, {
      voice: "en-US-LisaNeural",
      speed: 1.1,
    });
    socket.emit("response", audio);
  });

  socket.on("disconnected", () => {
    console.log("User disconnected");
  });
});

app.use(cors()); // Enable CORS
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use('/ask', promptRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
