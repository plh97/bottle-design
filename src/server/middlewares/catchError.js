module.exports = function () {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (err.name === 'Assert Error') {
                const { status, data } = JSON.parse(err.message);
                ctx.res(status, data);
                return;
            }
            console.log(err);
            ctx.res(500, err.toString());
        }
    };
};
