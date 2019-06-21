// 确保对象的属性能正确赋值，广义上讲，即确保对象的原生行为能够正常进行，这就是Reflect的作用

// 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
// 修改某些Object方法的返回结果，让其变得更合理  原来的会报错，现在会返回false

try {
    Object.defineProperty(target, property, attributes);
} catch (e) {

}
if (Reflect.defineProperty(target, property, attributes)) {

} else {

}

// 让Object操作都变成函数行为

'assign' in Object // true
Reflect.has(Object, 'assign') // true

// Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
var myObject = {
    foo: 1,
    bar: 2,
    get baz() {
        return this.foo + this.bar;
    },
};
var myReceiverObject = {
    foo: 4,
    bar: 4,
};
// 参数与proxy相同，传入reciever（myReceiverObject）后，会将this指向这个对象
console.log(Reflect.get(myObject, 'baz', myReceiverObject)) // 8



// 利用proxy和reflect实现的观察者模式
// new Set对象
const queuedObservers = new Set();
// proxy调用set，进行赋值
function set(target, key, value, receiver) {
    // 赋值
    const result = Reflect.set(target, key, value, receiver);
    // 运行内部的函数
    queuedObservers.forEach(observer => observer());
    // 返回结果
    return result;
}
// 将函数添加到queuedObservers中
const observe = fn => queuedObservers.add(fn);
// proxy
const observable = obj => new Proxy(obj, { set });
const person = observable({
    name: '张三',
    age: 20
});
function print() {
    console.log(`${person.name}, ${person.age}`)
}
observe(print);
person.name = '李四';
