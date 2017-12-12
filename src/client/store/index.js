import io from 'socket.io-client';
import { action, useStrict, computed, observable } from "mobx";

// useStrict(true)
class TodoStore {
	//我的用户信息
	@observable is_edit = true
	@observable images = []
	@observable texts = []
	//画板相关参数交给mobx处理，接受全局管理
	@observable block_props = {
		x: 0.505,
		y: 0.65,
		width: 0.38,
		height: 0.53,
		color: "white",
		border: {
			color:"green"
		}
	}
	@action allHold = (left, right) => {
		if (left.split('.').length == 1) {
			this[left] = right
		} else if (left.split('.').length == 2) {
			this[
				left.split('.')[0]
			][
				left.split('.')[1]
			] = right
		} else if (left.split('.').length == 3) {
			this[left.split('.')[0]][
				left.split('.')[1]
			][
				left.split('.')[2]
			] = right
		}
	}
}
window.store = new TodoStore
const store = window.store
export default store
