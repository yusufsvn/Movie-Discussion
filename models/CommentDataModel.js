const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    filmid:{
        type:Object,
        required:true
    },
    user:{
        type:Object,// ?
        required:true
    },
    text:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        required:true
    },
    parentCommentId:{
        type:String,
        required:true
    }

})


const remark = mongoose.model('remark',CommentSchema,'Comments')
module.exports = remark