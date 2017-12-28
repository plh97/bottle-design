'use strict';
class Tool{
    static is_inner(mouse,area,angle=0 ){
        /**
         * 个人工具
         * @param  {tool} 
         * @return {string|json} get angle || 0
         */
        let __distance__ = Math.sqrt(mouse.x*mouse.x + mouse.y*mouse.y)
        let __angle__ = 180 - 180*Math.atan2( mouse.x , mouse.y )/Math.PI - angle - 135
        let __mouse__ = {
            x:__distance__*Math.cos(Math.PI * (45 + __angle__) / 180) ,
            y:__distance__*Math.sin(Math.PI * (45 + __angle__) / 180)
        }
        if(
            __mouse__.x > area.x &&
            __mouse__.x < area._x &&
            __mouse__.y > area.y &&
            __mouse__.y < area._y
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
        var loop = true
        var _images = images
        images.reverse().map((image,i)=>{
            //点击范围判断            
            if (loop && Tool.is_inner(mouse,{
                x : image.x- image.width/2,
                _x : image.x + image.width/2,
                y : image.y - image.height/2,
                _y : image.y + image.height/2
            }, image.angle )) {
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
        if (Tool.is_inner(mouse, {
            x : image.width/2 - 10,
            _x : image.width/2 + 20 ,
            y : -image.height/2 - 20,
            _y : -image.height/2 + 10
        }, image.angle )) {
            return true
        } else {
            return false
        }
    }

    static is_scale_btn( mouse,image,) {
        if (Tool.is_inner(mouse, {
            x : image.width/2 - 10,
            _x : image.width/2 + 20 ,
            y : image.height/2 - 10,
            _y : image.height/2 + 20
        }, image.angle )) {
            return true
        } else {
            return false
        }
    }


	static measureText(text){
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")
        return {
            width:ctx.measureText(text.content, `${text.font_size}/1.6 ${text.font_family}`).width,
            height: 20
        }
    }
    
    static alert_content(style={
        color:"#fff",
        backgroundColor:"red",
        content:"没有任何输入"
    }){
        let alert_content = document.createElement("span")
        alert_content.append(style.content)
        alert_content.style.top = "30%"
        alert_content.style.left = "35%"
        alert_content.style.color = style.color
        alert_content.style.border = "2px solid #ddd"
        alert_content.style.zIndex = "999"
        alert_content.style.padding = "5px"
        alert_content.style.position = "absolute"
        alert_content.style.fontWeight = "bolder"
        alert_content.style.borderRadius = "5px"
        alert_content.style.backgroundColor = style.backgroundColor
        document.body.append(alert_content)
        setTimeout(()=>{
            alert_content.remove()
        },2000)
    }

    static to_image_rgba(data,w,h){
        window.data = data;
        window.w = w;
        window.h = h;
        var _data_ = data
        var new_arr = []
        for (let i = 0; i < h; i++) {
            var __data__ = _data_.slice(w*4*i, w*4*(i+1))
            new_arr.push(__data__)
        }
        return new_arr.map((arr,i) => {
            var _arr_ = [];
            for (let i = 0; i < w; i++) {
                arr.slice(w*4*i, w*4*(i+1))
                _arr_.push( arr.slice( 4*i, 4*(i+1)) )
            }
            return _arr_
        })
    }

    static get_black_area(data,rgba,canvas){
        var _x;
        var __x;
        var first=true;
        data[400].map((r,i) => {
            if(
                r[0]<rgba.r &&
                r[1]<rgba.g &&
                r[2]<rgba.b 
            ){
                if(first) {
                    _x = i/canvas.width
                }
                first=false
                __x = i/canvas.width
            }
        })
        // 边距
        var _y;
        var __y;
        first = true;
        data.map((r,i)=>{
            if(
                r[_x*400+5][0]<rgba.r &&
                r[_x*400+5][1]<rgba.g &&
                r[_x*400+5][2]<rgba.b
            ){
                if(first) {
                    _y = i/canvas.height
                }
                first=false
                __y = i/canvas.height
            }
        })
        return {
            _x: _x + 0.01 ,
            __x: __x - 0.01 ,
            _y: _y + 0.04 ,
            __y: __y - 0.01
        }
    }

    
    //禁止微信拖动原生事件
    //有问题！！！
    static prevent_wx_scroll() {
        // var overscroll = function (el) {
        //     el.addEventListener('touchstart', function () {
        //         var top = el.scrollTop
        //             , totalScroll = el.scrollHeight
        //             , currentScroll = top + el.offsetHeight;
        //         if (top === 0) {
        //             el.scrollTop = 1;
        //         } else if (currentScroll === totalScroll) {
        //             el.scrollTop = top - 1;
        //         }
        //     });
        //     el.addEventListener('touchmove', function (evt) {
        //         if (el.offsetHeight < el.scrollHeight)
        //             evt._isScroller = true;
        //     });
        // }
        // overscroll(document.querySelector('.scroll'));
        // document.body.addEventListener('touchmove', function (evt) {
        //     if (!evt._isScroller) {
        //         evt.preventDefault();
        //     }
        // });
    }
}

module.exports = exports = Tool;

