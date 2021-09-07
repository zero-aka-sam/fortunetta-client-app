import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routes/user.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import Chat from "./models/chat.js";
import { operator } from "./operator.js";
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000/",
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL =
  "mongodb+srv://bscgamble:targetFIXED08@@cluster0.77pbx.mongodb.net/Fortunetta?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

const connect = mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log(`mongodb connected`))
  .catch((error) => console.log(`${error} did not connect`));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Homepage");
});

server.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});

io.on("connection", (socket) => {
  operator(socket);

  //EMITTING ALL THE CHATS FROM DATABASE

  Chat.find().then((result) => {
    socket.emit("output_messages", result);
  });

  //HANDLING INPUT MESSAGE FROM USER

  socket.on("send_message", (Content) => {
    try {
      let chat = new Chat({
        message: Content.message,
        userId: Content.userId,
        // avatar: Content.avatar,
        // userName: Content.userName,
      });

      chat.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        Chat.find({ _id: doc._id })
          .populate("sender")
          .exec((err, doc) => {
            return io.emit("receive", Content);
          });
        // return io.emit("receive", Content);
      });
    } catch (error) {
      console.error(error);
    }
  });
});
