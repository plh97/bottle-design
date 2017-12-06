const mongoose = require("mongoose");
const {Model,Schema} = mongoose;
const tokenSchema = new Schema({
    access_token: String,
    user_id: String
});

const tokenModel = mongoose.model('token', tokenSchema);

class TokenClass extends Model {
    static async register(data){
        let isExist = await this.findOne({
            user_id:data.user_id
        })
        if(isExist){
            //如果有user_id,更新token，
            await this.update({
                user_id:data.user_id
            },{
                user_id:data.user_id,
                access_token: data.access_token,
            })
        }else{
            //没有则，保存 user_id && access_token
            await this.create({
                access_token: data.access_token,
                user_id:data.user_id
            })
        }
    }
    static async verify(data){
        let User = require('./User.model');
        let token = await this.findOne(data)
        if(token){
            //更新状态 --> 在线
            await User.update({
                user_id: token.user_id
            }, {
                status: 'online'
            })
            //然后再将用户信息发给前台
            let user = await User.findOnePretty({user_id:token.user_id})
            return user
        }else{
            return null
        }
    }
}

tokenSchema.loadClass(TokenClass)
const Token = mongoose.model('tokens', tokenSchema);
module.exports =  Token;