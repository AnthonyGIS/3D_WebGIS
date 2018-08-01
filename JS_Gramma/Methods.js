var a = ['a','b','c'];
var b =['x','y','z'];

var c = a.concat(b,true);
c.pop();
c.push('weng');
c.reverse();
var first_element = c.shift();
first_element = c.slice(0,1);
c.sort();