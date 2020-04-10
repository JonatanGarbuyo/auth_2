const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    token:{
        type:String
    }
});

// // test //
// userSchema.post('save', function (doc) {
//     console.log('this fired after a document was saved');
//     console.log(doc);
//   });

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(error, salt){
            if(error) return next(error);
            bcrypt.hash(user.password, salt, function(error, hash){
                if(error) return next(error);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch){
        if(error) throw callback(error);
        callback(null,isMatch);
    })
}

userSchema.methods.generateToken = function(callback){
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'supersecret');
    user.token = token;
    user.save(function(error, user){
        if(error) return callback(error);
        callback(null,user);
    })

}

userSchema.statics.findByToken = function(token, cb){
    const user = this;
    jwt.verify(token, 'supersecret', function(error, decode){
        user.findOne({"_id":decode, "token":token}, function(error, user){
            if(error) return cb(error);
            cb(null,user);
        })
    })
}
  
const User = mongoose.model('User',userSchema);

module.exports = { User };