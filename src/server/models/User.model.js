const mongoose = require("mongoose");
const {
    Model,
    Schema,
} = mongoose;
const userSchema = new Schema({
    user_id: { type: String, default: '' },
    github: { type: Object, default: {} },
    groups: [
        { type: String, default: '' }
    ],
    friends: [
        { type: String, default: '' }
    ],
    status: { type: String, default: 'offline' },
});
class UserClass extends Model {
    static async save(data) {
        let Group = require('./Group.model')
        let isGroupExist = await Group.find({})
        !isGroupExist.length && await Group.create({
            group_name: 'Moonlight',
            administratorList: [data.github.id],
            memberList: [],
            creator: [data.github.id],
        })
        let isUserExist = await this.findOne({ user_id: data.github.id })
        if (isUserExist) {
            await this.update({
                user_id: data.github.id,
            }, {
                    user_id: data.github.id,
                    github: data.github,
                })
        } else {
            await this.create({
                user_id: data.github.id.toString(),
                github: data.github,
                groups: [isGroupExist[0]._id.toString()]
            });
            await Group.join_member({
                group_id: isGroupExist[0]._id.toString(),
                user_id: data.github.id.toString()
            })
        }
    }
    static async findOnePretty(data) {
        let Group = require('./Group.model')
        let myInfo = await this.findOne(data)
        let newMyInfo = {
            user_id: myInfo.user_id,
            groups: myInfo.groups,
            friends: myInfo.friends,
            github: myInfo.github,
            status: myInfo.status
        };
        newMyInfo.groups = await Promise.all(myInfo.groups.map(async _id => {
            let groupInfo = await Group.findOne({ _id })
            return {
                group_name: groupInfo.group_name,
                group_id: groupInfo._id,
                avatar_url: groupInfo.avatar_url
            }
        }))
        //TODO
        //friends
        return newMyInfo
    }
    static async join_group(data) {
        await this.update(
            {
                user_id: data.user_id
            }, {
                $push: {
                    groups: data.group_id
                }
            }
        );
        return this.findOnePretty({ user_id: data.user_id })
    }
}

userSchema.loadClass(UserClass)
const User = mongoose.model('users', userSchema);

module.exports = User;