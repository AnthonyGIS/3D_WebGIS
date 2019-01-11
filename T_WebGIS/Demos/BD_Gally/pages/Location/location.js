
// 动态原型方式
function ATLocation(para){
    /*this.color = color;
    this.doors = para;
    this.arr = ["aa","bb"];
    this.name = "";
    this.url = "";*/

    if(typeof this.alertInfo !== "function"){
        //这段代码只执行一次
       /*  console.log("haha");
        ATLocation.prototype.alertInfo = function () {
            console.log('名字:'+this.name + ' 博客:' + this.url);
        };*/
    }

    // 动态原型方式是使用一个标志来判断是否已经给原型赋予了方法。这样可以保证该方法只创建一次
    if(typeof ATLocation._initialized === "undefined"){

        ATLocation.prototype.DemoFunc = function(){
            alert(this.color);
        };
        ATLocation.prototype.BDLocation = function(){
            var div_check = $('.ATLocation');
            if (div_check.length === 0) {
                var div = document.createElement("div"); //设置 div 属性，如 id
                div.setAttribute("id", "status_panel_disp");
                div.setAttribute("class","ATLocation");
                div.style.cssText = "text-align: center;width:500px;height:150px;border-radius:6px; overflow-y: hidden;" +
                    "position:absolute;bottom:30px;right:100px;z-index:1;" +
                    "font-size:small;background-color:rgba(200,200,200,0.46);text-align:center;line-height: 30px;";
                div.innerHTML = '<h1>AJAX检测ip和地区</h1>\n' +
                    '    <p id="city">XX</p>' +
                    '    <p id="ip">XX</p>';
                document.body.appendChild(div);
            }

            $(function () {
                //获取城市ajax
                $.ajax({
                    url: 'http://api.map.baidu.com/location/ip?ak=ia6HfFL660Bvh43exmH9LrI6',
                    type: 'POST',
                    dataType: 'jsonp',
                    success: function (data) {
                        console.log(JSON.stringify(data.content.address_detail.province + "," + data.content.address_detail.city));
                        $('#city').html(JSON.stringify(data.content.address_detail.province + "," + data.content.address_detail.city));
                    }
                });

                //获取ip ajax
                $.ajax({
                    url: 'http://ip-api.com/json',
                    success: function (data) {
                        console.log(JSON.stringify(data.query));
                        $('#ip').html(JSON.stringify(data.query));
                    },
                    type: 'GET',
                    dataType: 'JSON'
                });

                // bypass
            });
        };

        ATLocation._initialized = true;
    }



    /* // usage
     var obj = new ATLocation(para);
     obj.BDLcoation();
     Create by WENG LIU; V1.0 2018.8.21 1214
     */
}
