// JS 定义类的几种模式
// REF: https://www.cnblogs.com/liubeimeng/p/5821929.html
// Author: weng
// 文字再次修改，逻辑整理。
// Update on: 209.12.28 1845





// 1 工厂方式
// -----------------------------------------------------------------------------
// 工厂模式解决了创建类似对象的问题；
// 但没有解决对象的识别问题，即不能确定一个对象的类别，统一为 Object。instanceof -> Object
function Car(color,door){
    var ocar = {};
    ocar.color = color;
    ocar.doors = door;
    //ocar.showColor = showColor;
    ocar.showColor = function(){
        document.write(this.color); // jshint ignore:line
    };
    return ocar;
}
function showColor(){

    alert(this.color);
}

var car1 = Car("red",4);
var car2 = Car("blue",4);
car1.showColor(); //output:”red”
car2.showColor(); //output:”blue”
// 在该例子中，每次调用函数Car(),都要创建 showcolor()，意味着每个对象都有一个自己的showcolor()方法。
// 但是事实上，每个对象都共享了同一个函数。
// 显然，可以在函数外定义方法，然后通过将函数的属性指向该方法来解决（但这种方式，也有弊病，就是丧失类的封装性了）。

// 2 构造函数方式
// -----------------------------------------------------------------------------
// 它同工厂方式一样。【每次调用都会为对象创建自己的方法】。
// 构造函数的方式虽然确定了对象的归属问题，能够确定对象的类型，
// 但构造函数中的方法需要在每个对象中都要重新创建一遍，导致一些性能问题。
function Car(color,door){
    this.color = color;
    this.doors = door;
    this.showColor = function(){
        alert(this.color);
    };
}
var car1 = new Car("red",4);
var car2 = new Car("blue",4);

// 没有先时创建对象，
// 直接将属性和方法赋给this对象，
// 没有return语句
// 使用new创建对象
// 能够识别对象, 这是构造函数模式胜于工厂模式的地方
// 构造函数虽然好用,但也并非没有缺点,使用构造函数的最大问题在于每次创建实例的时候都要重新创建一次方法
// (理论上每次创建对象的时候对象的属性均不同,而对象的方法是相同的), 然而创建两次完全相同的方法是没有必要的,因此,我们可以将函数移到对象外面.
function Blog(name, url) {
    this.name = name;
    this.url = url;
    this.alertUrl = alertUrl;
}
function alertUrl() {
    console.log(this.url);
}
var blog = new Blog("xiaokeai","http://www.xiaokeai.com/"), blog2 = new Blog("xiaomeinv","http://www.123.com/");
blog.alertUrl();
blog2.alertUrl();
// 浪费空间不说,显然失去了面向对象的封装性了,因此可以通过原型来解决这个问题。





// 3 原型方式
// -----------------------------------------------------------------------------
// 对象实例可以访问原型中的值，但不能重写原型中的值（如果对象实例中定义了和原型重名的属性，那么该属性就会屏蔽原型中的那个属性，但并不会重写。）
// 该方式利用了对象的prototype属性。首先，用空函数创建类名，然后所有的属性和方法都被赋予prototype属性。
// 调用该函数时，原型的所有属性都会立即赋予要创建的对象，所有该函数的对象存放的都是指向showColor()的指针，语法上看起来都属于同一个对象。
function Car(){

Car.prototype.color = "red";
Car.prototype.doors = 4;
Car.prototype.showColor = function(){
    alert(this.color);
};
}
var car1 = new Car();
var car2 = new Car();
// 原型模式解决了类方法被重复定义、或定义在类外部丧失封装性的问题。但，原型模式也不是没有缺点：
// 首先,它忽略了构造函数传递初始化参数这一环节。结果所有实例在默认情况下都取得了相同的属性值,这样非常不方便,但这还不是原型的最大问题.
// 原型模式最大问题在于共享的本性所导致的。由于共享,因此一个实例修改了引用,另一个也随之修改了引用.
// 因此我们通常不单独使用原型,而是结合原型模式和构造函数模式.


function Car(){
}
Car.prototype.color = "red";
Car.prototype.doors = 4;
Car.prototype.arr = ["a","b"];
Car.prototype.showColor = function(){
    alert(this.color);
};


var car1 = new Car();
var car2 = new Car();
car1.arr.push("cc");
alert(car1.arr); //output:aa,bb,cc
alert(car2.arr); //output:aa,bb,cc

// 但是这个函数没有参数，不能通过传递参数来初始化属性，必须要在对象创建后才能改变属性的默认值。
// 原型方式有个很严重的问题就是，当属性指向的是对象时，如数组，那么所有对象的属性都将被改变，这点儿要十分注意。
// 这里由于数组的引用值，Car的两个对象指向的都是同一个数组，所以当在car1添加值后，在car2中也可以看到。




// 4 混合模式 【Good】
// -----------------------------------------------------------------------------
// 联合用构造函数/原型方式就可以像其他程序设计语言一样创建对象，是用构造函数定义对象的非函数属性，用原型方式定义对象的方法。
function Car(color,door){
    this.color = color;
    this.doors = door;
    //this.arr = new Array("aa","bb");
    this.arr = ["aa","bb"];
}
Car.prototype.showColor = new function(){ // jshint ignore:line
    alert(this.color);
};

var car1 = new Car("red",4);
var car2 = new Car("blue",4);
car1.arr.push("cc");
alert(car1.arr); //output:aa,bb,cc
alert(car2.arr); //output:aa,bb


// 5 动态原型方式 【Good,目前使用最为广泛】
// -----------------------------------------------------------------------------
// 动态原型的方式同混合的构造函数/原型方式原理相似。
// 唯一的区别就是赋予对象方法的位置。
function Car(color,door){
    this.color = color;
    this.doors = door;
    this.arr = ["aa","bb"];
    this.name = "";
    this.url = "";
    if(typeof this.alertInfo !== "function"){
        //这段代码只执行一次
        console.log("haha");
        Blog.prototype.alertInfo = function () {
            console.log('名字:'+ this.name + ' 博客:' + this.url);
        };
    }

    // 动态原型方式是使用一个标志来判断是否已经给原型赋予了方法。这样可以保证该方法只创建一次
    if(typeof Car._initialized === "undefined"){
        Car.prototype.showColor = function(){
            alert(this.color);
        };
        Car._initialized = true;
    }
}



// 6 混合工厂方式
// -----------------------------------------------------------------------------
// 它的目的是创建假构造函数，只返回另一种对象的新实例。
//...
// 与工厂方式所不同的是，这种方式使用new运算符。
// 以上就是全部的创建对象方法。目前使用最广泛的就是混合构造函数/原型方式，此外，动态原型方式也很流行。
// 在功能上与构造函数/原型方式等价。



// 7 封装(暂这么叫)
// -----------------------------------------------------------------------------
// 就是把代码都封装起来，将实例对象作为一个整体返回，有点类似于工厂模式。
var Dog = {
    createDog:function(){
        var dog = {};
        dog.name = "汪汪";
        dog.sayHello = function(){
            console.log("Hello World!");
        };
        return dog;
    }
};
var dog = Dog.createDog();
dog.sayHello();


