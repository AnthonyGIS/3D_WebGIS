
/*
 * Author : wangcaiming
 * QQ : 814795113 TODO
 * Date : 2014/10/22
 * Compatibility : IE8~11 Firefox Chrome Safari
*/

(function ($) {

    //配置
    $.fn.modal = function (options) {
        options = $.extend({
            trigger: "modalTrigger",			  //触发器		触发器的class | Id | 默认值为 modalTrigger
            modals: "div.modal",				  //动态窗口		窗口的class | Id | 默认为 div.modal
            olayBe: true,						  //设置是否有覆盖层
            olay: {							  //覆盖层：
                opacity: 0.7,					  //透明度		0~1 | 默认值 0.7
                background: "#ccc"			  //背景		background 的属性值 | 默认值 "#ccc"
            },
            popPosition: {						  //弹窗的最后位置
                top: "Up",					 	  //top    "Up" | "Content" | "windowDown" | "bodyDown" | 输入其他默认为 "Content" 
                left: "Right"					  //left    "Left" | "Content" | "Right" | 输入其他默认为 "Content" 
            },
            smallfocuspadding: "7px",			  //焦点
            animationEffect: "slideDown",		  //动画效果
            animationSpeed: "1000",			  //动画时间长度	毫秒为单位的数字 | 默认值为 400
            moveModalSpeed: "400",				  //移除动画时间长度	毫秒为单位的数字 | 默认值为 400
            moveOnScroll: true,				  //弹窗是否随滚动条动画 true | false | 默认值为 true
            resizonwindow: true,				  //设置根据窗口的大小变化而变化	true | false | 默认值为 true
            docClose: true,					  //设置是否点击覆盖层关闭弹窗    true | false | 默认为 true
            closeByKeyboard: "27",    	 	 	  //键盘关闭按钮		输入ASCII对应的数值 | 默认为无关闭按钮 
            close: ".closeBtn"					  //关闭按钮		按钮的class | Id |默认是 .closeBtn
        }, options);

        // 对象
        var olay;
        var modals = $(options.modals);
        var currentModal;
        var isopen = false;
        var $this = this;
        var isOk = false;

        //判断弹窗框是否有设置层高
        if (modals.css("zIndex") === "auto" || modals.css("zIndex") == 0) {
            modals.css("zIndex", 1000)
        }

        var olayBeindex = modals.css("zIndex") - 1;
        //判断是否设置有覆盖层
        if (options.olayBe)
            olay = $("<div></div>").css({
                width: "100%",
                height: ($("body").height() > $(window).height()) ? $("body").height() : "100%",
                opacity: options.olay.opacity,
                background: options.olay.background,
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: olayBeindex,
                display: "none"
            }).appendTo("body");


        //弹窗
        $(options.trigger).bind("click", function (e) {
            e.preventDefault();

            if ($(options.trigger).length > 1) {
                getmodal = $(this).attr("href");
                currentModal = $(getmodal);
            } else {
                currentModal = modals;
            }

            openmodal()
        });

        //关闭按钮触发事件 
        $(options.close).bind("click", closemodal);

        //点击覆盖层关闭弹窗触发事件
        if (options.docClose && options.olayBe)
            olay.bind("click", closemodal);

        //窗口滚动触发事件
        if (options.moveOnScroll)
            $(window).bind("scroll", movemodal);

        //窗口大小变化事件
        if (options.resizonwindow)
            $(window).bind("resize", movemodal);

        //键盘控件事件
        if (options.closeByKeyboard > 0) {
            $("body").keyup(function (e) {
                if (e.which == options.closeByKeyboard) {
                    closemodal();
                }
            });
        }

        /*
         * 
        */

        //打开弹窗
        function openmodal() {

            currentModal.css({
                top: popTop(options.popPosition.top, currentModal),
                left: popLeft(options.popPosition.left, currentModal)
            });

            if (isopen === false) {
                animationEffects[options.animationEffect]();
            } else {
                currentModal.show();
            }

            isopen = true;
        }

        //创建popTop类 返回对应的坐标
        function popTop(methodkey, methodpara) {

            //popTop_数组
            var popTop_ = {
                Up: function (e) {
                    return 0 + $(window).scrollTop();
                },
                Content: function (e) {
                    return $(window).height() / 2 - e.outerHeight() / 2 + $(window).scrollTop();
                },
                windowDown: function (e) {
                    return $(window).height() - e.outerHeight(true) + $(window).scrollTop();
                },
                bodyDown: function (e) {
                    return $("body").height() + $(window).scrollTop();
                }
            };

            //判断该key 是否存在
            if (popTop_[methodkey]) {
                return popTop_[methodkey](methodpara);
            } else {
                return popTop_["Content"](methodpara);
            }
        }

        //创建popLeft类 返回对应的坐标
        function popLeft(methodkey, methodpara) {

            //popLeft_数组
            var popLeft_ = {
                Left: function (e) {
                    return 0 + $(window).scrollLeft();
                },
                Content: function (e) {
                    return $(window).width() / 2 - e.outerWidth() / 2 + $(window).scrollLeft();
                },
                Right: function (e) {
                    return $(window).width() - e.outerWidth(true) + $(window).scrollLeft();
                }
            };

            //判断该key 是否存在
            if (popLeft_[methodkey]) {
                return popLeft_[methodkey](methodpara);
            } else {
                return popLeft_["Content"](methodpara);
            }
        }


        //弹窗动画效果
        var animationEffects = {

            //从上到下动画效果 - 1
            slideDown: function () {

                //判断动画是否执行完
                if (isOk) return false;

                //判断是否有设置背景
                if (options.olayBe)
                    olay.slideDown(options.animationSpeed);

                //动画对象的动画效果
                currentModal.delay(300).slideDown(options.animationSpeed, function () {
                    isOk = true;
                });
            },

            //淡化显示动画效果 - 1
            fadeIn: function () {

                //判断动画是否执行完
                if (isOk) return false;

                if (options.olayBe)
                    olay.fadeIn(options.animationSpeed);

                currentModal.delay(300).fadeIn(options.animationSpeed, function () {
                    isOk = true;
                });
            },

            //放大缩小动画效果 - 1
            movezoom: function () {

                //判断动画是否执行完
                if (isOk) return false;

                var currentModalheight, currentModalwidth, $thisTop, $thisLeft, currentModalTop, currentModalLeft;

                //判断是否有设置背景
                if (options.olayBe)
                    olay.fadeIn(options.animationSpeed);

                //获取动画对象是宽高
                currentModalheight = currentModal.height();
                currentModalwidth = currentModal.width();

                //获取当前对象的坐标
                $thisTop = $this.position().top;
                $thisLeft = $this.position().left;

                //设置动画对象最终的位置
                currentModalTop = popTop(options.popPosition.top, currentModal);
                currentModalLeft = popLeft(options.popPosition.left, currentModal);

                //设置动画对象的初始宽高和坐标
                currentModal.css({
                    top: $thisTop,
                    left: $thisLeft,
                    width: currentModalwidth * 0.1,
                    height: currentModalheight * 0.1
                });

                //动画对象的动画效果
                currentModal.delay(300).stop(false).animate({
                    top: currentModalTop,
                    left: currentModalLeft,
                    width: currentModalwidth,
                    height: currentModalheight
                }, options.animationSpeed, function () {
                    isOk = true;
                }).show();
            },

            //小光标先移动到屏幕居中顶部下一点点距离然后下拉弹窗
            movezoomfadeIn: function () {

                //判断动画是否执行完
                if (isOk) return false;

                var $thisTop, $thisLeft, smallfocus, currentModalheight, laseposition;

                //获取当前对象的位置
                $thisTop = $this.position().top;
                $thisLeft = $this.position().left;

                //获取动画对象的高度
                currentModalheight = currentModal.height();

                //创建移动焦点对象
                smallfocus = $("<div></div>").appendTo("body");
                smallfocus.attr("class", currentModal.prop("class"));
                smallfocus.css({
                    width: "10px",
                    height: "1px",
                    padding: options.smallfocuspadding,
                    top: $thisTop,
                    left: $thisLeft,
                    zIndex: (currentModal.css("zIndex") + 1)
                });


                //设置弹窗最终移动的位置
                laseposition = popTop(options.popPosition.top, currentModal);

                //设置动画对象位置和高度
                currentModal.css({
                    top: laseposition,
                    left: popLeft(options.popPosition.left, currentModal),
                    height: smallfocus.height()
                });

                //判断是否有设置背景
                if (options.olayBe)
                    olay.fadeIn(options.animationSpeed);

                //动画对象的动画效果	
                smallfocus.delay(400).stop(true).animate({
                    top: laseposition,
                    left: popLeft(options.popPosition.left, smallfocus)

                }, options.animationSpeed, function () {
                    smallfocus.animate({
                        width: currentModal.width(),
                        left: popLeft(options.popPosition.left, currentModal)

                    }, options.animationSpeed / 2, function () {
                        smallfocus.remove();
                        currentModal.animate({
                            height: currentModalheight
                        }, options.animationSpeed * 0.8, function () {
                            isOk = true;
                        }).show();
                    })
                }).show();
            }
        };

        //关闭动画效果
        var closeanimationEffects = {

            //从上到下动画效果 - 1
            slideDown: function () {

                //判断动画是否执行完
                if (!isOk) return false;
                isOk = false;

                modals.fadeOut(100, function () {
                    if (options.olayBe)
                        olay.slideUp();
                });
            },

            //淡化显示动画效果 - 1
            fadeIn: function () {

                //判断动画是否执行完
                if (!isOk) return false;
                isOk = false;

                modals.fadeOut(100, function () {
                    if (options.olayBe)
                        olay.fadeOut();
                });

            },

            //放大缩小动画效果 - 1
            movezoom: function () {

                //判断动画是否执行完
                if (!isOk) return false;
                isOk = false;

                var currentModalheight, currentModalwidth, $thisTop, $thisLeft;

                //获取当前对象的坐标
                $thisTop = $this.position().top;
                $thisLeft = $this.position().left;

                //获取动画对象的宽高
                currentModalheight = currentModal.height();
                currentModalwidth = currentModal.width();

                //动画对象的动画效果
                currentModal.stop(true).animate({
                    top: $thisTop,
                    left: $thisLeft,
                    width: currentModalwidth * 0.1,
                    height: currentModalheight * 0.1

                }, options.animationSpeed, function () {
                    if (options.olayBe)
                        olay.fadeOut();
                    currentModal.hide();
                    currentModal.css({
                        width: currentModalwidth,
                        height: currentModalheight
                    })
                });
            },

            movezoomfadeIn: function () {

                //判断动画是否执行完
                if (!isOk) return false;
                isOk = false;

                var currentModalheight, currentModalwidth;

                //获取动画对象的宽高
                currentModalheight = currentModal.height();
                currentModalwidth = currentModal.width();

                //动画对象的动画效果
                currentModal.animate({
                    height: 0,
                    opacity: 0
                }, options.animationSpeed * 0.9, function () {

                    if (options.olayBe)
                        olay.fadeOut(options.animationSpeed / 4);
                    currentModal.css({
                        width: currentModalwidth,
                        height: currentModalheight,
                        opacity: 1,
                        display: "none"
                    })
                })

            }
        };

        //动画弹窗
        function movemodal() {
            setTimeout(function () {

                if (!isOk) return false;

                modals.stop(true).animate({
                    top: popTop(options.popPosition.top, modals),
                    left: popLeft(options.popPosition.left, modals)
                }, options.moveModalSpeed);

            }, 400);

        }

        //关闭弹窗
        function closemodal() {
            isopen = false;
            closeanimationEffects[options.animationEffect]();
        }
    }
})($);