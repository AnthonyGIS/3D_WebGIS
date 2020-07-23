// 这个没有错误，不知道怎么滴，今天下午突然不能用了。
// 2.2 2026
// 方案1 （不可用）
// SyntaxError: Cannot use import statement outside a module
// npm install --save-dev babel-cli babel-preset-env

import {getUserFulContents} from "./my_models/file.mjs";
import {sum, multiply } from "./my_models/utils.mjs";


console.log(sum(1,2,3));
console.log(multiply(1,3));