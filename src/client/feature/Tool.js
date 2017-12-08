'use strict';



class Tool{
    static is_inner(mouse,area){
        /**
         * 个人工具
         * @param  {tools} 
         * @return {string|json} get access_token || ''
         */
        // {
        //     arguments:{
        //         mouse:{
        //             x:"",
        //             y:""
        //         },
        //         area:{
        //             x:"",
        //             _x:""
        //             y:"",
        //             _y:""
        //         }
        //     }
        // }
        if(
            mouse.x > area.x &&
            mouse.x < area._x &&
            mouse.y > area.y &&
            mouse.y < area._y
        ){
            return true
        }else {
            return false
        }
    }
    static is_inner_polar(mouse,area){
        // {
        //     arguments:{
        //         mouse:{
        //             x:"",
        //             y:""
        //         },
        //         polar:{
        //             angel:"",
        //             displacement:""
        //         }
        //     }
        // }
        if(
            mouse.x > area.x &&
            mouse.x < area._x &&
            mouse.y > area.y &&
            mouse.y < area._y
        ){
            return true
        }else {
            return false
        }
    }
    static is_inner_point(mouse,point){
        // {
        //     arguments:{
        //         mouse:{
        //             x:"",
        //             y:""
        //         },
        //         polar:{
        //             x:"",
        //             y:"",
        //             dis:""
        //         }
        //     }
        // }
        if(
            mouse.x > point.x - point.distancement &&
            mouse.x < point._x + point.distancement &&
            mouse.y > point.y - point.distancement &&
            mouse.y < point._y + point.distancement
        ){
            return true
        }else {
            return false
        }
    }
    static mouse_debug(axis){
        let a = document.createElement("span")
        a.style.background="red"
        a.style.position="absolute"
        a.style.width="10px"
        a.style.height="10px"
        a.style.borderRadius="10px"
        a.style.left=`${axis.x}px`
        a.style.top=`${axis.y}px`
        document.body.appendChild(a)
        setTimeout(() => {
            a.remove()
        }, 3000);
    }
}

module.exports = exports = Tool;

