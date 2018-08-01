(function(root,factory,plug){
        factory(root,plug);
    })(window,function(root,plug){
        if(!root['$']||!root['jQuery']){
            throw new Error('This plug-in relies on jquery,Please introduce jQuery first ');
        }
        var instance;
        var Dialog = function(options){
            return new Dialog.prototype.init(options);
        }
        Dialog.prototype={
            constructor:Dialog,
            init:function(options){
                this.box = options.box||'body';//tip/dialog:表示提示框内容要展示的容器
                this.dom = options.dom||'';//tip:表示提示框内容 dialog:表示弹出框内容
                this.type = options.type||'tip';//判断类型
                this.content = options.content||'content';//提示框独有 表示提示框的内容
                this.effectIn = options.effectIn||'';//进入时候的动画
                this.effectOut = options.effectOut||'';//离开时的动画
                this.hasMask = options.hasMask||true;//是否有遮罩层
                this.time = options.time||1500;// 提示框独有 tips框隐藏的时间
                this.closeBtn = options.closeBtn||'';//关闭按钮class id
                this.closeBtn1 = options.closeBtn1||'';
                this.listener = {};
                this.handler = [];
                this.show();
            },
            show:function(callback){
                if(instance)return;
                instance = this;
                var _this = this;
                if(this.type==='tip'){
                    if(this.dom){
                        $(this.dom).css({display:'block'}).addClass(this.effectIn);
                    }else{
                        createTip(this.box,this.content,this.effectIn);
                    }
                    setTimeout(function(){
                        _this.hide()    
                    },_this.time)
                }
                if(this.type==='dialog'){
                    $(this.box).css({'overflow':'hidden'});
                    if(this.hasMask&&typeof this.hasMask === 'boolean'){
                        createMask(this.box);
                        $('#dialog-mask').show();
                    }else if(this.hasMask&&typeof this.hasMask === 'string'){
                        $(this.hasMask).show();
                    }
                    if(this.dom){
                        $(this.dom).css({position:'absolute',left:'50%',top:'50%',display:'block',zIndex:1000})
                        .css({marginTop:$(this.dom).height()/-2+'px',marginLeft:$(this.dom).width()/-2+'px'})
                        .addClass(this.effectIn);
                    }else{
                        console.error('你需要展示的dom结构呢？？');
                        return;
                    }
                    this.closeBtn&&$("body ."+this.closeBtn).one('click',function(){
                        _this.hide(1);
                    })
                    this.closeBtn1&&$("body ."+this.closeBtn1).one('click',function(){
                        _this.hide(2);
                    })
                }
                return this;
            },
            hide:function(s){
                var _this = this;
                if(this.type==='tip'){
                    if(_this.dom){
                        $(_this.dom).removeClass(this.effectIn).addClass(this.effectOut);
                        if(!this.effectOut){
                            $(_this.dom).css({display:'none'});
                            instance = null;
                            if(_this.handler.indexOf('remove')>-1){
                                _this.emit('remove')
                            }
                        }else{
                            $(_this.dom).one('webkitAnimationEnd',function(){
                                $(_this.dom).css({display:'none'}).removeClass(this.effectOut).off('webkitAnimationEnd');
                                instance = null;
                                if(_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove')
                                }
                            })
                        }   
                    }else{
                        $('#dialog-tips').removeClass(this.effectIn).addClass(this.effectOut);
                        if(!this.effectOut){
                            $('#dialog-tips').remove();
                            instance = null;
                            if(_this.handler.indexOf('remove')>-1){
                                _this.emit('remove')
                            }
                        }else{
                            $('#dialog-tips').one('webkitAnimationEnd',function(){
                                $(this).remove();
                                instance = null;
                                if(_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove')
                                }
                            })
                        }   
                    }   
                }
                if(this.type==='dialog'){
                    if(this.hasMask&&typeof this.hasMask === 'boolean'){
                        var t = $('#dialog-mask');
                    }else if(this.hasMask&&typeof this.hasMask === 'string'){
                        var t = $(this.hasMask);
                    }
                    if(this.effectOut){              
                        $(this.dom).removeClass(_this.effectIn).addClass(this.effectOut);
                        $(this.dom).one('webkitAnimationEnd',function(){
                                $(_this.dom).css({display:'none'}).removeClass(_this.effectOut).off('webkitAnimationEnd');
                                t.css({display:'none'});
                                $('#dialog-mask').remove();
                                $(_this.box).css({'overflow':'auto'});
                                instance = null;
                            _this.closeBtn&&$("body ."+_this.closeBtn).off('click');
                            _this.closeBtn1&&$("body ."+_this.closeBtn1).off('click');
                            if(_this.closeBtn1){
                                if(s==2&&_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove');
                                    return;
                                }
                                if(s==1&&_this.handler.indexOf('close')>-1){
                                    _this.emit('close');
                                    return;
                                }
                            }else{
                                if(_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove');
                                }
                            }
                            
                        })
                    }else{
                        $(_this.dom).css({display:'none'}).removeClass(_this.effectIn);
                        t.css({display:'none'});
                        $('#dialog-mask').remove();
                        instance = null;
                        _this.closeBtn&&$("body ."+_this.closeBtn).off('click');
                        _this.closeBtn1&&$("body ."+_this.closeBtn1).off('click');
                        $(this.box).css({'overflow':'auto'});
                         if(_this.closeBtn1){
                                if(s==2&&_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove');
                                    return;
                                }
                                if(s==1&&_this.handler.indexOf('close')>-1){
                                    _this.emit('close');
                                    return;
                                }
                            }else{
                                if(_this.handler.indexOf('remove')>-1){
                                    _this.emit('remove');
                                }
                            }
                    }   
                }
                return this;
            },
            on:function(type,fn){
                this.handler.push(type);
                if(typeof this.listener[type]==='undefined'){
                    this.listener[type]=[];
                }
                if(typeof fn==='function'){
                    this.listener[type].push(fn);   
                }
                return this;
            },
            emit:function(type){
                var fnArr = this.listener[type];
                for(var i=0;i<fnArr.length;i++){
                    if(typeof fnArr[i] ==='function'){
                        fnArr[i]({type:type})
                    }
                }
                return this;
            },
            off:function(type,fn){
                var fnArr = this.listener[type];
                if(typeof fn==='function'||fn){
                    for(var i=0;i<fnArr;i++){
                        if(fnArr[i]===fn){
                            this._listeners[type].splice(i,1);
                            break;
                        }
                    }   
                }else{
                    delete this.listener[type];
                }
                return this;
            }

        }
        Dialog.prototype.init.prototype = Dialog.prototype;
        // 监听事件
        
        // create tips
        function createTip(dom,content,effect){
            $(dom).append('<div id="dialog-tips" style="display:inline-block;padding:5px 12px;background:rgba(0,0,0,.8);color:#fff;position:absolute;top:50%;left:50%;border-radius:5px;z-index:1000">'+content+'</div>');
            $('#dialog-tips').css({marginLeft:$('#dialog-tips').width()/-2+'px',marginTop:$('#dialog-tips').height()/-2+'px'}).addClass(effect);
        }
        // create mask
        function createMask(box){
            $(box).append('<div id="dialog-mask" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99;"></div>')
        }
        //全局注册
        root[plug]=Dialog;   
    },'Dialog')