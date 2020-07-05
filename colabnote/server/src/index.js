const express = require('express')
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt  = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
require('dotenv').config();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));
//MongoDB Atlas connection
const mongoURL = process.env.MONGOURL;
mongoose.connect(mongoURL, {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
    console.log("Succesfully connected to database");
}).catch((err)=>{
    console.log(err);
})

require('../routes')(server);
//Websocket Connections for broadcasting file changes on port 4000

// let initValue={
//     type: 'paragraph',
//     children: [{ text: 'Sample Text' }],
// };

let groupData = {};

//handling get request on port 4000
server.get('/groups/:groupId', (req, res)=>{
    const {groupId} = req.params;
    if(groupId === 'try'){
        let value={
            type: 'paragraph',
            children: [{ text: 'Sample Text' }],
        };
        res.send(value);
    }
    else{
    let tmp = '';
    fetch('http://localhost:5000/api/note/getnotebyid',
        { method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                docId : groupId
            })
        })
        .then(res => res.json())
        .then(json => {
            if(!json){
                let value={
                    type: 'paragraph',
                    children: [{ text: 'Sample Text' }],
                };
                res.send(value);
            }
            else{
                const {note} = json;
                const {data} = note;
                let value={
                    type: 'paragraph',
                    children: [{ text: data }],
                };
                res.send(value);
            }
        })
    }
    //console.log(groupData[groupId]);
})

let serverref = server.listen(5000, (err) => {
    console.log("APIs and websocket listening on port 5000");
});

const io = require('socket.io').listen(serverref);
io.on('connection', (socket) => {
    console.log("Websocket received a connection");
    // io.emit('init-value', initValue);
    socket.on('new-operations', (data)=>{
        fetch('http://localhost:5000/api/note/save',
        { method: 'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id : data.groupIdDest,
                'data' : (data.value.children)[0].text
            })
        })
        .then(res => res.json())
        .then(json => {
            tmp = json.docs;
        })
        .then(()=>{
            io.emit(`new-remote-operations-${data.groupIdDest}`, data); //broadcast remote change to everyone
        })
        // groupData[data.groupIdDest] = data.value;
    });
});
  
module.exports = server;