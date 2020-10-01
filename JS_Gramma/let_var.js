// let and var https://www.cnblogs.com/fly_dragon/p/8669057.html
// 见自己的Onenote  /learning/JS.one#JavaScript-ES6
//1. JS中的let和var的区别
var a = 99;
f();
console.log(a);

function f() {
    console.log(a);
    var a = 10;
    console.log(a);
}

// out
// undefined
// 10
// 99


//2. 在ES6之前，我们都是用var来声明变量，而且JS只有函数作用域和全局作用域，没有块级作用域，所以{}限定不了var声明变量的访问范围。
//例如：
{
    var i = 9;
}
console.log(i);  // 9

/*
//ES6新增的let，可以声明块级作用域的变量。
{
    let i = 9;     // i变量只在 花括号内有效！！！
}
console.log(i);  // Uncaught ReferenceError: i is not defined
 */

//3. let 配合for循环的独特应用
for (var i = 0; i <10; i++) {
    setTimeout(function() {  // 同步注册回调函数到 异步的 宏任务队列。
        console.log(i);        // 执行此代码时，同步代码for循环已经执行完成
    }, 0);
}
// 输出结果：10   共10个
// 这里面的知识点： JS的事件循环机制，setTimeout的机制等
// i虽然在全局作用域声明，但是在for循环体局部作用域中使用的时候，变量会被固定，不受外界干扰。

for (let i = 0; i < 10; i++) {
    setTimeout(function() {
        console.log(i);    //  i 是循环体内局部作用域，不受外界影响。
    }, 0);
}
// 输出结果：0  1  2  3  4  5  6  7  8 9


//4. let没有变量提升与暂时性死区
// 用let声明的变量，不存在变量提升。而且要求必须 等let声明语句执行完之后，变量才能使用，不然会报Uncaught ReferenceError错误。
console.log(aicoder);    // 错误：Uncaught ReferenceError ...
let aicoder = 'aicoder.com';
// 这里就可以安全使用aicoder

 //总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。


// 5. let变量不能重复声明
// let不允许在相同作用域内，重复声明同一个变量。否则报错：Uncaught SyntaxError: Identifier 'XXX' has already been declared
let a = 0;
let a = 'sss';
// Uncaught SyntaxError: Identifier 'a' has already been declared