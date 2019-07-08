// 引入koa，并且实例化对象app
const Koa = require('koa');
const app = new Koa();

// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
const cors = require('koa2-cors');
app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:3000'; // 只允许 http://localhost:3000 域名的请求
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// 连接数据库mongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
// 连接数据库
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    // 获取node_koa_mongoDB数据库
    var dbo = db.db("node_koa_mongoDB");
    // 查询数据中的所有数据
    dbo.collection("site").find('*').toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        var myobj = { name: "test2" };
        let data = result.map((il) => {
            return il.name;
        });
        // 判断是否已经存在
        if(data.indexOf(myobj.name)===-1){
            // 如果不存在，想数据库中插入一条数据
            dbo.collection("site").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("数据插入成功");
            });
        }else{
            console.log("数据已存在");
        }
        db.close();
    });
});

// 引入bodyParser，用来解决入参问题
const bodyParser = require('koa-bodyparser');
// 需要放在路由或接口调用前面
app.use(bodyParser());

// 获取静态资源（static文件夹）内部的文件
const static = require('koa-static');
const path = require('path');
app.use(static(
    path.join(__dirname, './static')
))

// 配置路由
const router = require('koa-router')()
router.get('/', async (ctx, next) => {
    ctx.body = '<img src="node.gif"></img>';
});
app.use(router.routes());

// 引入子模块
let registerRouter = require('./router.js')()//路由注册；
app.use(registerRouter);

// 启动服务
app.listen(3000);
console.log('app started at port 3000...')

