// Generator 函数是一个状态机，封装了多个内部状态。调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。
// value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
// 中间加*，内部使用yield表达式，定义不同的内部状态，return结束执行
// yield算是暂停标志，遇到暂停执行，调用next时，执行这个yield后面的表达式
// 惰性求值:Lazy Evaluation
function* foo(x) {
    var y = 2 * (yield (x + 1));
    var z = yield (y / 3);
    return (x + y + z);
    // console.log('Hello' + (yield)); // yield表达式如果用在另一个表达式之中，必须放在圆括号里面
}
// 可以通过for..of...遍历，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象（所以不会输出return）
for (var i of foo(5)) {
    console.log(i);
}
var a = foo(5); // 此时不会调用helloWorldGenerator，需要执行next
// 每次next走一条yield表达式
console.log(a.next()) // 6
console.log(a.next()) // NaN
console.log(a.next()) // NaN

var b = foo(5);
console.log(b.next()) // 6
console.log(b.next(12)) // 8 传入的值会被认为是上次yield计算出来值
console.log(b.next(13)) // 42 5+24+13



// 对象写法
let obj = {
    * myGeneratorMethod() {

    }
};
// 等价
let obj = {
    myGeneratorMethod: function* () {

    }
};



// 默认传参，需要在外面包一层
function wrapper(generatorFunction) {
    return function (...args) {
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    };
}
const wrapped = wrapper(function* () {
    console.log(`First input: ${yield}`);
    return 'DONE';
});
wrapped().next('hello!');




// throw()
// 如果 Generator 函数内部和外部，都没有部署try...catch代码块，那么程序将报错，直接中断执行。
var gen = function* gen() {
    try {
        yield console.log('a');
    } catch (e) {
        console.log(e);
    }
    yield console.log('b');
    yield console.log('c');
}
var g = gen();
// 必须先执行一次next，才能throw，否则会报错
g.next() // a

// 错误也可以在外部捕获
// try {
//     g.throw('a');               // 第一次会在内部捕获
//     g.throw('b');               // 第二次会在外部捕获
// } catch (e) {
//     console.log('外部捕获', e);
// }

// throw方法被捕获以后，会附带执行下一条yield表达式，所以会输出b
g.throw() // b
g.next() // c




// return()
// 调用之后，Generator 函数的遍历就终止了，返回值的done属性为true，以后再调用next方法，done属性总是返回true。
function* numbers() {
    yield 1;
    try {
        yield 2;
        yield 3;
        // 如果 Generator 函数内部有try...finally代码块，且正在执行try代码块，那么return方法会推迟到finally代码块执行完再执行。
    } finally {
        yield 4;
        yield 5;
    }
    yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }     如果不传值，value会是undefined
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }



// yield*表达式：如果yield表达式后面跟的是一个遍历器对象，需要在yield表达式后面加上星号，表明它返回的是一个遍历器对象
function* foo() {
    yield 'a';
    yield 'b';
    return 'c';
}
function* bar() {
    yield 'x';
    // 有return时需要这样获取return值，yield*只遍历yield语句。
    let result = yield* foo();
    console.log(result);
    yield 'y';
}
for (let v of bar()) {
    console.log(v);
}

// 如果yield*后面跟着一个数组，由于数组原生支持遍历器，因此就会遍历数组成员。任何数据结构只要有 Iterator 接口，就可以被yield*遍历。
function* gen() {
    yield* ["a", "b", "c"];
}
gen().next() // { value:"a", done:false }




// Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。
// Generator 函数也不能跟new命令一起用，会报错。
// 定义在this上的属性拿不到
function* g() {
    this.a = 11;
}
g.prototype.hello = function () {
    console.log('hi!');
};
let obj = g();
obj.next();
console.log(obj.a) // undefined
obj.hello(); // hi!

// 通过指向原型，实现拿到this属性以及new
function* gen() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
function F() {
    return gen.call(gen.prototype);
}
var f = new F();
f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}
f.a // 1
f.b // 2
f.c // 3



// generator 自己异步执行
var fetch = require('node-fetch');
function* gen() {
    var url = 'https://api.github.com/users/github';
    var result = yield fetch(url); // fetch模块返回promise对象
    console.log(result.bio);
}
var g = gen();
var result = g.next();

result.value.then(function (data) {
    return data.json();
}).then(function (data) {
    g.next(data);
});



// Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
// Trunk 执行 generator
// 生产环境的转换器，建议使用 Thunkify 模块。
var Thunk = function (fileName) {
    return function (callback) {
        return fs.readFile(fileName, callback);
    };
};
var readFileThunk = Thunk(fileName);
function run(fn) {
    var gen = fn();
    function next(err, data) {
        var result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }

    next();
}
var g = function* () {
    var f1 = yield readFileThunk('fileA');
    var f2 = yield readFileThunk('fileB');
    var fn = yield readFileThunk('fileN');
};
run(g);




// co模块，返回promise对象
// 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co
var gen = function* () {
    var f1 = yield readFile('/etc/fstab');
    var f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};
var co = require('co');
co(gen).then(function () {
    console.log('Generator 函数执行完成');
});



