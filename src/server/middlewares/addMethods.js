module.exports = function (io, _io) {
    // koa socket: ctx.socket
    // raw socket: ctx.socket.socket
    // koa io: ctx.io
    // raw io: ctx._io

    return async (ctx, next) => {
        ctx.res = function (status, data) {
            ctx.resData = { status, data };
            ctx.acknowledge({ status, data });
        };
        ctx.clients = function () {
            return Object.keys(_io.sockets.sockets);
        };
        ctx.io = io;
        ctx._io = _io;
        await next();
    };
};
