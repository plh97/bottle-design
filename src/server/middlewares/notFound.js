module.exports = function () {
    return async (ctx) => {
        if (!ctx.resData) {
            ctx.res(404, 'interface not implement');
        }
    };
};
