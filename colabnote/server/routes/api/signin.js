const User = require('../../models/user');
const UserSession = require('../../models/userSession');
module.exports = (app) => {
    app.post('/api/account/signup', (req,res,next)=>{
        const {body} = req;
        let {
            firstname,
            lastname,
            email,
            password
        } = body;
        if(!firstname){
            return res.send({
                success:false,
                message:'Error" Missing Firstname'
            })
        }
        if(!lastname){
            return res.send({
                success:false,
                message:'Error" Missing lastname'
            })
        }
        if(!email){
            return res.send({
                success:false,
                message:'Error" Missing email'
            })
        }
        if(!password){
            return res.send({
                success:false,
                message:'Error" Missing password'
            })
        }
        email = email.toLowerCase();
        User.find({
            email:email
        }, (err, previousUsers)=>{
            if(err){
                return res.send({
                    success:false,
                    message:'Error: Server Error'
                })
            }
            else if(previousUsers.length > 0){
                return res.send({
                    success:false,
                    message:'Error: user already exists'
                })
            }
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.first_name = firstname;
            newUser.last_name = lastname;
            newUser.save((err, user)=>{
                if(err){
                    return res.send({
                        success:false,
                        message:'Server Error'
                    })                   
                }
                return res.send({
                    success:true,
                    message:'Signed Up'
                })
            });
        })
    });

    app.post('/api/account/signin', (req,res,next)=>{
        const {body} = req;
        let {
            email,
            password
        } = body;
        if(!email){
            return res.send({
                success:false,
                message:'Error" Missing email'
            })
        }
        if(!password){
            return res.send({
                success:false,
                message:'Error" Missing password'
            })
        }
        email = email.toLowerCase();
        User.find({
            email:email
        },(err, users)=>{
            if(err){
                res.send({
                    success:false,
                    message:'Server error'
                })
            }
            else if(users.length != 1){
                res.send({
                    success:false,
                    message:'Invalid'
                })  
            }
            else{
                user = users[0];
                if(!user.validPassword(password)){
                    res.send({
                        success:false,
                        message:'invalid password'
                    })
                }
                else{
                    const userSession = new UserSession();
                    userSession.userId = user._id;
                    userSession.save((err, doc)=>{
                        if(err){
                            res.send({
                                success:false,
                                message:'invalid err'
                            })
                        }
                        res.send({
                            success:true,
                            message:'Valid Sign in',
                            token:[doc._id, user._id]
                        });
                    });
                }
            }
        })
    });

    //Not completely implemented
    app.get('/api/account/verify', (req,res,next)=>{
        const {query} = req;
        const {token} = query;
        UserSession.find({
            _id:token,
            isDeleted:false,

        }, (err, sessions)=>{
            if(err){
                return res.send({
                    success:false,
                    message:"server error"
                })
            }
            if(sessions.length != 1){
                return res.send({
                    success:false,
                    message:"server error"
                })
            }
            else{
                return res.send({
                    success:true,
                    message:'Good'
                })
            }
        });
    });

    app.get('/api/account/logout', (req,res,next)=>{
        const {query} = req;
        const {token} = query;
        UserSession.findOneAndUpdate({
            _id:token,
            isDeleted:false
        },{
            $set:{isDeleted:"true"}
        }, null,
            (err, sessions)=>{
            if(err){
                return res.send({
                    success:false,
                    message:"server error"
                })
            }
            return res.send({
                success:true,
                message:'Good'
            });
        });
    });
}