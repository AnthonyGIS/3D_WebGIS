// REF
// 一篇文章弄懂 JavaScript 中的 import, https://segmentfault.com/a/1190000017298307
// JavaScript中import用法总结, https://www.jb51.net/article/154959.htm
// 2020.1.30


function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this.responseText)
    };
    xhr.open('GET', url, true);
    xhr.send();
}


export function getUserFulContents(url,callback){
    getJSON(url,data=>callback(JSON.parse(data)));
}
