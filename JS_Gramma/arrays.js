// 数组的字面对象
// -----------------------------------------------------------------------------
var empty = [];
var numbers = ['zeros','one','nine'];


console.log(numbers[1]);
console.log(empty[1]);
console.log(numbers.length);
delete numbers[2];
console.log(numbers.length);

// 对象字面变量
// -----------------------------------------------------------------------------
var numbers_object={
    '0': 'zeros',
    '1' : 'one',
    '9' : 'nine'
};

console.log('-----------------------------');
console.log(numbers_object[0]);
var i;
for(i=0;i<numbers_object.length;i++)
{
    document.writeln(numbers_object[i]); // jshint ignore:line
}

// 给数组增加方法
// -----------------------------------------------------------------------------
// 通过给Function.prototype增加方法来使得该方法对所有函数可用
// REF: https://www.cnblogs.com/dukeShi/archive/2018/05/05/8993326.html

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};
Array.method('reduce',function (f,value) {
    var i;
    for(i=0;i<this.length;i++)
    {
        value = f(this[i],value);
    }

    return value;
});

var data = [4,8,15,156,23,42 ];
var add = function(a,b){
    return a+b;
};

var mult = function(a,b)
{
    return a*b;
};

var sum = data.reduce(add,0);
var produce = data.reduce(mult,1);
console.log('sum：\n'+sum+'\nproduce:\n'+produce);


// 数组的实用方式
var a = ['a', 'b', 'c'];
var b = ['x', 'y', 'z'];

var c = a.concat(b, true);
c.pop();
c.push('weng');
c.reverse();
var first_element = c.shift();
first_element = c.slice(0, 1);
c.sort();