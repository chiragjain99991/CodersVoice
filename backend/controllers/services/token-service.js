const jwt = require('jsonwebtoken');
const RefreshToken = require('../../models/refreshToken')
class tokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_TOKEN_SECRET,{
            expiresIn:'1h'
        })
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_TOKEN_SECRET,{
            expiresIn:'1y'
        });
        return {accessToken,refreshToken}
    }

    async storeRefreshToken(token,userId){
        try{
            const refreshToken = await RefreshToken.create({token,userId})
        } catch(err){
            console.log(err)
        }
    }
    async verifyAccessToken(accessToken){
        return jwt.verify(accessToken,process.env.JWT_ACCESS_TOKEN_SECRET)
    }
    async verifyRefreshToken(refreshToken){
        return jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN_SECRET)
    }

    async findRefreshToken(userId,token){
        return await RefreshToken.findOne({userId, token})
        
    }

    async updateRefreshToken(token,userId){
        try{
            return await RefreshToken.updateOne({userId},{token})
        } catch(err){
            console.log(err)
        }
    }
    async deleteRefreshToken(token){
        try{
            return await RefreshToken.deleteOne({token})
        } catch(err){
            console.log(err)
        }
    }
  
}
module.exports = new tokenService()