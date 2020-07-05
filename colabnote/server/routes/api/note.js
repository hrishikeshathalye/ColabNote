//note api which implements function for notes like create, save, getNotesByOwner, getNotesbyAuthUser, delete, edit, addauthuser, removeauthuser
//each note has an id(default mongo id, so it is guaranteed to be unique) all notes rendered on users screen by this id, /group/note_id
const Note = require('../../models/note');
const User = require('../../models/user');
module.exports = (app) => {
    //create note for the first time
    app.post('/api/note/create', (req,res,next)=>{
        const {body} = req;
        let {
            owner
        } = body;
        const newNote = new Note();
        newNote.owner = owner;
        newNote.data = '';
        newNote.auth_users = [];
        newNote.save((err, note)=>{
        if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })                   
            }
            return res.send({
                success:true,
                message:'Note Saved',
                id:note._id
            })
        });
    })
    //save note
    app.patch('/api/note/save', (req,res,next)=>{
        const {body} = req;
        let {
            id,
            data,
        } = body;
        Note.update( { '_id' : id }, {'data' : data}, (err, note)=>{
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })                   
            }
            return res.send({
                success:true,
                message:'Note Saved',
                id:note._id
            });
        });
    });
    //get notes owned by the person
    app.post('/api/note/getnotesbyowner', (req,res,next)=>{
        const {body} = req;
        let {
            owner
        } = body;
        Note.find({ 'owner': owner, isDeleted:false }, '_id data', function (err, docs) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    docs
                });
            }
        });
    });
    //get notes by note id/group id
    app.post('/api/note/getnotebyid', (req,res,next)=>{
        const {body} = req;
        let {
            docId
        } = body;
        Note.findById(docId, (err, note)=>{
        if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })                   
            }
            return res.send({
                note
            })
        });
    })
    //get notes share with the person
    app.post('/api/note/getnotesbyauthuser', (req,res,next)=>{
        const {body} = req;
        let {
            auth_user
        } = body;
        Note.find({ 'auth_users': auth_user, isDeleted:false }, '_id data', function (err, docs) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    docs
                });
            }
        });
    });
    //share note with a person
    app.patch('/api/note/addauthuser', (req,res,next)=>{
        const {body} = req;
        let {
            id,
            auth_user
        } = body;
        Note.update({ '_id':id, isDeleted:false }, {$push:{'auth_users':auth_user}}, function (err, docs) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    success:true,
                    message:'Good'
                });
            }
        });
    });
    //revoke access to a note 
    app.patch('/api/note/removeauthuser', (req,res,next)=>{
        const {body} = req;
        let {
            id,
            auth_user
        } = body;
        Note.update({ '_id':id,  isDeleted:false},{ $pull: { 'auth_users': auth_user } }, function (err, docs) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    success:true,
                    message:'Good'
                });
            }
        });
    });
    //delete note entirely
    app.delete('/api/note/delete', (req,res,next)=>{
        const {body} = req;
        let {
            id
        } = body;
        Note.findOneAndUpdate({ '_id':id, isDeleted:false }, {$set:{isDeleted:"true"}}, null, function (err, docs) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    success:true,
                    message:'Good'
                });
            }
        });
    });


    //takes in a noteId and returns id, email and name of the user authorised to use it
    app.post('/api/note/getauthusers', (req,res,next)=>{
        const {body} = req;
        let {
            noteId
        } = body;
        Note.findOne({ '_id': noteId, isDeleted:false }, 'auth_users', function (err, foundUsers) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else if(!(foundUsers)){
                return res.send(
                    []
                );
            }
            else{
                const auth_users = foundUsers.auth_users;
                User.find({
                    '_id': { $in: auth_users},
                    isDeleted:false
                },"id email first_name last_name", function(err, docs){
                     if(err){
                        return res.send({
                            success:false,
                            message:'Server Error'
                        })
                     }
                     else{
                        //console.log(docs);
                        return res.send(
                            docs
                        );
                     }
                });
            }
        });
    });

    //takes in a noteId and returns id, email and name of all users except authorised users
    app.post('/api/note/getothers', (req,res,next)=>{
        const {body} = req;
        let {
            noteId
        } = body;
        let ownerId = '';
        Note.findOne({ '_id': noteId, isDeleted:false }, 'owner', function (err, foundUser) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else if(!(foundUser)){
                return res.send(
                    []
                );
            }
            else{
                ownerId = foundUser.owner;
            }
        });
        Note.findOne({ '_id': noteId, isDeleted:false }, 'auth_users', function (err, foundUsers) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else if(!(foundUsers)){
                return res.send(
                    []
                );
            }
            else{
                const auth_users = foundUsers.auth_users;
                User.find({
                    '_id': { $nin: auth_users},
                    isDeleted:false
                },"id email first_name last_name", function(err, docs){
                     if(err){
                        return res.send({
                            success:false,
                            message:'Server Error'
                        })
                     }
                     else{
                        docs = docs.filter(function( obj ) {
                            return obj.id !== ownerId;
                        });
                        return res.send(
                            docs
                        );
                     }
                });
            }
        });
    });

    //check if a person owns a note
    app.post('/api/note/isowner', (req,res,next)=>{
        const {body} = req;
        let {
            noteId,
            userId
        } = body;
        Note.findOne({ '_id':noteId, isDeleted:false }, "owner", function (err, user) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                return res.send({
                    success: (user.owner===userId),
                    message:'Good'
                });
            }
        });
    });

    //check if a person is authorized to see a note
    app.post('/api/note/isauth', (req,res,next)=>{
        const {body} = req;
        let {
            noteId,
            userId
        } = body;
        Note.findOne({ '_id':noteId, isDeleted:false }, "auth_users", function (err, users) { 
            if(err){
                return res.send({
                    success:false,
                    message:'Server Error'
                })
            }
            else{
                if(!users){
                    return res.send({
                        success:false,
                        message:'Good'
                    });
                }
                else{
                    return res.send({
                        success:users.auth_users.includes(userId),
                        message:'Good'
                    });
                }
            }
        });
    });
}