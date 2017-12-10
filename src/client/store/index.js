import io from 'socket.io-client';
import { action, useStrict, computed, observable } from "mobx";

// useStrict(true)
class TodoStore {
	//我的用户信息
	@observable image_ref = []
	@observable images = []
	@observable is_edit = true
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
