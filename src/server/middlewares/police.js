module.exports = function (policeConfig) {
    return async (ctx, next) => {
        // 是否不符合规则
        let result = true;
        policeConfig.forEach((police) => {
            if (result && police.match(ctx)) {
                police.polices.forEach((rule) => {
                    result = rule(ctx);
                });
            }
        });
        if (result) {
            await next();
        }
    };
};
