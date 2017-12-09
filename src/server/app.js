//package
const Koa = require('koa');
const path = require('path');
const json = require('koa-json');
const cors = require('koa2-cors');
const koaSend = require('koa-send');
const logger = require('koa-logger');
const static = require('koa-static');
const bodyparser = require('koa-bodyparser');

//local

//application
const app = new Koa();


app
    .use(bodyparser())
    .use(cors())
    .use(json())
    .use(logger())
    .use(static(path.resolve('./dist'), {
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
