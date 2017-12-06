const pathToRegexp = require('path-to-regexp');

const defaultOpt = {
    prefix: '',
};

function createMethod(method) {
    return function (path, cb) {
        const regexp = pathToRegexp(this.prefix + path);
        this.registerRoutes.push({
            method,
            regexp,
            cb,
        });
        return this;
    };
}

class SocketRouter {
    constructor(opt = defaultOpt) {
        this.registerRoutes = [];
        this.prefix = opt.prefix;

        this.get = createMethod.call(this, 'GET');
        this.post = createMethod.call(this, 'POST');
        this.delete = createMethod.call(this, 'DELETE');
        this.put = createMethod.call(this, 'PUT');
        this.patch = createMethod.call(this, 'PATCH');
    }
    routes() {
        return async (ctx, next) => {
            let hasMatch = false;
            for (const route of this.registerRoutes) {
                // 判断路由匹配
                const matchResult = route.regexp.exec(ctx.data.path);
                if (route.method === ctx.data.method && matchResult && !hasMatch) {
                    hasMatch = true;
                    const pathParams = {};
                    for (let i = 0; i < route.regexp.keys.length; i++) {
                        pathParams[route.regexp.keys[i].name] = matchResult[i + 1];
                    }
                    ctx.params = Object.assign(pathParams, ctx.data.params);
                    ctx.header = ctx.data.header;
                    await route.cb(ctx);
                }
            }
            if (!hasMatch) {
                await next();
            }
        };
    }
}

module.exports = SocketRouter;
