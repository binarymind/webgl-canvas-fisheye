define([
	'backbone',
	'communicator',
	'hbs!tmpl/welcome',
	'routers/app-router',
	"three"
],

function( Backbone, Communicator, Welcome_tmpl, AppRouter ) {
    'use strict';
    var welcomeTmpl = Welcome_tmpl;

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		"appRegion" :"#app-region"
	});

	/* Add initializers here */
	App.addInitializer( function () {
		document.body.innerHTML = welcomeTmpl();
        App.vent.trigger("APP:START");
        var router = new AppRouter({application: this});
        Backbone.history.start({pushState: false, root: ""}); 
	});

	return App;
});
