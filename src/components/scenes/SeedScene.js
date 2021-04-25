import * as Dat from 'dat.gui';
import { VertexColors, MeshPhongMaterial, Scene, Color, BoxGeometry, PlaneGeometry, MeshBasicMaterial, DoubleSide, Mesh, CircleBufferGeometry } from 'three';
//import { Flower, Land } from 'objects';
import { BasicLights } from 'lights';
import {
    Circle
  } from 'objects';
function makeGradientCube(c1, c2, w, d, h, opacity){
    if(typeof opacity === 'undefined') opacity = 1.0;
    if(typeof c1 === 'number') c1 = new Color( c1 );
    if(typeof c2 === 'number') c2 = new Color( c2 );
    
    var cubeGeometry = new BoxGeometry(w, h, d);
    
    var cubeMaterial = new MeshPhongMaterial({
        vertexColors: VertexColors
    });
    
    if(opacity < 1.0){
        cubeMaterial.opacity = opacity;
        cubeMaterial.transparent = true;
    }
    const black = 0x000000;
  
    for(var ix=0; ix<12; ++ix){
        if(ix==4 || ix==5){ //Top edge, all c2
            // cubeGeometry.faces[ix].vertexColors = [c2,c2,c2];
            cubeGeometry.faces[ix].vertexColors = [black,black,black];
            }
        else if(ix==6 || ix==7){ //Bottom edge, all c1
            cubeGeometry.faces[ix].vertexColors = [c1,c1,c1];
            }
        else if(ix%2 ==0){ //First triangle on each side edge
            cubeGeometry.faces[ix].vertexColors = [c2,c1,c2];
            }
        else{ //Second triangle on each side edge
            cubeGeometry.faces[ix].vertexColors = [c1,c1,c2];
            }
    }
    
    return new Mesh(cubeGeometry, cubeMaterial);
}
class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        //Here it is perhaps useful to begin to define some parameters relevant to each player.
        const redPlayer = {
            //bare minimum, for now
            circle: undefined,
            id: 1,
        };
        const bluePlayer = {
            circle: undefined,
            id: 2,
        };
        // Init state
        this.state = {
            //don't need the gui in final game!
            //gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            red: redPlayer,
            blue: bluePlayer,
            ball: undefined,
            keys: {
                KeyW: false,
                KeyD: false,
                KeyS: false,
                KeyA: false,
                ArrowLeft: false,
                ArrowRight: false,
                ArrowUp: false,
                ArrowDown: false,
            },
        };

        // Set background to a nice color
        //maybe a sky blue?
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        //we're going to need redPlayer, bluePlayer, football
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        //need to make this.
        const redCircle = new Circle(this, 1);
        redCircle.circle.material.color = new Color( 0xff0000 );
        this.state.red.circle = redCircle;
        const blueCircle = new Circle(this, 2);
        blueCircle.circle.material.color = new Color( 0x0000ff );
        this.state.blue.circle = blueCircle;
        //this.add(land, flower, lights);
        //make ball here.
        const ball = new Circle(this, 1.5);
        ball.circle.material.color =  new Color( 0xffffff );
        this.state.ball = ball;

        const height = 10;
        const width = 400;
        let boxWallGeometry = new PlaneGeometry(width, height, 1);
        let boxWallMaterial = new MeshBasicMaterial({color: 0xFF9933, side: DoubleSide});
        //x and z are what we play on.
        const wall1 = new Mesh(boxWallGeometry, boxWallMaterial);
        const wall2 = new Mesh(boxWallGeometry, boxWallMaterial);
        const wall3 = new Mesh(boxWallGeometry, boxWallMaterial);
        const wall4 = new Mesh(boxWallGeometry, boxWallMaterial);
        wall1.position.set(0,0,width/2);
        wall2.position.set(0,0,-width/2);
        wall3.position.set(width/2, 0, 0);
        wall3.rotateY(Math.PI/2);
        wall4.position.set(-width/2, 0, 0);
        wall4.rotateY(Math.PI/2);
        // Populate GUI
        //again, won't be necassary in final product.
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        const gradientBox = makeGradientCube(0x000000, 0x003366, width, width, 200, 0.6);
        gradientBox.position.set(0,-100,0);
        this.add(redCircle, blueCircle, wall1, wall2, wall3, wall4, lights, gradientBox);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }
    arrowsInput() {
        if(this.state.keys.ArrowDown) {
            this.state.red.circle.updateDir(3);
        }
        if(this.state.keys.ArrowUp) {
            this.state.red.circle.updateDir(1);
        }
        if(this.state.keys.ArrowLeft) {
            this.state.red.circle.updateDir(0);
        }
        if(this.state.keys.ArrowRight) {
            this.state.red.circle.updateDir(2);
        }
        if(this.state.keys.KeyA) {
            this.state.blue.circle.updateDir(0);
        }
        if(this.state.keys.KeyD) {
            this.state.blue.circle.updateDir(2);
        }
        if(this.state.keys.KeyS) {
            this.state.blue.circle.updateDir(3);
        }
        if(this.state.keys.KeyW) {
            this.state.blue.circle.updateDir(1);
        }
    }

    keyUpdate(keyCode, down) {
        this.state.keys[keyCode] = down;
    }

    
    update(timeStamp) {
        //check collision between players. 
        let diff, length, blueMom, redMom, transfer;
        diff = this.state.red.circle.circle.position.clone().sub(this.state.blue.circle.circle.position.clone());
        if(diff.length() < 10) {
            length = diff.length();
            diff.normalize().multiplyScalar(0.5*(10-length));

            this.state.red.circle.circle.position.add(diff.clone());
            this.state.blue.circle.circle.position.sub(diff.clone());
            diff.normalize();
            blueMom = this.state.blue.circle.direction.clone().projectOnVector(diff);
            redMom = this.state.red.circle.direction.clone().projectOnVector(diff);
            transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
            this.state.red.circle.direction.add(transfer);
            this.state.blue.circle.direction.sub(transfer); 
        }

        //check between red and ball
        diff = this.state.red.circle.circle.position.clone().sub(this.state.ball.circle.position.clone());
        if(diff.length() < 10) {
            length = diff.length();
            diff.normalize().multiplyScalar(0.5*(10-length));

            this.state.red.circle.circle.position.add(diff.clone());
            this.state.ball.circle.position.sub(diff.clone());
            diff.normalize();
            blueMom = this.state.ball.direction.clone().projectOnVector(diff);
            redMom = this.state.red.circle.direction.clone().projectOnVector(diff);
            transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
            this.state.red.circle.direction.add(transfer.clone().multiplyScalar(0.5));
            this.state.ball.direction.sub(transfer.clone().multiplyScalar(2)); 
        }

        //check between blue and ball
        diff = this.state.ball.circle.position.clone().sub(this.state.blue.circle.circle.position.clone());
        if(diff.length() < 10) {
            length = diff.length();
            diff.normalize().multiplyScalar(0.5*(10-length));

            this.state.ball.circle.position.add(diff.clone());
            this.state.blue.circle.circle.position.sub(diff.clone());
            diff.normalize();
            blueMom = this.state.blue.circle.direction.clone().projectOnVector(diff);
            redMom = this.state.ball.direction.clone().projectOnVector(diff);
            transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
            this.state.ball.direction.add(transfer.clone().multiplyScalar(2));
            this.state.blue.circle.direction.sub(transfer.clone().multiplyScalar(0.5)); 
        }


        this.arrowsInput();
        this.state.red.circle.update();
        this.state.blue.circle.update();
        this.state.ball.update();
    }
}

export default SeedScene;
