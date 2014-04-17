(function() {
	'use strict';

	var root = this;

	root.define([
		'routers/app-router'
		],
		function( AppRouter ) {

			describe('AppRouter Router', function () {

				it('should be an instance of AppRouter Router', function () {
					var app-router = new AppRouter();
					expect( app-router ).to.be.an.instanceof( AppRouter );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );