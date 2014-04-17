define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	return Backbone.Marionette.Controller.extend({

		initialize: function( options ) {
            this.application = options.application;
			console.log("initialize a AppController Controller");
		},
        page : function(image) {
            this.application.appRegion.loadImage(image);
        }
	});

});
