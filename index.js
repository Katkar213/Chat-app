const path=require("path")
const express=require("express")
const app= express();
const socket=require('socket.io')

app.use(express.static(path.join(__dirname,"public")))
let socketConnected=new Set();

const server=app.listen(4001,()=>{
    console.log("server runing fine" )
})

const io=socket(server)

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id);
    io.emit('client-total',socketConnected.size)

   socket.on('disconnect',()=>{
    console.log(`socketdisconnected`,socket.id)
    socketConnected.delete(socket.id);
    io.emit('client-total',socketConnected.size)

   })

   socket.on('message',(data)=>{
    console.log(data)
    socket.broadcast.emit('chat-message',data)
   })

   socket.on('feedback',(data)=>{
    socket.broadcast.emit('feedback',data)
   })

}






