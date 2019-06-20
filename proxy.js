// 一个 Proxy 对象由两个部分组成： target 、 handler 。在通过 Proxy 构造函数生成实例对象时，需要提供这两个参数。 
// target 即目标对象， handler 是一个对象，声明了代理 target 的指定行为，target 可以为空对象
let target = {
    name: 'Tom',
    age: 24,
    _prop: 'foo'
}
let proto = {};
let handler = {
    // 拦截某个属性的读取操作，可以继承
    get: function(target, key) {
        // 实现私有属性读取保护
        if(propKey[0] === '_'){
            throw new Erro(`Invalid attempt to get private     "${propKey}"`);
        }
        console.log('getting '+key+':'+target[key]);
        return target[key]; // 不是target.key
    },
    // 拦截某个属性的赋值操作
    set: function(target, key, value) {
        console.log('setting '+key+':'+value);
        target[key] = value;
    },
    // 拦截函数的调用、call和apply操作
    apply (target, ctx, args) {
        return Reflect.apply(...arguments);
    },
    // 拦截HasProperty操作
    has (target, key) {
        if (key[0] === '_') {
          return false;
        }
        return key in target;
    },
    // 拦截new命令，返回的必须是一个对象，否则会报错
    // target：目标对象
    // args：构造函数的参数对象
    // newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）
    construct (target, args, newTarget) {
        return new target(...args);
    },
    // 拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除
    deleteProperty (target, key) {
        if (key[0] === '_') {
            throw new Error(`Invalid attempt to delete private "${key}" property`);
        }
        delete target[key];
        return true;
    },
    // 拦截了Object.defineProperty操作
    defineProperty (target, key, descriptor) {
        // 返回false时，添加新属性无效
        return false;
    },
    // 拦截Object.getOwnPropertyDescriptor()
    getOwnPropertyDescriptor (target, key) {
        if (key[0] === '_') {
          return;
        }
        return Object.getOwnPropertyDescriptor(target, key);
    },
    // 拦截获取对象原型,返回值必须是对象或者null，否则报错
    getPrototypeOf(target) {
        return proto;
    },
    // 拦截Object.isExtensible操作,只能返回布尔值，否则返回值会被自动转为布尔值;它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误(没啥用)
    isExtensible: function(target) {
        console.log("called");
        return true;
    },
    // 拦截对象自身属性的读取操作,如下四种
    // Object.getOwnPropertyNames()
    // Object.getOwnPropertySymbols()
    // Object.keys()
    // for...in循环
    // 还可以拦截Object.getOwnPropertyNames(),for...in
    // 返回的数组成员，只能是字符串或 Symbol 值
    ownKeys(target) {
        return ['name'];
    },
    // 拦截Object.preventExtensions(),只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错
    preventExtensions: function(target) {
        Object.preventExtensions(target);
        return true;
    },
    // 拦截Object.setPrototypeOf,该方法只能返回布尔值，否则会被自动转为布尔值
    setPrototypeOf (target, proto) {
        throw new Error('Changing the prototype is forbidden');
    }
}
let proxy = new Proxy(target, handler);
proxy.name; // get
proxy.age = 25; // set
proxy(); // 当做函数调用是会走apply
(new p(1)).value; // construct
delete proxy._prop; // delete 会报错
proxy.add = 'add'; // defineProperty 无效
Object.getOwnPropertyDescriptor(proxy, '_prop'); // getOwnPropertyDescriptor undefined
Object.getPrototypeOf(proxy) === proto // getPrototypeOf true
Object.keys(proxy); // ownKeys ['name']只返回name



// Proxy.revocable方法返回一个可取消的 Proxy 实例。
// 使用场景是:目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。
let target = {};
let handler = {};
let {proxy, revoke} = Proxy.revocable(target, handler);
proxy.foo = 123;
proxy.foo // 123
revoke(); // 可以取消Proxy实例的函数
proxy.foo // TypeError: Revoked


// Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理。
const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
        // 需要this绑定原始对象，解决指向问题
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1



