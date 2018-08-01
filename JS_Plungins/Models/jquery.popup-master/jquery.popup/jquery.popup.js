/*! jquery.popup v1.0 | Author:jzj1993 */
(function($) {
    $.fn.extend({
        popup:function(o) {
            if ($("#popup_overlay").length == 0) {
                $("body").append("<div id='popup_overlay'></div>");
            }
            var defaults = {
                overlay:.1
            };
            o = $.extend(defaults, o);
            return this.each(function() {
                $(this).click(function(e) {
                    var popup_id = $(this).attr("href");
                    $("#popup_overlay").click(function() {
                        close_window(popup_id);
                    });
                    if (o.close) {
                        $(o.close).click(function() {
                            close_window(popup_id);
                        });
                    }
                    var window_height = $(popup_id).outerHeight();
                    var window_width = $(popup_id).outerWidth();
                    $("#popup_overlay").css({
                        display:"block",
                        opacity:0
                    });
                    $("#popup_overlay").fadeTo(200, o.overlay);
                    $styles = {
                        display:"block",
                        position:"fixed",
                        opacity:0,
                        "z-index":11e3,
                        top:"initial",
                        bottom:"initial",
                        left:"initial",
                        right:"initial",
                        margin:"initial"
                    };
                    if (o.top) {
                        // 居顶
                        $styles["top"] = o.top;
                    } else if (o.bottom) {
                        // 居底
                        $styles["bottom"] = o.bottom;
                    } else {
                        // 居中
                        $styles["top"] = "50%";
                        $styles["margin-top"] = -window_height / 2;
                    }
                    if (o.left) {
                        // 居左
                        $styles["left"] = o.left;
                    } else if (o.right) {
                        // 居右
                        $styles["right"] = o.right;
                    } else {
                        // 居中
                        $styles["left"] = "50%";
                        $styles["margin-left"] = -window_width / 2;
                    }
                    $(popup_id).css($styles);
                    $(popup_id).fadeTo(200, 1);
                    // 焦点设置
                    if (o.focus) {
                        $(o.focus).focus();
                    }
                    e.preventDefault();
                });
            });
            function close_window(popup_id) {
                $("#popup_overlay").fadeOut(200);
                $(popup_id).css({
                    display:"none"
                });
            }
        }
    });
})(jQuery);