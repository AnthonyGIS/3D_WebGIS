// 内容来自于JavaScript 高级程序设计（第三版）

// 1 工厂方式
function createPerson(name,age,job) {
    var o = new Object(); //or var o = {};
    o.name = name;
    o.age = age;
    o.job = job;

    o.sayName= function () {
        alert(this.name);
    };

    return o;
}

var person_1 = createPerson("Tom",29,"Software Engineer");

// 2 构造函数模式
function Person(name,age,job) {
    this.name = name;
    this.age=age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    };
}

var person_2 = new Person("Tom",29,"Software Engineer");

// 3. 原型模式
function Person() {
}

Person.prototype.name = "Tom";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function () {
    alert(this.name);
};

var person_3 = new Person();
person_3.sayName();

// 4 组合使用构造函数模式和原型模式
function Person(name,age,job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ['Jim','Alice'];
}

Person.prototype = {
    constructor: Person,
    sayName:function () {
        alert(this.name);
    }
};

var person_4 = new Person("Tom",29,"Software Engineer");


// 5 动态原型模式
function Person(name,age,job) {
    // 属性
    this.name = name;
    this.age = age;
    this.job = job;
    // 方法
    if(typeof this.sayName != "function") {
        Person.prototype.sayName = function () {
            alert(this.name);
        };
    }
}

var person_5 = new Person();


// 6 寄生构造函数模式
function Person(name,age,job) {

    var o = new Object(); //or var o = {};
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function () {
        alert(this.name);
    };
}

var person_6 = new Person("Tom",29,"Software Engineer");


// 7 稳妥构造函数模式
function Person(name,age,job) {

    // 创建要返回的对象
    var o = new Object();
    // 可以在这里定义私有变量和函数
    // 添加方法
    o.sayName = function () {
        alert(name);
    };

    return o;
}

var person_7 = new Person("Tom",29,"Software Engineer");
person_7.sayName(); // "Tom"