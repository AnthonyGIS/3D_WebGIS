// JavaScript Document
$(function(){
	$(".trigger").modal({
			trigger : ".trigger",				  //触发器		触发器的class | Id | 默认值为 modalTrigger
			modals : "div.modal_1",				  //动态窗口		窗口的class | Id | 默认为 div.modal
			olayBe : true,						  //设置是否有覆盖层
			olay : {							  //覆盖层：
				opacity : 0.7,					  //透明度		0~1 | 默认值 0.7
				background : "#ccc"				  //背景		background 的属性值 | 默认值 "#ccc"
			},
			popPosition : {						  //弹窗的最后位置
				top : "Up",					 	  //top    "Up" | "Content" | "windowDown" | "bodyDown" | 输入其他默认为 "Content" 
				left : "Right"					  //left    "Left" | "Content" | "Right" | 输入其他默认为 "Content" 
			},
			smallfocuspadding : "7px",			  //焦点
			animationEffect : "slideDown",		  //动画效果
			animationSpeed : "1000",			  //动画时间长度	毫秒为单位的数字 | 默认值为 400
			moveModalSpeed : "400",				  //移除动画时间长度	毫秒为单位的数字 | 默认值为 400
			moveOnScroll : true,				  //弹窗是否随滚动条动画 true | false | 默认值为 true
			resizonwindow : true,				  //设置根据窗口的大小变化而变化	true | false | 默认值为 true
			docClose : true,					  //设置是否点击覆盖层关闭弹窗    true | false | 默认为 true
			closeByKeyboard: "27",    	 	 	  //键盘关闭按钮		输入ASCII对应的数值 | 默认为无关闭按钮 
			close : ".closeBtn"					  //关闭按钮		按钮的class | Id |默认是 .closeBtn
	})
	
	$(".trigger2").modal({
		trigger : ".trigger2",
		modals : "div.modal_1",
		animationEffect : "fadeIn",
		popPosition : {						  //弹窗的最后位置
				top : "Content",					 	  //top    "Up" | "Content" | "windowDown" | "bodyDown" | 输入其他默认为 "Content" 
				left : "Content"					  //left    "Left" | "Content" | "Right" | 输入其他默认为 "Content" 
			},
		olayBe : true,
		close : ".close_"
	})
	
	$(".trigger3").modal({
		trigger : ".trigger3",
		modals : "div.modal_1",
		popPosition : {						  //弹窗的最后位置
				top : "windowDown",					 	  //top    "Up" | "Content" | "windowDown" | "bodyDown" | 输入其他默认为 "Content" 
				left : "Left"					  //left    "Left" | "Content" | "Right" | 输入其他默认为 "Content" 
			},
		animationEffect : "movezoom",
		olayBe : true,
		close : ".close_"
	})
	$(".trigger4").modal({
		trigger : ".trigger4",
		modals : "div.modal_1",
		animationEffect : "movezoomfadeIn",
		olayBe : true,
		close : ".close_"
	})
	
})