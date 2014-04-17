# WEBGL/CANVAS fisheye [preview here](https://binarymind.github.io/webgl-canvas-fisheye/)
## If you just want to launch the fisheye
clone the repo and copy paste the dist folder wherever you want. If you want to change the files of the texture it has to be in a wamp/Lamp server (local or not)

## Installation of the dev environment

needed: Git, Ruby, Mongodb & Compass

### Install mongodb 
http://www.mongodb.org/downloads

### Install node.js & NPM

the website of node.js propose the last stable version of node in various installers (windows, mac etc) with NPM included [nodejs.org](http://nodejs.org/)

### Install the Yeoman  stack 

Yeoman includes Yo, Grunt & Bower

```
npm install -g yo
```
-g signify that the node-module is installed globally

* [yeoman.io](http://yeoman.io/)
* [gruntjs.com](http://gruntjs.com/)
* [bower.io](http://bower.io/)

### Install the generator (facultative)
usefull only if you plan to code new modules. [github.com/mrichard/generator-marionette](https://github.com/mrichard/generator-marionette)

```
npm install -g generator-marionette
```
### Clone the repo git & install the dependances

#### Install the NPM dépendances (back end)

```
npm install
```

#### Install the Bower dependances (front end)

```
bower install
```


## Dev Workflow

### launch mongodb

```
mongod
```

### on other terminal tab, launch the node preview server

```
grunt
```

### to build the application

```
grunt build
```

## Important Notes

* The fisheye manipulations are done in the file /app/scripts/views/canvas-view.js, there is mainly the "globals" hash to modify.
* To load on the fly texture images the file mirror.php must be in the same folder & server as the index.html. 
