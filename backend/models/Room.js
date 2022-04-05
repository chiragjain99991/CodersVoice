const mongoose = require('mongoose')
let roomSchema = new mongoose.Schema({
    topic:{
        type:String,
        default:'',
        required: true
    },
    roomType:{
        type:String,
        default:'',
        required: true
    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:'User'
    },
    speakers:{
        type:[
            {
                type:mongoose.Schema.Types.ObjectId ,
                ref:'User'
            }
        ],
        required:false
    }
},
{ timestamps : true}
)

module.exports = mongoose.model('Room',roomSchema,'rooms')