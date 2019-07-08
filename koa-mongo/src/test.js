const router = require('koa-router')();
router.get('/test', async (ctx, next) => {
    // ctx.request.body 获取不到入参
    // ctx.query  可以获取到入参,get的时候用这个获取参数
    ctx.body = 'test';
});
module.exports = router;