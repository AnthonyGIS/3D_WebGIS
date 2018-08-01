
## 简介

jQuery.popup插件是一款简单易用的网页弹窗插件，是在jQuery.leanModal插件的基础上改进而来。

## 功能

- 可在上下左右四个方向灵活设置弹窗位置

- 弹窗淡出效果

- 支持关闭弹窗按钮

- 点击弹窗之外可关闭

- 弹窗后空白区域变暗，且透明度可设置

- 窗口弹出后，可自动将焦点设置给指定元素

## 参数说明

- top,bottom,left,right参数用于控制弹窗位置，可支持多种格式，和css中的属性一致，例如：`'100px'`,`'10%'`

 - top:    弹窗顶端边距

 - bottom: 弹窗底部边距

 - left:   弹窗左侧边距

 - right:  弹窗右侧边距
 
 - **如果top和bottom参数均未设置，则窗口垂直居中；如果设置了top参数，则bottom参数无效**

 - **如果left和right参数均未设置，则窗口水平居中；如果设置了left参数，则right参数无效**

- focus, close参数均为字符串形式，与jquery选择器的写法一致，如`'#my_id'`可以选择id为`my_id`的元素, `'.my_cls'`可以选择具有属性`class='my_cls'`的元素。

 - focus:  窗口弹出后焦点元素选择器（默认无）

 - close:  关闭按钮选择器（默认无）

- overlay:覆盖层透明度（范围0~1，默认为0.1，数值越大颜色越深，背景越暗）

## 使用简介

### 1. 在HTML中包含以下文件：

- `jquery.min.js`：jquery支持库(经过压缩后的最小版本)
- `jquery.popup.min.js`：本插件的源文件(经过压缩后的最小版本)
- `jquery.popup.css`：本插件依赖的CSS

 即在`<head>`标签中添加：
 
 ```html
<script src="jquery.min.js"></script>
<script src="jquery.popup.min.js"></script>
<link rel="stylesheet" type="text/css" href="jquery.popup.css">
```

### 2. HTML代码

```html
<style>#wnd {display:none;background:#FFF;width:100px;height:100px}</style>
<a id="link" href="#wnd">ShowPopupWindow</a>
<div id="wnd">
	<a class="close" href="#">ClosePopupWindow</a>
</div>
```

### 3. JavaScript代码

```html
<script>
	$("#link").popup({
		top:"50px",
		overlay:0.4,
		focus:"#input",
		close:".close"
	});
</script>
```

实际使用效果见Demo。
