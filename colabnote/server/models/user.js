const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//Schema Declarations
const userSchema = new mongoose.Schema({
    first_name: {
        type:String
    },
    last_name: {
        type:String
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = User = mongoose.model('users', userSchema);

