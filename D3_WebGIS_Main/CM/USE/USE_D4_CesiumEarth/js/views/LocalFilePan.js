define(['./Container','jquery','../models/LayerModel'],function(Container,$,LayerModel){
    var _ = require('underscore');
    var htmlStr = [
        '<div class="form-group has-success">',
        '<input class="my-form-control" type="file" placeholder="' + Resource.selLocalFile + '" style="padding: 8px;"/>',
        '</div>'
    ].join('');
    var LocalFilePan = Container.extend({
        tagName : 'div',
        template : _.template(htmlStr),
        events : {
            'change input' : 'onInputChange'
        },
        initialize : function(options){
            this.model = options.sceneModel;
            this.render();
        },
        render : function(){
            this.$el.html(this.template());
            this.$el.attr({'id' : 'localFilePan','role' : 'tabpanel'});
            this.$el.addClass('tab-pane');
            return this;
        },
        onInputChange : function(evt){
            var target = evt.target;
            var file = target.files[0];
            var layerModel = new LayerModel({
            	type : 'KML',
                file : file
            });
            this.model.addLayer(layerModel);
        }
    });
    return LocalFilePan;
});