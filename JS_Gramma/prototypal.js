// JavaScript语言精粹
var myMammal = {
    name: 'Herb the Mammal',
    get_name:function () {
        return this.name;
    },
    says:function () {
        return this.saying || '';
    }
};

// 差异化继承 differential inheritance
var myCat = Object.create(myMammal);
myCat.name = 'Henrietta';
myCat.saying = 'meow';
myCat.purr = function (n) {
    var i,s = '';
    for(i = 0;i<n;i+=1)
    {
        if(s) s+='-';
        s+='r';
    }
    return s;
};
myCat.get_name = function () {
    return this.says+' '+this.name + '' + this.says;
};

// 对象的私有变量
// ...


// 部件
var eventuality = function (that) {
    var registry ={};
    that.fire = function (event) {
        var array, func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i];
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                func.apply(this, handler.parameter || [event]);


            }
        }
        return this;
    };
    
    that.on = function (type,method,paramters) {
        var handler = {
            method:method,
            parameters:paramters
        };
        if(registry.hasOwnProperty(type))
        {
            registry[type].push(handler);
        }else
            registry[type] = [handler];
        return this;
    };

    return that;
};



