const otpService = require('./services/otp-service')
const hashService = require('./services/hash-service')
const userService = require('./services/user-service')
const tokenService = require('./services/token-service')
const userDto = require('../dtos/user-dto')
const refreshToken = require('../models/refreshToken')
class AuthController {
    async sendOtp(req,res){
        const { phone } = req.body;
        if(!phone){
            res.status(400).json({message:'phone field is required'})
        }

        const otp = await otpService.generateOtp();
        const ttl = 1000*60*2;
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`
        const hashedOtp = hashService.hashOtp(data);

         try{
            otpService.sendBySms(phone,otp)
            res.status(200).json({
                hash:`${hashedOtp}.${expires}`,
                phone:phone
            })
         } catch(err){
             console.log(err)
             res.status(500).json({message:'failed'})
         }


        
    }

    async verifyOtp(req,res){
        const { otp, phone, hash} = req.body
        console.log("jajajajjajakak",otp, phone, hash)
        if(!(otp || hash || phone)){
            res.status(400).json({message:"all details required"})
        }
       
        const [hashedOtp, expires] = hash.split('.');
      
        if(Date.now() > +expires){
            res.status(400).json({message:"otp expired"})
        }

        const data =  `${phone}.${otp}.${expires}`
        const invalid = otpService.verifyOtp(hashedOtp,data)
        if(!invalid){
            res.status(400).json({message:'Invalid Token'})
        }

        
        let user;

        try{
            user = await userService.checkUser({phone:phone})
            if(!user){
                user = await userService.createUser({phone})
            }
        }catch(err){
            console.log(err)
            res.status(500).json({message:"error occured"})
        }

        //Token
        const { accessToken,refreshToken } = tokenService.generateTokens({_id:user._id, activated: user.activated})

        await tokenService.storeRefreshToken(refreshToken,user._id);

        res.cookie('refreshToken',refreshToken, {
            maxAge:1000*60*60*24*30,
            httpOnly:true

        })

        res.cookie('accessToken',accessToken, {
            maxAge:1000*60*60*24*30,
            httpOnly:true

        })


        const userdto = new userDto(user)
        res.json({  user:userdto, auth:true })


    }

    async refreshTokenValidation(req,res){
        //get refresh token from header

        const { refreshToken: refreshTokenFromCookie } = req.cookies;


        //check token is valid or not
        let userData;
        try{
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err){
            return res.status(401).json({message:"Invalid Token"})
        }


        
        //check if token in database
        try{
            const refreshToken = await tokenService.findRefreshToken(userData._id,refreshTokenFromCookie)
            if(!refreshToken){
                return res.status(401).json({message:"No Token found"})
            }
        }catch(err){
            return res.status(500).json({message:"Internal error"})
        }

        //check if user
        const user = await userService.checkUser({_id:userData._id})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        // generate new tokens
        const { accessToken, refreshToken } = await tokenService.generateTokens({_id:userData._id})

        // update refresh token

        try{
            const token = await tokenService.updateRefreshToken(refreshToken,user._id);
        }catch(err){
            return res.status(500).json({message:"Internal error"})
        }

        

         // put tokens in cookies

        res.cookie('refreshToken',refreshToken, {
            maxAge:1000*60*60*24*30,
            httpOnly:true

        })

        res.cookie('accessToken',accessToken, {
            maxAge:1000*60*60*24*30,
            httpOnly:true

        })

        // response

        const userdto = new userDto(user)
        return res.json({  user:userdto, auth:true })
        
       
        
    }

    async logout(req,res) {

        const { refreshToken } = req.cookies;
        // delete refresh token from db
        await tokenService.deleteRefreshToken(refreshToken)
        // delete cookies
        res.clearCookie('refreshToken')
        res.clearCookie('accessToken')
        res.status(200).json({ user:null,auth:false});
    }
}

module.exports = new AuthController();