
// 1 原型继承
// ----------------------------------------------------------------------------------------
// 构造函数、原型和实例的关系：
// 每个构造函数都有一个【原型对象】，原型对象都包含一个指向【构造函数的指针】，
// 而“实例”都包含一个指向【原型对象的内部指针】。

// 原型链：
// 假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？显然，此时的原型对象将包含一个指向另一个原型的指针，
// 相应地，另一个原型中也包含着一个指向另一个构造函数的指针。
// 假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。
// 这就是所谓原型链的基本概念。
// 原型链虽然很强大，可以用它来实现继承，但它也存在一些问题。其中，最主要的问题来自包含引用类型值的原型。
// 想必大家还记得，我们前面介绍过包含引用类型值的原型属性会被所有实例共享；而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。
// 在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。
// 原型链的第二个问题：在创建子类型的实例时，不能向超类型的构造函数中传递参数。
// 实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。
// 有鉴于此，再加上前面刚刚讨论过的由于原型中包含引用类型值所带来的问题，实践中很少会单独使用原型链。


// 优点：实现简单
// 缺点：
// 1.无法向父类构造函数传参,父类只能实例传参，不符合常规语言的写法
// 2.同时new两个对象时改变一个对象的原型中的引用类型的属性时，
// 另一个实例的该属性也会修改。因为来自原型对象的引用属性是所有实例共享的。
var obj = { // 父类的原型对象属性
    0:'a',
    1:'b',
    arr:[1]
};
obj.prototype.id = 10; // 父类的原型对象属性

function Foo(){
    this.arr2 = [1];
}
Foo.prototype = obj; // 原型继承关键代码




// 使用说明
var foo1 = new Foo();
var foo2 = new Foo();
foo1.arr.push(2);
foo1.arr2.push(2);

console.log(foo2.arr);  //[1,2]，原型中的引用类型的属性【类实例的共享属性】被修改时，所有实例的该原型引用属性也将同步修改。
console.log(foo2.arr2); //[1]

// 1+ 原型式继承
// 在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。
// 不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}




// 2 构造继承
// ----------------------------------------------------------------------------------------
// 有时候也叫做【伪造对象或经典继承】，即在子类型构造函数的内部调用超类型构造函数。
// 别忘了，【函数只不过是在特定环境中执行代码的对象】，因此通过使用apply()和call()方法也可以在（将来）新创建的对象上执行构造函数。
// 如果仅仅是借用【构造函数】，那么也将无法避免构造函数模式存在的问题—---方法都在构造函数中定义，因此函数复用就无从谈起了。
// 而且，【在超类型的原型中定义的方法，对子类型而言也是不可见的】，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的
// 技术也是很少单独使用的。

// 优点：可以向父类传参，子类不会共享父类的引用属性。
// 缺点：无法实现函数复用，每个子类都有新的fun，太多了就会影响性能。不继承父类的原型对象。
function Super1(b){
    this.b = b;
    this.fun = function(){};
}
function Foo1(a,b){
    // 构造函数中
    this.a = a;

    // 构造继承向父类传参
    Super1.call(this,b); // 但是通过这种方式实例化出来的实例会将父类方法多次存储，影响性能
}

// usage
var foo1_obj = new Foo1(1,2);
console.log(foo1_obj.b);
console.log(foo1_obj.a);


// 3 组合继承
// ----------------------------------------------------------------------------------------
// combination inheritance， 有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。
// 其背后的思路是【使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承】。
// 这样，既通过在原型上定义方法实现了函数复用，又能够保证每个实例都有它自己的属性。
// 组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，<<<<成为JavaScript 中最常用的继承模式。>>>>>
// 而且，instanceof 和isPrototypeOf()也能够用于识别基于组合继承创建的对象。

// 优点：不存在引用属性共享问题，可传参，函数可复用
// 缺点：父类的属性会被实例化两次
function Super2(){
    // 只在此处声明基本属性和引用属性
    this.val = 1;
    this.arr = [1];
}

//  在此处声明函数
Super2.prototype.fun1 = function(){};
Super2.prototype.fun2 = function(){};

//Super.prototype.fun3...
function Sub2(){
    Super2.call(this);   // 组合继承核心----构造继承，构造函数内继承属性
    // ...
}
Sub2.prototype = new Super2(); // 组合继承核心----原型继承，继承方法【函数又实例一次，函数内部变量又重复实例一次】


// 说明
// 但是，通过这种方式实例化出来的对象会存储两份父类构造函数中的属性
var sub2_obj = new Sub2();


//4 寄生组合继承 【最佳】
// ----------------------------------------------------------------------------------------
// 【通过借用（构造函数）来继承属性，通过（原型链的混成形式）来继承方法。】
// 其背后的基本思路是：不必为了指定子类型的原型而调用超类型的构造函数，我们所需要的无非就是超类型原型的一个副本而已。
// 本质上，就是使用（寄生式继承）来继承超类型的原型，然后再将结果指定给子类型的原型。
// 基本模式如下所示:
function inheritPrototype(subType, superType){
    var obj = object(superType.prototype); //创建对象
    obj.constructor = subType; //增强对象
    subType.prototype = obj; //指定对象
}
// 参数：子类型构造函数和超类型构造函数。
// 第一步，在函数内部，创建超类型原型的一个副本。
// 第二步，为创建的副本添加constructor 属性，从而弥补因重写原型而失去的默认的constructor属性。
// 最后一步，将新创建的对象（即副本）赋值给子类型的原型。这样，我们就可以用调用inheritPrototype()函数的语句，
// 去替换前面例子中为子类型原型赋值的语句了。 集寄生式继承和组合继承的优点与一身，是实现基于类型继承的最有效方式。


// 使用示例：
function Super4(b){
    this.b = b;
}
Super4.prototype.c = function(){console.log(1111);};

//对父类的prototype进行一次寄生，即包装成一个空对象的prototype，
var f = new Function();
f.prototype = Super4.prototype; // 把这个对象实例化出来

// 继承的代码段
function Sub4(a,b){
    this.a = a;
    Super4.call(this,b);  // 子类构造继承父类
}
Sub4.prototype = new f();// 作为子类的prototype

// 创建完子类Sub4后的使用
var sub4_obj = new Sub4(1,2);


// 说明:
// 用父类的原型构造一个新对象作为子类的原型，就解决了多次存储的问题。
// 最终的寄生组合继承就是最佳继承方式，它的缺点就是书写起来比较麻烦。
// 对父类的prototype进行一次寄生，即包装成一个空对象的prototype，
// 再把这个对象实例化出来作为子类的prototype。






// 总结
// ----------------------------------------------------------------------------------------
/*
继承主要是实现子类对父类方法、属性的复用。
来自原型对象的引用属性是所有实例共享的，所以我们要避免从原型中继承属性。
在构造函数中通过call函数可以继承父类构造函数的属性和方法，但是通过这种方式实例化出来的实例会将父类方法多次存储，影响性能。
通过组合继承我们使用call继承属性，使用原型继承方法，可以解决以上两个问题，但是通过这种方式实例化出来的对象会存储两份父类构造函数中的属性。
用父类的原型构造一个新对象作为子类的原型，就解决了多次存储的问题，所以最终的寄生组合继承就是最佳继承方式，它的缺点就是书写起来比较麻烦。
*/



// DEMO1:
var Zepto = (function(){

    var $,zepto = {};

    // ...省略N行代码...

    $ = function(selector, context){
        return zepto.init(selector, context);
    };

    zepto.init = function(selector, context) {
        var dom;
        // ...
        return zepto.Z(dom, selector);
    };

    function Z(dom, selector){
        //...
    }

    zepto.Z = function(dom, selector) {
        return new Z(dom, selector);
    };

    $.fn = {
        // 里面有若干个工具函数
    };

    zepto.Z.prototype = Z.prototype = $.fn;

    // ...省略N行代码...

    return $;
})();

// 我们调用$(‘..’)时其实是调用 zepto.z 函数实例化了一个对象出来(具体不做分析)，
// 对象的构造函数是Z函数，通过 Z.prototype = $.fn 来实现对象对工具方法的继承。
// 因为zepto对象主要是使用它的一些工具方法,不需要对属性继承，
// 也不需要对父类构造进行传参，所以原型继承完全满足需要，而且写法简单。



// node.js中的继承
// node.js中的各个对象属性和方法都非常多，因此继承时就使用我们的最优继承方式：寄生组合继承。
function Stream(){
    //...
}

function OutgoingMessage() {
    Stream.call(this); //通过call继承Stream构造中的属性。
    //...
}
OutgoingMessage.prototype.setTimeout = function () {
    // 扩展OutgoingMessage自身原型的函数。
    // ...
};

//调用inherits方法继承Stream原型中的属性
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    // 使用了Object.create方法,该方法的作用是通过指定的原型对象和属性创建一个新的对象。
    // 该方法实际上就做了我们上面寄生组合继承中的工作
    // var f = new Function();
    // f.prototype =superCtor.prototype;
    // return new f();
    // 后面的参数是给原型对象添加属性,可选属性(非必填),即把自身作为新创建对象的构造函数。
   /*value: 表示constructor 的属性值；
    writable: 表示constructor 的属性值是否可写；[默认为: false]
    enumerable: 表示属性constructor 是否可以被枚举；[默认为: false]
    configurable: 表示属性constructor 是否可以被配置，例如 对obj.a做 delete操作是否允许；[默认为: false]*/
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

inherits(OutgoingMessage, Stream);


// 以上是寄生组合继承的一个实例。
// 1.在OutgoingMessage构造函数中通过call继承Stream构造中的属性。
// 2.调用inherits方法继承Stream原型中的属性。
// 3.扩展OutgoingMessage自身原型的函数。
// inherits方法中使用了Object.create方法,该方法的作用是通过指定的原型对象和属性创建一个新的对象。




// 参考文章
// https://blog.csdn.net/qq_34149805/article/details/79221431
// JavaScript面向对象编程(继承实现方式)  https://blog.csdn.net/hsd2012/article/details/50980270
