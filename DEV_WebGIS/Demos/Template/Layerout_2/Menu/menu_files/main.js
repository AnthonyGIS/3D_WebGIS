jQuery(document).ready(function($) {
    var is_bouncy_nav_animating = false;
    //弹出菜单
    $('.cd-bouncy-nav-trigger').on('click', function() {
        triggerBouncyNav(true);
    });
    //关闭菜单
    $('.cd-bouncy-nav-modal .cd-close').on('click', function() {
        triggerBouncyNav(false);
    });
    $('.cd-bouncy-nav-modal').on('click', function(event) {
        if ($(event.target).is('.cd-bouncy-nav-modal')) {
            triggerBouncyNav(false);
        }
    });
    function triggerBouncyNav($bool) {
        //点击若没有动画
        if (!is_bouncy_nav_animating) {
            is_bouncy_nav_animating = true;
            //切换菜单动画
            $('.cd-bouncy-nav-modal').toggleClass('fade-in', $bool).toggleClass('fade-out', !$bool).find('li:last-child').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {
                $('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
                if (!$bool)
                    $('.cd-bouncy-nav-modal').removeClass('fade-out');
                is_bouncy_nav_animating = false;
            });
            //判断css 动画是否开启.. 
            if ($('.cd-bouncy-nav-trigger').parents('.no-csstransitions').length > 0) {
                $('.cd-bouncy-nav-modal').toggleClass('is-visible', $bool);
                is_bouncy_nav_animating = false;
            }
        }
    }
});