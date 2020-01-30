$(function(){
    let scotchPanel = $('#scotch-panel').scotchPanel({
        containerSelector: 'body',
        direction: 'right',
        duration: 300,
        transition: 'ease',
        clickSelector: '.toggle-panel',
        distanceX: '40%',  // 页面宽度缩小到手机方式查看时，右上角的菜单的宽度。
        enableEscapeKey: true
    });

    $(window).resize(function() {
        if ($(window).width() >= 769 && $('.scotch-panel-canvas').hasClass('scotch-is-showing')) {
            scotchPanel.close();
        }
    });
});