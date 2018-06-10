import io from 'socket.io-client';
import { action, useStrict, computed, observable } from "mobx";

const marry = (new Array(29)).fill(0).map((e,i) => `https://static.pipk.top/api/public/images/material/marry/m${i+1}.jpg`);
const festival = (new Array(42)).fill(0).map((e,i) => `https://static.pipk.top/api/public/images/material/festival/f${i+1}.jpg`);
const party = (new Array(22)).fill(0).map((e,i) => `https://static.pipk.top/api/public/images/material/party/h${i+1}.jpg`);
const company = (new Array(15)).fill(0).map((e,i) => `https://static.pipk.top/api/public/images/material/company/c${i+1}.jpg`);
const wine = (new Array(8)).fill(0).map((e,i) => `https://static.pipk.top/api/public/images/bottle/wine/${i+1}.jpg`);


// useStrict(true)
class TodoStore {
	//我的用户信息
	@observable is_edit = false
	@observable images = []
	@observable texts = []
	@observable current_page = 1
	@observable current_class = 'marry'
	@observable bottle_rgba = {
		r:153,g:153,b:153,a:255
	}
	@observable bottle_list = {
		wine
	}
	@observable new_img_list = {
		marry,
		festival,
		party,
		company
	}
	//画板相关参数交给mobx处理，接受全局管理
	@observable block_props = {
		x: 0.505,
		y: 0.65,
		width: 0.28,
		height: 0.53,
		color: "white",
		border: {
			color:"rgb(31, 31, 31)"
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
