'use strict';
class Tool{
    static is_inner(mouse,area){
        /**
         * 个人工具
         * @param  {tools} 
         * @return {string|json} get access_token || ''
         */
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
        if(
            mouse.dis > area.dis &&
            mouse.dis < area._dis &&
            mouse.angle > area.angle &&
            mouse.angle < area._angle
        ){
            return true
        }else {
            return false
        }
    }
    static is_inner_point(mouse,point){
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
    static mouse_debug(axis,monent=3000,color="green"){
        let a = document.createElement("span")
        a.style.background= color
        a.style.position="absolute"
        a.style.zIndex="999"
        a.style.width="10px"
        a.style.height="10px"
        a.style.borderRadius="10px"
        a.style.left=`${axis.x}px`
        a.style.top=`${axis.y}px`
        document.body.appendChild(a)
        setTimeout(() => {
            a.remove()
        }, monent);
    }

    static update_last_one(arr,e){
        let new_arr = arr 
        let scale = e.scale ? e.scale : 1
        e.x && (new_arr[new_arr.length - 1].x = e.x)
        e.y && (new_arr[new_arr.length - 1].y = e.y)
        e.width && (new_arr[new_arr.length - 1].width = e.width)
        e.height && (new_arr[new_arr.length - 1].height = e.height)
        e.angle && (new_arr[new_arr.length - 1].angle = e.angle)
        return new_arr
    }

    static put_to_last(arr,img_index){
        let new_arr = arr;
        new_arr= [
            ...new_arr.filter((index,i) => {
                return i !== img_index
            }),
            new_arr[img_index]
        ]
        return new_arr
    }

    static remove_last_one(arr){
        let new_arr = arr;
        new_arr.pop()
        return new_arr
    }

    static is_buttom_array(
        mouse,
        images
    ){
        console.log(
            mouse
        )
        var loop = true
        var _images = images
        images.reverse().map((image,i)=>{
            //点击范围判断
            if (loop && Tool.is_inner(mouse,{
                x : image.x- image.width/2,
                _x : image.x + image.width/2,
                y : image.y - image.height/2,
                _y : image.y + image.height/2
            })) {
                loop = false
                let current_index = images.length-1 - i
                if(i == 0){
                    _images = "no change"
                }else{
                    _images = Tool.put_to_last(images,current_index)
                }
            }
        })
        if(loop == true){
            return "not click image"
        }else{
            return _images
        }
    }
    
    static is_close_btn( mouse,image ) {
        let distancement = Math.sqrt(image.width * image.width + image.height * image.height)
        if (Tool.is_inner_polar(mouse, {
            dis: distancement / 2 - 20,
            _dis: distancement / 2 + 20,
            angle: 35,
            _angle: 55
        })) {
            return true
        } else {
            return false
        }
    }

    static is_scale_btn( mouse,image,) {
        let distancement = Math.sqrt(image.width * image.width + image.height * image.height)
        if (Tool.is_inner_polar(mouse, {
            dis: distancement / 2 - 20,
            _dis: distancement / 2 + 20,
            angle: 125,
            _angle: 135
        })) {
            return true
        } else {
            return false
        }
    }
}

module.exports = exports = Tool;

