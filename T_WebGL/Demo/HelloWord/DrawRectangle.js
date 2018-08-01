function  main() {
    // get canvas
    var canvas = document.getElementById('example');
    if (!canvas)
    {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // 获取绘制二维图形的绘图上下文
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(0,0,255,1.0)';
    ctx.fillRect(120,10,150,150);
}