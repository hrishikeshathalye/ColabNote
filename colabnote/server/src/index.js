const express = require('express')
const wsserver = express();
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt  = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();
wsserver.use(cors());
//server.use(cors());
wsserver.use(bodyParser.json());
wsserver.use(bodyParser.urlencoded({extended:false}));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
//MongoDB Atlas connection
const mongoURL = process.env.MONGOURL;
mongoose.connect(mongoURL, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log("Succesfully connected to database");
}).catch((err)=>{
    console.log(err);
})

require('../routes')(server);
//Websocket Connections for broadcasting file changes on port 4000

let initValue={
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
};

let groupData = {};

//handling get request on port 4000
wsserver.get('/groups/:groupId', (req, res)=>{
    const {groupId} = req.params;
    if(!(groupId in groupData)){
        groupData[groupId] = initValue;
    }
    //console.log(groupData[groupId]);
    res.send(groupData[groupId]);
})

wsserverref = wsserver.listen(4000, ()=>{
    console.log("Server for websocket running on port 4000");
});

const io = require('socket.io').listen(wsserverref);
io.on('connection', (socket) => {
    console.log("Websocket received a connection");
    io.emit('init-value', initValue);
    socket.on('new-operations', (data)=>{
        console.log(data.value);
        groupData[data.groupIdDest] = data.value;
        io.emit(`new-remote-operations-${data.groupIdDest}`, data); //broadcast remote change to everyone
    });
});

server.listen(5000, '0.0.0.0', (err) => {
    console.log("APIs listening on port 5000");
});
  
module.exports = server;