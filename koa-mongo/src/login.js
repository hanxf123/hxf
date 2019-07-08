const router = require('koa-router')();
router.post('/login', async (ctx, next) => {
    // console.log(ctx.query);// 获取get入参
    console.log(ctx.request.body);// 获取post入参
    ctx.body='success'; 
});
module.exports = router;