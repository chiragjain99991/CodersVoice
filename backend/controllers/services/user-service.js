const User = require('../../models/User')
class userService {
    async checkUser(filter){
        try{
            const user = await User.findOne(filter);
            return user
        }catch(err){
            console.log(err)
        }
        
        
    }

    async createUser(data){
        try{
            const user = await User.create(data);
            return user;
        }catch(err){
            console.log(err)
        }
        
    }

     
}

module.exports = new userService()