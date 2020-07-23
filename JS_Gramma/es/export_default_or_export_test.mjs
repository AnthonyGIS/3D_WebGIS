/**
 使用export default 和 export 向外暴露的成员
 @author Cheetah
 @date 2020-02-02 17:17
 */


/*
REF:
https://blog.csdn.net/sleepwalker_1992/article/details/81461543
1、export default 向外暴露的成员，可以使用任意变量来接收。
2、在一个模块中，export default 只允许向外暴露一次
3、在一个模块中，可以同时使用export default 和export 向外暴露成员
4、使用export向外暴露的成员，只能使用{  }的形式来接收，这种形式，叫做【按需导出】
5、export可以向外暴露多个成员，同时，如果某些成员，在import导入时，不需要，可以不在{ }中定义
6、使用export导出的成员，必须严格按照导出时候的名称，来使用{ }按需接收
7、使用export导出的成员，如果想换个变量名称接收，可以使用as来起别名
*/

import person, { title, content as content_other_name} from './my_models/export_default_or_export.mjs'
console.log(person);
console.log(title+'==='+content_other_name);