import io from 'socket.io-client';
import { action, useStrict, computed, observable } from "mobx";

// material //
const marryContext = require.context("../../../assets/images/material/marry", true, /^\.\/.*\.(jpg|png)$/);
const marry = marryContext.keys().map(marryContext);
const festivalContext = require.context("../../../assets/images/material/festival", true, /^\.\/.*\.(jpg|png)$/);
const festival = festivalContext.keys().map(festivalContext);
const partyContext = require.context("../../../assets/images/material/party", true, /^\.\/.*\.(jpg|png)$/);
const party = partyContext.keys().map(partyContext);
const companyContext = require.context("../../../assets/images/material/company", true, /^\.\/.*\.(jpg|png)$/);
const company = companyContext.keys().map(companyContext);
// material //

// bottle //
const wineContext = require.context("../../../assets/images/bottle/wine", true, /^\.\/.*\.(jpg|png)$/);
const wine = wineContext.keys().map(wineContext);
// bottle //
	
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
