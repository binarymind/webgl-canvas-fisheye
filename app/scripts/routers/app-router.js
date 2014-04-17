define([
	'backbone',
    "views/canvas-view"
],
function(Backbone,CanvasView){
    'use strict';

	return Backbone.Router.extend({
        initialize : function(options) {
            console.log("init app router");
            this.application = options.application;
        },
        /* Backbone routes hash */
		routes: {
            '' : function() {
                if(this.checkLoaded());
                    this.application.appRegion.currentView.loadImage();
            },
            ':image' : function(image) {
                this.checkLoaded();
                this.application.appRegion.currentView.loadImage(image);
            }
        },
        checkLoaded : function() {
            if(!this.application.appRegion.currentView) {
                this.application.appRegion.show(new CanvasView());
                return false;
            }
            return true;
        }
	});
});
