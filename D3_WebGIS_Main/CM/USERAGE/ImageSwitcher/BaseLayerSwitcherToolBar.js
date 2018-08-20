/**
 * 地图底图切换工具条
 * options
 * 		data - [{Object}] 示例[{"id":1,"label":"地图","className":"vecType","data":{}}]
 * 		selectedIndex - {Number} 当前选择项索引
 * 		target - {Element|String} DOM 目标dom
 */
BaseLayerSwitcherToolBar = function(options) {
    var opt_options = options ? options : {};
    this.selectedIndex = opt_options.selectedIndex ? opt_options.selected_index : 0;

    var target = this.target = opt_options.target;
    if(this.target){
        if(typeof target === 'string'){
            this.target = document.getElementById(target);
        }
    }else{
        this.target = document.createElement("div");
        this.target.className = "map_switch";
    }
    //绑定事件
    var _this = this;
    target = this.target;
    target.onmouseover = function() {
        _this._handleItemMouseover(this);
    };
    target.onmouseout = function() { _this._handleItemMouseout(this); };

    this.elements = [];
    this.onItemClick = null;

    var data = opt_options.data;
    if(data){
        this.setData(opt_options.data);
    }
}

/**
 * 初始化工具
 * @param data - [{Object}] 示例[{"id":1,"label":"地图",className:"vecType",data:{}}]
 */
BaseLayerSwitcherToolBar.prototype.setData = function(data) {
    var _this = this;
    var ctlDiv = this.target;

    var element, item;
    for ( var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        element = _this._createElementByItem(item);
        element.setAttribute("item_index", i);
        _this.elements.push(element);
        //绑定工具项点击事件
        element.onclick = function() {
            var index = _this.selectedIndex = this.getAttribute("item_index");
            _this._updateState();
            if (_this.onItemClick) {
                _this.onItemClick(data[index], index, this);
            }
        }

        element.style.display = i == _this.selectedIndex ? "block" : "none";
        ctlDiv.appendChild(element);
    }
}

/**
 * 创建工具项 DOM
 * @param item
 * @returns {Element}
 */
BaseLayerSwitcherToolBar.prototype._createElementByItem = function(item) {
    var label = item.label;
    var className = item.className;

    var itemDiv = document.createElement("div");
    itemDiv.className = "map_switch_item";

    var itemHover = document.createElement("div");
    itemHover.className = "hoverType";
    itemDiv.appendChild(itemHover);

    var itemType = document.createElement("div");
    itemType.className = "vecType";
    itemType.className = className;
    itemHover.appendChild(itemType);

    var itemLabel = document.createElement("div");
    itemLabel.className = "map_bom";
    if (label) {
        itemLabel.innerText = label;
    }
    itemHover.appendChild(itemLabel);

    return itemDiv;
}

/**
 * 更新工具项可见状态
 * @param elements
 */
BaseLayerSwitcherToolBar.prototype._updateState = function() {
    var div;
    for ( var i = 0, length = this.elements.length; i < length; i++) {
        div = this.elements[i];
        if (i != this.selectedIndex) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}

BaseLayerSwitcherToolBar.prototype._handleItemMouseover = function(elem) {
    //elem.style.width = "300px";
    elem.style.width = "auto";
    for ( var i = 0, length = this.elements.length; i < length; i++) {
        this.elements[i].style.display = "block";
    }
}

BaseLayerSwitcherToolBar.prototype._handleItemMouseout = function(elem) {
    elem.style.width = "70px";
    var div;
    for ( var i = 0, length = this.elements.length; i < length; i++) {
        div = this.elements[i];
        if (i == this.selectedIndex) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    }
}