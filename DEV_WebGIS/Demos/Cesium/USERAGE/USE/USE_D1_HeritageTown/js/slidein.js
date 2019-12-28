$(function () {
    var menu = $('#slide_menu'),
        menuBtn = $('#button'),
        body = $(document.body),
        menuWidth = menu.outerWidth();

    menuBtn.on('click', function () {
        body.toggleClass('open');
        if (body.hasClass('open')) {
            menu.animate({'left': 8}, 120);
        } else {
            menu.animate({'left': -140}, 120);
        }
    });


    // 滑块
    var menu_slide_block = $('#slide_menu_area'),
        menuBtn_sb = $('#button3'),
        menuWidth2 = menu_slide_block.outerWidth();

    menuBtn_sb.on('click', function () {
        body.toggleClass('open');
        if (body.hasClass('open')) {
            menu_slide_block.animate({'right': 8}, 120);
        } else {
            menu_slide_block.animate({'right': -140}, 120);
        }
    });


});    