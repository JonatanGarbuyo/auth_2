//imports
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// to use Promises with mongoose:
mongoose.Promise = global.Promise;

// test //
// //mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/auth',{ useNewUrlParser: true })

const { User } = require('./models/user');
const {auth} = require('./middleware/auth');

const app = express();
// register middlewares
app.use(bodyParser.json());
app.use(cookieParser());


// post // 
app.post('/api/user',(req,res)=>{
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save((error,doc)=>{
        if(error) res.status(400).send(error)
        res.status(200).send(doc)
    })
})

app.post('/api/user/login', (req, res)=>{
    User.findOne({'email':req.body.email}, (error, user)=>{
        !user?
            res.json({message:'Auth failed. user not found'})
            :
            user.comparePassword(req.body.password, (error, isMatch)=>{
                if(error) throw error;
                if(!isMatch) return res.status(400).json({
                    message:"wrong password"
                });

                user.generateToken((error, user)=>{
                    if(error) return res.status(400).send(error);    
                    res.cookie('auth', user.token).status(200).send('ok');
                    
                })
            })
    })
});

app.get('/user/profile', auth, (req, res)=>{
    res.status(200).send(req.token);
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Started at port ${port}`);
}); 
