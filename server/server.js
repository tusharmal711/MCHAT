import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import route from "./userRoute.js";

dotenv.config();
const FRONTEND_URL=process.env.FRONTEND_URL;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());
app.use("/api", route);

app.get("/", (req, res) => {
    res.send("Welcome to the home page");
});

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL, { useNewUrlParser: true});
        console.log("DB is connected");
    } catch (error) {
        console.log("DB is not connected", error.message);
        process.exit(1);
    }
};
connectDB();

// Message schema and model
const userSchema = new mongoose.Schema({
   userName:String,
   text: String,
    room: String,
    timeStamp:String
});
const Messages = mongoose.model("Messages", userSchema);

// Socket.io connection
io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);
  
    socket.on("join_room", async (room) => {
      socket.join(room);
  
      // Fetch and send previous messages for the room
      const messages = await Messages.find({ room }).sort({ timestamp: 1 }).limit(50);
      socket.emit("chat_history", messages);
    });
  
    socket.on("send_message", async (data) => {
      const { userName, text, room , timeStamp } = data;
  
      // Save the message in MongoDB
      const newMessage = new Messages({ userName, text, room ,timeStamp });
      await newMessage.save(); // Await to ensure message is stored before broadcasting
    
      // Broadcast to the room
      io.to(room).emit("receive_message", data);




      
    });
    socket.on("typing", ({ room, userName }) => {
      // console.log(`User ${userName} is typing in room ${room}`);
      socket.to(room).emit("show_typing", userName); // Send event to others in room
    });
  
    // Listen for "stop_typing" event
    socket.on("stop_typing", ({ room }) => {
      // console.log(`Typing stopped in room ${room}`);
      socket.to(room).emit("hide_typing"); // Notify others to remove indicator
    });



    socket.on("send-notification", ({ sender, receiver, message }) => {
      const receiverSocketId = users[receiver];
  
     
    });
  





    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
server.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});