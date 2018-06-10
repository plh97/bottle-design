//package
const Koa = require('koa');
const path = require('path');
const cors = require('@koa/cors');
const json = require ('koa-json')
const logger = require ('koa-logger')
// const cors = require('koa2-cors');
const koaSend = require('koa-send');
const koaStatic = require('koa-static');
const bodyparser = require('koa-bodyparser');

//local

//application
const app = new Koa();


app
    .use(bodyparser())
    .use(cors())
    .use(json())
    .use(logger())
    .use(koaStatic(path.resolve('./dist'), {
        // maxAge: 1000 * 60 * 60 * 24 * 7,
        gzip: true,
    }))
    // 将前端路由指向 index.html
    .use(async (ctx, next) => {
        if (!/\./.test(ctx.request.url)) {
            await koaSend(
                ctx,
                'index.html',
                {
                    root: path.resolve('./dist'),
                    // maxage: 1000 * 60 * 60 * 24 * 7,
                    gzip: true,
                } // eslint-disable-line
            );
        } else {
            await next();
        }
    });

module.exports = app;
