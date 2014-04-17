(function() {
	'use strict';

	var root = this;

	root.define([
		'views/canvas-view'
		],
		function( CanvasView ) {

			describe('CanvasView View', function () {

				it('should be an instance of CanvasView View', function () {
					var canvas-view = new CanvasView();
					expect( canvas-view ).to.be.an.instanceof( CanvasView );
				});

				it('should have more test written', function(){
					expect( false ).to.be.ok;
				});
			});

		});

}).call( this );