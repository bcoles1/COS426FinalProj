import * as Dat from 'dat.gui';
import { TextureLoader,  VertexColors, MeshPhongMaterial, Scene, Color, BoxGeometry, PlaneGeometry, MeshBasicMaterial, DoubleSide, Mesh, CircleBufferGeometry, Plane, Clock } from 'three';
import { Tree, Light, Nature, Park, Road, Flower, Land, Stand, Goal, Circle, ScoreTime } from 'objects';
import { BasicLights } from 'lights';
import { Vector3 } from 'three';


const radius = 5;
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
    constructor(endGame) {
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
            endGameFunc: endGame,
            loserId: -1,
            gameOver: false,
            scoreTime: undefined,
            redScore: 0,
            blueScore: 0,
            time: 60,

        };

        // Set background to a nice color
        //maybe a sky blue?
        this.background = new Color(0x7ec0ee);
        const ST = new ScoreTime();
        this.state.scoreTime = ST;

        // Add meshes to scene
        //we're going to need redPlayer, bluePlayer, football
        //const land = new Land();
        //const flower = new Flower(this);
        const lights = new BasicLights();
        //need to make this.
        //const light1 = new Light(this);
        const tree1 = new Tree(this);
        this.add(tree1);
        const nature1 = new Nature(this);
        this.add(nature1);
        console.log(nature1);
        const stand1 = new Stand(this);
        this.add(stand1);
        const park1 = new Road(this);
        this.add(park1);
        //const park2 = new Park(this);
        //this.add(park2);
        //stand1.scale = new Vector3(0.1, 0.1, 0.1);
        //stand1.scene.scale = new Vector3(0.1, 0.1, 0.1);
        //console.log(stadium1);
        const redCircle = new Circle(this, 1);
        //redCircle.circle.material.color = new Color( 0xff0000 );
        this.state.red.circle = redCircle;
        const blueCircle = new Circle(this, 2);
        //blueCircle.circle.material.color = new Color( 0x0000ff );
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

        let fieldGeometry = new PlaneGeometry(width, 400, 1);
        let texture = new TextureLoader().load('src/field.jpg');
        let fieldMaterial = new MeshBasicMaterial({map: texture, side: DoubleSide});
        const field = new Mesh(fieldGeometry, fieldMaterial);
        field.position.set(0,1,0);
        field.rotateX(-Math.PI/2);
        field.rotateZ(Math.PI/2);

        let fieldGeometry2 = new PlaneGeometry(2000, 2000, 1);
        let texture2 = new TextureLoader().load('src/widerGrass.jpg');
        let fieldMaterial2 = new MeshBasicMaterial({map: texture2, side: DoubleSide});
        const field2 = new Mesh(fieldGeometry2, fieldMaterial2);
        field2.position.set(0,0,0);
        field2.rotateX(-Math.PI/2);

        
        let goalGeomtry = new PlaneGeometry(50, 20, 1);
        
        //create red goal
        const goal1 = new Goal(this);
        this.add(goal1); 
        /*
        let redGoalMaterial = new MeshBasicMaterial({color: 0xFF0000, side: DoubleSide});
        const redGoal = new Mesh(goalGeomtry, redGoalMaterial);
        redGoal.position.set(-199.5, 10, 0);
        redGoal.rotateY(Math.PI/2);
        
        //create blue goal
        let blueGoalMaterial = new MeshBasicMaterial({color: 0x0000FF, side: DoubleSide});
        const blueGoal = new Mesh(goalGeomtry, blueGoalMaterial);
        blueGoal.position.set(199.5, 10, 0);
        blueGoal.rotateY(Math.PI/2);
        */
        // Populate GUI
        //again, won't be necassary in final product.
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        const gradientBox = makeGradientCube(0x000000, 0x003366, width, width, 200, 0.6);
        gradientBox.position.set(0,-100,0);
        this.add(gradientBox, field, field2, redCircle, blueCircle, wall1, wall2, wall3, wall4, lights);
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

    resetPositions() {
        this.state.red.circle.circle.position.set(-100, 5, 0);
        this.state.red.circle.direction.set(0,0,0);
        this.state.blue.circle.circle.position.set(100, 5, 0);
        this.state.blue.circle.direction.set(0,0,0);
        this.state.ball.circle.position.set(0, 5, 0);
        this.state.ball.direction.set(0,0,0);
    }
    
    update(timeStamp) {
        if(!this.state.gameOver) {
            let diff,       // distance vector between objects
                length,     // length of diff ^
                blueMom,    // component of blue's momentum in the direction of collision
                redMom,     // component of red's momentum in the direction of collision 
                transfer;   // distance blue/red move after colliding 

            //check collision between players (red and blue)
            diff = this.state.red.circle.circle.position.clone().sub(this.state.blue.circle.circle.position.clone());
            length = diff.length();
            if (length < 10) {
                diff.normalize().multiplyScalar(0.5 * (10 - length));
                this.state.red.circle.circle.position.add(diff.clone());
                this.state.blue.circle.circle.position.sub(diff.clone());
                diff.normalize();
                blueMom = this.state.blue.circle.direction.clone().projectOnVector(diff);
                redMom = this.state.red.circle.direction.clone().projectOnVector(diff);
                transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
                this.state.red.circle.direction.add(transfer);
                this.state.blue.circle.direction.sub(transfer); 
            }

            // check collision between red and ball
            diff = this.state.red.circle.circle.position.clone().sub(this.state.ball.circle.position.clone());
            length = diff.length(); 
            if (length < 10) {
                diff.normalize().multiplyScalar(0.5*(10-length));
                this.state.red.circle.circle.position.add(diff.clone());
                this.state.ball.circle.position.sub(diff.clone());
                diff.normalize();
                blueMom = this.state.ball.direction.clone().projectOnVector(diff);
                redMom = this.state.red.circle.direction.clone().projectOnVector(diff);
                transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
                this.state.red.circle.direction.add(transfer.clone().multiplyScalar(0.25));
                this.state.ball.direction.sub(transfer.clone().multiplyScalar(4)); 
            }   

            // check collission between blue and ball
            diff = this.state.ball.circle.position.clone().sub(this.state.blue.circle.circle.position.clone());
            length = diff.length();
            if (length < 10) {              
                diff.normalize().multiplyScalar(0.5*(10-length));
                this.state.ball.circle.position.add(diff.clone());
                this.state.blue.circle.circle.position.sub(diff.clone());
                diff.normalize();
                blueMom = this.state.blue.circle.direction.clone().projectOnVector(diff);
                redMom = this.state.ball.direction.clone().projectOnVector(diff);
                transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
                this.state.ball.direction.add(transfer.clone().multiplyScalar(4));
                this.state.blue.circle.direction.sub(transfer.clone().multiplyScalar(0.25)); 
            }

            // update ball positions based on keyboard input 
            this.arrowsInput();
            this.state.red.circle.update();
            this.state.blue.circle.update();
            this.state.ball.update();
            // add weather effect checker?

            // ball is in blue's goal?
            if (this.state.ball.circle.position.x +radius> 200 && this.state.ball.circle.position.z < 25 && this.state.ball.circle.position.z > -25) {
                // update score, reset positions
                this.state.redScore++;
                this.state.scoreTime.updateScore(this.state.redScore, this.state.blueScore);
                this.resetPositions(); // reset positions 
                if(this.state.redScore == 3) { // winner?
                    this.state.gameOver = true;
                    this.state.loserId = 2;
                }
            }

            // ball is in red's goal?
            if (this.state.ball.circle.position.x -radius < -200 && this.state.ball.circle.position.z < 25 && this.state.ball.circle.position.z > -25) {
                // update score, reset positions 
                this.state.blueScore++;
                this.state.scoreTime.updateScore(this.state.redScore, this.state.blueScore);
                this.resetPositions(); // reset positions 
                if(this.state.blueScore == 3) { // winner?
                    this.state.gameOver = true;
                    this.state.loserId = 1;
                }
            }

            if(this.state.gameOver) {
                var endPause = new Clock();
                endPause.start();
                while (endPause.getElapsedTime() < 1) {
                    continue;
                  }
                this.state.endGameFunc(this.state.loserId, this.state.scoreTime.redScore, this.state.scoreTime.blueScore);
            }
        }
    }
}
export default SeedScene;
