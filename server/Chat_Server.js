const express=require("express");
const cors=require("cors");
const {server} = require("socket.io");
const http=require("http");
const mongoose=require("mongoose");
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
  cors : {
    origin : "http://localhost/3000",
    methods : ["GET","POST"]
  },
});
const userSchema=new mongoose.Schema({
  username:String,
  text:String,
  room:String
});
const Messages=mongoose.model("Messages",userSchema);

io.on("connection",(socket)=>{
  console.log("userconnected :",socket.id);
  const messages=Messages.find().sort({timestamp : 1}).limit(50);
  socket.emit("chat_history",messages);
  socket.on("send_message",(data)=>{
    const {username,text,room}=data;
    const newMessage=new Messages({username,text,room});
    newMessage.save();
    io.to(room).emit("receive_message",data);
  });
  socket.on("disconnect",()=>{
    console.log("User Disconnected",socket.id);
  });
});
server.listen(3001,()=>{
  console.log("Server is running on port 3001");
});

