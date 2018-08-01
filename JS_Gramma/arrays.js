// 数组的字面对象
var empty = [];
var numbers = ['zeros','one','nine'];


console.log(numbers[1]);
console.log(empty[1]);
console.log(numbers.length);
delete numbers[2];
console.log(numbers.length);

// 对象字面变量
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
    document.writeln(numbers_object[i]);
}

// 给数组增加方法
Array.method('reduce',function (f,value) {
    var i;
    for(i=0;i<this.length;i++)
    {
        value = f(this[i],value)
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
