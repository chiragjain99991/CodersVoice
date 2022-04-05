const mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:''
    },
    avatar:{
        type:String,
        default:'',
        get: (avatar) => {
            return `${process.env.BASE_URL}${avatar}`
        }
    },
    phone:{
        type:String,
        required:true
    },
    activated:{
        type:Boolean,
        default:false
    }
},
{ 
    timestamps : true,
    toJSON: { getters: true }
}
)

module.exports = mongoose.model('User',userSchema,'users')