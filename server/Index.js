const express=require("express");
const cors=require("cors");
const {Server}=require("socket.io");
const http=require("http");
const mongoose=require("mongoose");
const { timeStamp } = require("console");
const app=express();
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin : "http://localhost/3000",
        methods : ["GET","POST"]
    },
});
const userSchema=new mongoose.Schema({
    sender:String,
    receiver:String,
    room:String,
    text:String
})
const Messages=mongoose.model("Messages",userSchema);
io.on("connection",(socket)=>{
    console.log("User connected",socket.id);
    const messages=Messages.find().sort({timeStamp : 1}).limit(50);
    socket.emit("chat_history",messages);


    socket.on("send_message",(data)=>{
        const {sender,receiver,text,room}=data;
        const newMessage=new Messages({sender,receiver,text,room});
        newMessage.save();
        io.to(room).emit("receive_messages",data);
    })
    
    socket.on("disconnected",()=>{
        console.log("User Disconnected",socket.id);
    });
})