'use strict';


/**
 * 个人工具
 * @param  {tools} 
 * @return {string|json} get access_token || ''
 */

class Tool{
    static is_inner(mouse,area){
        if(
            mouse.x > area.x &&
            mouse.x < area._x &&
            mouse.y > area.y &&
            mouse.y < area._y
        ){
            console.log("true",mouse,area)
            return true
        }else {
            console.log("false",mouse,area)
            return false
        }
    }
}

module.exports = exports = Tool;

