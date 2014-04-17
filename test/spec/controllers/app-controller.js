(function() {
	'use strict';

	var root = this;

	root.define([
		'controllers/app-controller'
		],
		function( AppController ) {

			describe('AppController Controller', function () {

				it('should be an instance of AppController Controller', function () {
					var app-controller = new AppController();
					expect( app-controller ).to.be.an.instanceof( AppController );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );