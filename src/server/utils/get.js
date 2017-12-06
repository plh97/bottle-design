'use strict';

const cookie = require('cookie');
const parse = require('url-parse');

/**
 * 读取文件方法
 * @param  {socket|cookie} koa-socket's argument 
 * @return {string|json} get access_token || ''
 */

class get{
    static getCookie(socket){
        return cookie.parse(socket.handshake.headers.cookie || '')
    }
    static getUrl(socket){
        return parse(socket.handshake.headers.referer) || ''
    }
}

module.exports = exports = get;

