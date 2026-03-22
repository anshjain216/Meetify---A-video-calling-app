import { Server, Socket } from "socket.io"

export const connectToServer = (server)=>{
    const io = new Server(server,{
        cors:{
            origin: "*",
            methods:["GET","POST"]
        }
    });

    const messages = {};
    const timeOnline = {};

    io.on("connection",(socket)=>{
        console.log("User connected : " ,socket.id);

        socket.on("join-call",(roomId)=>{
            socket.join(roomId);
            timeOnline[socket.id] = new Date();
            console.log(socket.id , " joined room :",roomId);
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId)) || [];
            socket.emit("connected-users",clients);
            socket.to(roomId).emit("user-joined",socket.id);
            if(messages[roomId]){
                messages[roomId].forEach(msg=>{
                    socket.emit("chat-message",msg.data,msg.sender,msg.socketId);
                })
            }
        })
        socket.on("signal",(toId,signalData)=>{
            io.to(toId).emit("signal",socket.id,signalData);
        })

        socket.on("chat-message",(roomId,data,sender)=>{
            if(!messages[roomId]){
                messages[roomId]=[];
            }
            const messageData = {
                data,
                sender,
                socketId:socket.id
            }
            messages[roomId].push(messageData);

            io.to(roomId).emit("chat-message",data,sender,socket.id);
        })

        // Fires *before* the socket leaves rooms — required so `user-left` reaches peers.
        // On `disconnect`, `socket.rooms` is often empty, so notify here instead.
        socket.on("disconnecting",()=>{
            socket.rooms.forEach((roomId)=>{
                if(roomId===socket.id) return;
                socket.to(roomId).emit("user-left",socket.id);
                const room = io.sockets.adapter.rooms.get(roomId);
                if(!room || room.size===1){
                    delete messages[roomId];
                    console.log("Room deleted:", roomId);
                }
            });
        });

        socket.on("disconnect",()=>{
            console.log("User disconnected:", socket.id);
            if(timeOnline[socket.id]){
                const sdate = timeOnline[socket.id];
                const ldate = new Date();
                const duration = Math.floor((ldate-sdate)/1000);
                console.log(`User ${socket.id} stayed ${duration} seconds`);
                delete timeOnline[socket.id];
            }
        })
    })
    return io;
}