define([
	'backbone',
    'hbs!tmpl/canvas',
],
function(Backbone, CanvasTemplate){
    'use strict';

	return Backbone.Marionette.ItemView.extend({
        rotation : {
            x : 0,
            y : 0,
            z : 0
        },
        translation : {
            x : 0,
            y : 0,
            z : 0
        },
        magnet : {
            diameter : 100,
            strength : -10,
            x:0,
            y:0,
            z:10
        },
        globals : {
            mirrorUrl : "mirror.php?url=",
            file : Modernizr.touch ? 'images/texture-small.jpg' : 'images/texture.jpg',
            vertexCount :  Modernizr.touch ? 7 : 40,
            cameraZ : 500, 
            planeDimensionX : 749,
            planeDimensionY : 500,
            orthogonalVector : new THREE.Vector3( 0, 1, 1 )
        },
        initializeScreenDimensions : function() {
            this.globals.screenWidth = window.innerWidth;
            this.globals.screenHeight = window.innerHeight;
        },
        loadImage : function(image) {
            console.log("LOAD",image);
            /*
            if(_.isUndefined(image)) return;
            var img = new Image,
                canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d"),
                src = image;

            //img.crossOrigin = "Anonymous";
            var that = this;
            
            img.onload = function(e) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage( img, 0, 0 );
                var toLoadImage = canvas.toDataURL("image/png");

                var floorTexture    = new THREE.ImageUtils.loadTexture(toLoadImage);
                floorTexture.wrapS  = floorTexture.wrapT = THREE.RepeatWrapping; 
                floorTexture.repeat.set( 1, 1 );
                that.objects.plane.material.map = floorTexture;
            }

            img.src = src;
            // make sure the load event fires for cached images too
            if ( img.complete || img.complete === undefined ) {
                img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                img.src = src;
            }*/


            console.log("loadImage",THREE.ImageUtils.crossOrigin);
            var toLoadImage = '';
            if(_.isUndefined(image) || image =="") toLoadImage = this.globals.file;
            else toLoadImage = this.globals.mirrorUrl+image;
            
            var floorTexture    = new THREE.ImageUtils.loadTexture(toLoadImage);
            floorTexture.wrapS  = floorTexture.wrapT = THREE.RepeatWrapping; 
            floorTexture.repeat.set( 1, 1 );
            this.objects.plane.material.map = floorTexture;
        },
        objects : {},
		initialize: function() {
			console.log("initialize a CanvasView View");
            var that = this;
            $(window).on("resize", function(){
                that.resize()
            });
		},
        resize : function() {
            this.initializeScreenDimensions();
            if(this.objects.renderer)
                this.objects.renderer.setSize( this.globals.screenWidth, this.globals.screenHeight); 
            if(this.objects.camera)
                this.objects.camera.setSize(this.globals.screenWidth, this.globals.screenHeight)
        },
        ui : {
            "input" : "#input-area input"
        },
        events : {
            'touchstart canvas':"onMouseDown",
            "mousedown canvas":"onMouseDown",
            "mousemove canvas":'onMouseMove',
            "touchmove canvas":'onMouseMove',
            'submit form' : "changeFileFromForm"
        },
        changeFileFromForm : function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.loadImage(this.ui.input.val());
        },
        onMouseDown : function(e) {
            e.preventDefault();
            e.stopPropagation();
        },
        onMouseMove : function(e) {
            e.preventDefault();
            e.stopPropagation();
            //this.rotation.x = (e.originalEvent.pageY>this.globals.screenHeight/2 ? 0.02 : -0.02);
            //this.rotation.y = (e.originalEvent.pageX>this.globals.screenWidth/2 ? 0.02 : -0.02);
            
            //this where begin to transform the mouse cordinates to three,js cordinates
            this.mouse.x = ( e.originalEvent.pageX / this.globals.screenWidth ) * 2 - 1;
            this.mouse.y = - ( e.originalEvent.pageY / this.globals.screenHeight ) * 2 + 1;
            
            //this vector caries the mouse click cordinates
            this.mouse.mouse_vector.set( this.mouse.x, this.mouse.y, this.mouse.z );
            
            //the final step of the transformation process, basically this method call
            //creates a point in 3d space where the mouse click occurd
            this.mouse.projector.unprojectVector( this.mouse.mouse_vector, this.objects.camera );
            
            var direction = this.mouse.mouse_vector.sub( this.objects.camera.position ).normalize();
            
            this.mouse.ray.set( this.objects.camera.position, direction );
            
            //asking the raycaster if the mouse click touched the sphere object
            this.mouse.intersects = this.mouse.ray.intersectObject( this.objects.plane );
            
            //the ray will return an array with length of 1 or greater if the mouse click
            //does touch the sphere object
            if( this.mouse.intersects.length ) {
                this.magnet.x = this.mouse.intersects[0].point.x;
                this.magnet.y = this.mouse.intersects[0].point.y;

                //set the new translation
                //----------------------------------------
                if(Math.abs(e.originalEvent.pageX-this.globals.screenWidth/2) <100) 
                    this.translation.x = 0;
                else 
                    this.translation.x = (e.originalEvent.pageX>this.globals.screenWidth/2 ? 1 : -1);
                
                if(Math.abs(e.originalEvent.pageY-this.globals.screenHeight/2) <100) 
                    this.translation.y = 0;
                else 
                    this.translation.y = (e.originalEvent.pageY>this.globals.screenHeight/2 ? -1 : 1);
            } else {
                this.translation.y = 0;
                this.translation.x = 0;
            }
        },
        addCamera : function() {
            this.objects.camera = new THREE.CombinedCamera(this.globals.screenWidth, this.globals.screenHeight, 45, 1, 10000);
            this.objects.camera.position.set(0, 0, this.globals.cameraZ);
            this.objects.camera.lookAt( this.globals.orthogonalVector );
            this.objects.scene.add(this.objects.camera);
        },
        addLights : function() {
            var light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(-50, 250, 250);
            this.objects.scene.add(light);
        },
        addObject : function() {
            this.objects.mainGroup = new THREE.Object3D();
            var geometry = new THREE.PlaneGeometry(this.globals.planeDimensionX, this.globals.planeDimensionY, this.globals.vertexCount, this.globals.vertexCount);
            geometry.dynamic = true;
            THREE.ImageUtils.crossOrigin = 'anonymous'; 
            var floorTexture    = new THREE.ImageUtils.loadTexture( this.globals.file );
            floorTexture.wrapS  = floorTexture.wrapT = THREE.RepeatWrapping; 
            floorTexture.repeat.set( 1, 1 );
            var material   = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
            
            this.objects.plane = new THREE.Mesh(geometry, material);
            this.objects.plane.dynamic = true;
            this.objects.plane.position.set(0, 0, 0);
            
            this.objects.plane.doubleSided = true;
            this.objects.plane.verticesNeedUpdate = false;
            this.objects.plane.elementsNeedUpdate = false;
            this.objects.plane.morphTargetsNeedUpdate = false;
            this.objects.plane.uvsNeedUpdate = false;
            this.objects.plane.normalsNeedUpdate = false;
            this.objects.plane.colorsNeedUpdate = false;
            this.objects.plane.tangentsNeedUpdate = false;
            
            this.objects.mainGroup.add(this.objects.plane);

            this.objects.scene.add(this.objects.mainGroup);
            this.savePositions();
        },
        savePositions : function() {
            var maxVertices = this.objects.plane.geometry.vertices.length;
            for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
                this.objects.plane.geometry.vertices[vertexI].saved = {
                    x : this.objects.plane.geometry.vertices[vertexI].x,
                    y : this.objects.plane.geometry.vertices[vertexI].y, 
                    z : this.objects.plane.geometry.vertices[vertexI].z
                };
            }
        },  
        distortViaMagnets : function() {
            var maxVertices = this.objects.plane.geometry.vertices.length;
            var magneticMaxValue = this.magnet.diameter;
            var factor = 7;
            
            for (var vertexI = 0; vertexI < maxVertices; vertexI++) {
                var vertex = this.objects.plane.geometry.vertices[vertexI].saved;
                var distance = this.getDistance3d(this.magnet, vertex);
                //console.log(distance);
                var power = magneticMaxValue / distance / this.magnet.strength;
                this.objects.plane.geometry.vertices[vertexI].setX(vertex.x + ( (this.magnet.x - vertex.x) * power ) * factor);
                this.objects.plane.geometry.vertices[vertexI].setY(vertex.y + ( (this.magnet.y - vertex.y) * power ) * factor);
                this.objects.plane.geometry.vertices[vertexI].setZ(vertex.z + ( (this.magnet.z - vertex.z) * power ) * factor);
            }
            this.objects.plane.geometry.verticesNeedUpdate = true;
        },  
        addRenderer : function() {
            if (!Modernizr.touch) 
                this.objects.renderer = new THREE.WebGLRenderer(); 
            else
                this.objects.renderer = new THREE.CanvasRenderer();
            this.objects.renderer.shadowMapType = THREE.PCFSoftShadowMap;

            this.objects.renderer.setClearColor(new THREE.Color( 0x000000 ), 1);
            this.$el[0].appendChild(this.objects.renderer.domElement);
        },
        getDistance3d : function(vertex1, vertex2) {
            var xfactor = vertex2.x - vertex1.x;
            var yfactor = vertex2.y - vertex1.y;
            var zfactor = vertex2.z - vertex1.z;
            return Math.sqrt( (xfactor*xfactor) + (yfactor*yfactor) + (zfactor*zfactor) );
        },
        initMouse : function(){
            this.mouse = {
                x : 0,
                y : 0,
                z : 1,
                projector       : new THREE.Projector(),
                mouse_vector    : new THREE.Vector3(),
                ray             : new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) ),
                intersects      : []
            };
        },
        render : function() {

            this.initializeScreenDimensions();
            this.objects.scene = new THREE.Scene(); 
            this.projector = new THREE.Projector();
            this.initMouse();
            this.addCamera();
            
            if(!Modernizr.touch) 
                this.addLights();
            this.addObject();
            this.addRenderer();
            this.$el.append(CanvasTemplate());
            this.bindUIElements();
            this.build
            this.resize();
            this.renderLoop();
        },
        renderLoop : function() { 
            this.objects.camera.position.y += this.translation.y;
            this.objects.camera.position.y = Math.max(-this.globals.planeDimensionY,Math.min(this.globals.planeDimensionY,this.objects.camera.position.y));
            
            this.objects.camera.position.x += this.translation.x;
            this.objects.camera.position.x = Math.max(-this.globals.planeDimensionX,Math.min(this.globals.planeDimensionX,this.objects.camera.position.x));
            this.objects.camera.updateProjectionMatrix();

            this.distortViaMagnets();
            this.objects.renderer.render(this.objects.scene, this.objects.camera); 
            var that = this;
            requestAnimationFrame(function(){
                that.renderLoop();
            }); 
        } 
	});
});
