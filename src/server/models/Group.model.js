const mongoose = require("mongoose");
const {Model,Schema} = mongoose;
const groupSchema = new Schema({
	group_name: { type: String, default: 'Moonlight' },
	avatar_url: { type: String, default: 'https://assets.suisuijiang.com/group_avatar_default.jpeg?imageView2/2/w/40/h/40' },
	creator: { type: String, default: '' },
	memberList: [
		{ type: String, default: '' }
	],
	administratorList: [
		{ type: String, default: '' }
	],
	messageList: [{
		//必填，根据id查询用户信息
		user_id: { type: String, default: '' },
		type: { type: String, default: '' },
		//3选1
		text: { type: String, default: '' },
		code: { type: String, default: '' },
		image: { type: Object, default: '' },
		//不用填
		create_time: { type: Date, default: Date.now  },
		update_time: { type: Date, default: new Date , index: true },
		_id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
		//改成空
		user_name: { type: String, default: '' },
		avatar_url: { type: String, default: '' },
	}],
	create_time: { type: Date, default: Date.now, index: true },
	update_time: { type: Date, default: Date.now, index: true },
});


class GroupClass extends Model {
	//基础创建，可拓展,如果该群名字重复了，那么退出
	async create(data) {
		let is_exist = await this.findOne({group_name:data.group_name})
		if(is_exist){
			return
		} 
		await this.insert(data)
		return await this.findOne({group_name:data.group_name})
	}
	static async sendMsg(data) {
		let msg = Object.assign({}, data, {
			name: '',
			avatar_url: ''
		})
		//更新 group.messageList
		await this.findByIdAndUpdate(
			msg.group_id,
			{
				$push: {
					messageList: msg
				}
			}
		);
		return msg
	}
	static async join_member(data){
		await this.update(
			{_id:data.group_id},
			{
				$push: {
					'memberList': data.user_id
				}
			}
		);
	}
	static async findOnePretty(data){
		let User = require('./User.model')
		let groupInfo = await this.findOne(data)
		if(!groupInfo) return
		let newGroupInfo = {
			administratorList:groupInfo.administratorList,
			memberList:groupInfo.memberList,
			messageList:groupInfo.messageList,
			update_time:groupInfo.update_time,
			create_time:groupInfo.create_time,
			_id:groupInfo._id,
			creator:groupInfo.creator,
			avatar_url:groupInfo.avatar_url,
			group_name:groupInfo.group_name
		}
		newGroupInfo.administratorList = await Promise.all(groupInfo.administratorList.map(async user_id => {
			let user = await User.findOne({ user_id: user_id })
			return {
				user_name: user.github.name,
				avatar_url: user.github.avatar_url,
				user_id:user_id
			}
		}))
		newGroupInfo.memberList = await Promise.all(groupInfo.memberList.map(async user_id => {
			let user = await User.findOne({ user_id: user_id })
			return {
				user_name: user.github.name,
				avatar_url: user.github.avatar_url,
				user_id:user_id
			}
		}))
		newGroupInfo.messageList = await Promise.all(groupInfo.messageList.map(async message=>{
			let user = await User.findOne({user_id:message.user_id})
			return {
				user_id: message.user_id,
				_id: message._id,
				avatar_url: user.github.avatar_url,
				user_name: user.github.name,
				update_time: message.update_time,
				create_time: message.create_time,
				image: message.image,
				code: message.code,
				text: message.text,
				type: message.type,
			}
		}))
		return newGroupInfo
	}
}

groupSchema.loadClass(GroupClass)
const Group = mongoose.model('groups', groupSchema);

module.exports = Group;
