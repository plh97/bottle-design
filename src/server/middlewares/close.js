module.exports = function () {
    return async (ctx, next) => {
        if (ctx.data !== 'transport close') {
            await next();
        }
    };
};
