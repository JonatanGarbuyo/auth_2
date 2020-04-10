const bcrypt = require('bcrypt');
const {MD5} =require('crypto-js');

// bcrypt.genSalt(10, (error, salt)=>{
//     console.log('salt');
//     console.log(salt);
//     if(error) return next(error);

//     bcrypt.hash('password123', salt, (error, hash)=>{
//         if(error) return next(error);
//         console.log('hash');
//         console.log(hash);
//     })
// })


const user = {
    id:1,
    token: MD5('qweasdzxc').toString()
}

console.log(user);