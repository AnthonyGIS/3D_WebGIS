console.log("test");

// SEG 1
var a = 5;
var a = 3;

let b = 3;
// let b=5; // SyntaxError: Identifier 'b' has already been declared
console.log(a);
console.log(b);


// SEG 2
console.log('------------------SEG 2------------------');
for (var i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log("var：" + i);
    })
} // let
for (let i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log("let" + i);
    })
}

//  UER 闭包形式
for(var i=0;i<5;i++) {
    (function (i) {
        setTimeout(function () {
            console.log("var" + i);
        })
    })(i);
}


