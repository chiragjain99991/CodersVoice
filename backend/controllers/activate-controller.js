const Jimp = require('jimp');
const path = require('path');
const userDto = require('../dtos/user-dto');
const userService = require('./services/user-service');
class ActivateController{
    async activate(req,res){
        const { name, avatar } = req.body;
       
        if(!name || !avatar){
            res.status(400).json({message:'incomplete data'});
        }
        //image 
        const buffer = Buffer.from(
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
            'base64'
        );
        const imagePath = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}.png`;
        // 32478362874-3242342342343432.png

        try {
            const jimResp = await Jimp.read(buffer);
            jimResp
                .resize(150, Jimp.AUTO)
                .write(path.resolve(__dirname, `../storage/${imagePath}`));
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: 'Could not process the image' });
        }


        //update user
        try{
            const userId = req.user._id
            const user = await userService.checkUser({_id:userId})
            if(!user){
                res.status(404).json({message:"can't find user"});
            }
    
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`
            await user.save();
            res.json({user:new userDto(user), auth: true})
    
        }catch(err){
            console.log(err)
            res.status(500).json({message:"something went wrong"});
        }

        
    }
}

module.exports = new ActivateController()