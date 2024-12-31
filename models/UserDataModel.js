const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    isim:{
        type:String,
        required:true,
    },    
    soyisim:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    parola:{
        type:String,
        required:true,
    },
})

//şemaya User üzerinden erişebiliriz 
//3. parametre collection ismini bulur
const User = mongoose.model('User',UserSchema,'Users')
module.exports = User