const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FilmSchema = new Schema({
    title:{
        type:String,
        required:true,
    },    
    info:{
        type:String,
        required:true,
    },
    lengthofmovie:{
        type:String,
        required:true
    },
    summary:{
        type:String,
        required:true
    },
    cast:{
        type:String,
        required:true
    },
    director:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:true
    }
})

//şemaya User üzerinden erişebiliriz 
//3. parametre collection ismini bulur
const Film = mongoose.model('Film',FilmSchema,'Filmler')
module.exports = Film