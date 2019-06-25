// async就是 Generator 函数的语法糖。
// async函数就是将 Generator 函数的星号（*）替换成async，将yield替换成await
// async函数返回一个 Promise 对象
// async函数内部return语句返回的值，会成为then方法回调函数的参数
// 正常情况下，await命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。
// await命令后面是一个thenable对象（即定义then方法的对象），那么await会将其等同于 Promise 对象
// async和await报错时，会被catch捕捉，asyncFun().then().catch()
// await 只能使用在原生语法中，比如在 forEeach 结构中使用 await 是无法正常工作的，必须使用 for 循环的原生语法


// async 函数有多种使用形式。
// 函数声明
async function foo() { }

// 函数表达式
const foo = async function () { };

// 对象的方法
let obj = { async foo() { } };
obj.foo().then()

// Class 的方法
class Storage {
    constructor() {
        this.cachePromise = caches.open('avatars');
    }
    async getAvatar(name) {
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}
const storage = new Storage();
storage.getAvatar('jake').then();

// 箭头函数
const foo = async () => { };

function sleep(interval) {

}


// 休眠效果
async function one2FiveInAsync() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
        await new Promise(resolve => {
            setTimeout(resolve, 1000);
        })
    }
}
one2FiveInAsync();// 每隔1s输出一个i


async function f() {
    await Promise.reject('出错了');
    await Promise.resolve('hello world'); // 不会执行

    // 会执行第二个await
    try {
        await Promise.reject('出错了');
    } catch (e) {
    }
    return await Promise.resolve('hello world');
    // 或
    await Promise.reject('出错了')
        .catch(e => console.log(e));
    return await Promise.resolve('hello world');
}



// await同时触发的方法
// 这样会继发
let foo = await getFoo();
let bar = await getBar();
// 同时触发写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
// 同时触发写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;



// async 函数可以保留运行堆栈。
const a = () => {
    b().then(() => c());
};
// b是异步操作，当b运行完，a可能已经早就执行完了，会导致报错
const a = async () => {
    await b();
    c();
};
// b()运行的时候，a()是暂停执行，上下文环境都保存着。一旦b()或c()报错，错误堆栈将包括a()。

