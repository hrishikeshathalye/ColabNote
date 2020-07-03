//note api which implements function for notes like create, save, getNotesByOwner, getNotesbyAuthUser, delete, edit, addauthuser, removeauthuser
//each note has an id(default mongo id, so it is guaranteed to be unique) all notes rendered on users screen by this id, /group/note_id
const Note = require('../../models/note');
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
}