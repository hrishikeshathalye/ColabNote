//A schema of documents which contains document id, data, owner, authorized users
const mongoose = require("mongoose");
//Schema Declarations
const noteSchema = new mongoose.Schema({
    data: {
        type:String
    },
    owner: {    //owner of email
        type:String,
        required : true
    },
    auth_users: {
        type: String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});

module.exports = Note = mongoose.model('notes', noteSchema);

