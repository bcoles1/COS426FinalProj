import * as Dat from 'dat.gui';
import { Group, BoxBufferGeometry, TetrahedronGeometry, VertexColors, TextureLoader, TorusKnotGeometry, MeshPhongMaterial, Scene, Color, BoxGeometry, PlaneGeometry, MeshBasicMaterial, MeshLambertMaterial, DoubleSide, Mesh, Plane, Clock, IcosahedronGeometry } from 'three';
import { Tree, Nature, Road, Stand, Goal, Circle, ScoreTime } from 'objects';
import { BasicLights } from 'lights';
import { Vector3, Vector2 } from 'three';
import { BigBlueGoal, BigRedGoal } from '../objects';
//import { Teleport } from '../objects';

//…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
// Helper functions 
//…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
const radius = 5;
var t = 0; 
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

function createWheels() {
    const geometry = new BoxBufferGeometry(3, 3, 8.25);
    const material = new MeshLambertMaterial({ color: 0x000000 });
    const wheel = new Mesh(geometry, material);
    return wheel;
  }

function createCar() {
    const car = new Group();
    
    const backWheel = createWheels();
    backWheel.position.y = 1.5;
    backWheel.position.x = -4.5;
    car.add(backWheel);
    
    const frontWheel = createWheels();
    frontWheel.position.y = 1.5;  
    frontWheel.position.x = 4.5;
    car.add(frontWheel);
  
    const main = new Mesh(
      new BoxBufferGeometry(15, 3.75, 7.5),
      new MeshLambertMaterial({ color: 0xFF0000 })
    );
    main.position.y = 3;
    car.add(main);
  
    const cabin = new Mesh(
      new BoxBufferGeometry(8.25, 3, 6),
      new MeshLambertMaterial({ color: 0x999999 })
    );
    cabin.position.x = -1.5;
    cabin.position.y = 6.375;
    car.add(cabin);
  
    return car;
  }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
// Initialize and update the scene 
//…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
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
        const powerUp = {
            type: -1, // which of the power ups it is 
            holder: undefined, // who has the power up
            timeLeft: undefined, // how much time is left on power up 
            mesh: undefined, // power up object
            x: undefined, // x position 
            z: undefined, // z position 
        };

        // Init state
        this.state = {
            //don't need the gui in final game!
            //gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            red: redPlayer,
            blue: bluePlayer,
            ball: undefined,
            lastTouch: undefined, 
            power: powerUp, 

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

        const lights = new BasicLights();
        //need to make this.
        //const light1 = new Light(this);
        const tree1 = new Tree(this);
        this.add(tree1);
        const nature1 = new Nature(this);
        this.add(nature1);
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
        this.goal = goal1; 
        
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

    // Helper to create power up objects
    makePowerUp(type, x, z) {
        // TELEPORT 
        if (type == 0) {
            let radius = 3.5;  
            let tubeRadius = 1.5;  
            let radialSegments = 8;  
            let tubularSegments = 64;  
            let p = 2;  
            let q = 3;  
            let geometry = new TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
            let texture = new TextureLoader().load('src/teleport2.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});

            var mesh = new Mesh(geometry, material); 
            this.add( mesh ); 
            return mesh; 
        }

        // SPEED UP 
        else if (type == 1) {
            var car = createCar(); 
            this.add( car ); 
            return car; 
        }

        
        // SLOW DOWN 
        else if (type == 2) {
            var car = createCar(); 
            this.add( car ); 
            return car; 
        }

        // OPPONENT BIG GOAL 
        else if (type == 3) {
            var geometry = new IcosahedronGeometry( 7.5 );
            let texture = new TextureLoader().load('src/banana.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});
            var lathe = new Mesh( geometry, material );
            //lathe.rotateX(Math.pi / 4); 
            this.add( lathe ); 
            return lathe; 
        }

        // OWN BIG GOAL 
        else if (type == 4) {
            var geometry = new IcosahedronGeometry( 7.5 );
            let texture = new TextureLoader().load('src/banana.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});
            var lathe = new Mesh( geometry, material );
            //lathe.rotateX(Math.pi / 4); 
            this.add( lathe ); 
            return lathe; 
        }

        // ICE FIELD 
        else if (type == 5) {
            let radius = 3.5;  
            let tubeRadius = 1.5;  
            let radialSegments = 8;  
            let tubularSegments = 64;  
            let p = 2;  
            let q = 3;  
            let geometry = new TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
            let texture = new TextureLoader().load('src/snowflake.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});

            var mesh = new Mesh(geometry, material); 
            this.add( mesh ); 
            return mesh; 
        }

        // BIG HIT 
        else if (type == 6) {
            let radius = 7.5;  
            let geometry = new TetrahedronGeometry(radius); 
            let texture = new TextureLoader().load('src/red_glow.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});

            var mesh = new Mesh(geometry, material); 
            this.add( mesh ); 
            return mesh; 
            
        }

        // RANDOM 
        else {
            let geometry = new BoxGeometry( 10, 10, 10 );
            let texture = new TextureLoader().load('src/mystery.jpeg');
            let material = new MeshBasicMaterial({map: texture, side: DoubleSide});        
            var cube = new Mesh( geometry, material );
            this.add( cube ); 
            return cube;
        }
        
    }   

    clearPowerUp() {
        console.log("powerup cleared");
        if (this.state.power.type == 3 || this.state.power.type == 4) {
            this.remove(this.goal); 
            let goal = new Goal(); 
            this.goal = goal; 
            this.add(goal); 
        }
        this.state.power.type = -1; 
        this.state.power.mesh = undefined; 
        this.state.power.timeleft = undefined; 
        this.state.power.x = undefined; 
        this.state.power.z = undefined; 
        this.state.power.holder = undefined; 
    }
    
    update(timeStamp) {
        //console.log(this.state.power.timeLeft); 
        if(!this.state.gameOver) {
            let diff,       // distance vector between objects
                length,     // length of diff ^
                blueMom,    // component of blue's momentum in the direction of collision
                redMom,     // component of red's momentum in the direction of collision 
                transfer;   // distance objects move after collision 
            
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
            // POWER UPS 
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
            // check whether a powerUp should be added 
            if (this.state.power.type == -1) {
                let rand = getRandomInt(100); // 100 = magic number, tweek as necessary to change frequency of powerups
                if (rand == 1) { 
                    let x = getRandomInt(380) - 190; // 380, 190 chosen so power up can't exist within 10 units of edge 
                    let z = getRandomInt(380) - 190; 
                    let type = getRandomInt(7); // 8 types of power ups 
                    this.state.power.mesh = this.makePowerUp(type, x, z); 
                    if (type == 7) { // RANDOM powerup
                        type = getRandomInt(6); 
                    }
                    this.state.power.type = type;
                    this.state.power.x = x; 
                    this.state.power.z = z; 
                    //console.log(this.state.power.mesh); 
                    
                    //this.state.power.mesh.position.set(x, 10, z); 
                }
            }

            // if a power up is on the board and hasn't been obtained yet
            t += 0.02; // spinning of power ups
            if (this.state.power.type != -1 && this.state.power.holder == undefined) {
                // make it spin and bob up and down 
                this.state.power.mesh.rotateY(0.05);
                let pos = new Vector3(this.state.power.x, 0, this.state.power.z);
                this.state.power.mesh.position.set(pos.x, 10 + 3*Math.sin(t), pos.z); 

                // check collision between red and power up 
                diff = this.state.red.circle.circle.position.clone().sub(pos.clone());
                length = diff.length();
                if (length < 10) {
                    this.state.power.timeLeft = 100; 
                    this.state.power.holder = 0; // 0 = red, 1 = blue 
                    //console.log(this.state.power); 
                    this.remove(this.state.power.mesh); 
                }

                // check collision between blue and power up 
                diff = this.state.blue.circle.circle.position.clone().sub(this.state.power.mesh.position.clone());
                length = diff.length();
                if (length < 10) {
                    this.state.power.timeLeft = 100; 
                    this.state.power.holder = 1; // 0 = red, 1 = blue 
                    var selectedObject = this.getObjectByName(this.state.power.mesh.name);
                    this.remove( selectedObject );
                    this.remove(this.state.power.mesh); 
                    //console.log(this.state.power); 
                }
            }

            // BIG GOAL power up 
            if (this.state.power.type == 3 && this.state.power.timeLeft > 99.6) {
                if (this.state.power.holder == 0) {
                    
                    let goal = new BigRedGoal(); 
                    this.add(goal); 
                    this.remove(this.goal); 
                    this.goal = goal; 
                }
                else {
                    
                    let goal = new BigBlueGoal(); 
                    this.add(goal); 
                    this.remove(this.goal); 
                    this.goal = goal; 
                }
            }
            else if (this.state.power.type == 4 && this.state.power.timeLeft > 99.6) {
                if (this.state.power.holder == 0) {
                    this.remove(this.goal); 
                    let goal = new BigBlueGoal(); 
                    this.add(goal); 
                    this.goal = goal;  
                }
                else {
                    this.remove(this.goal); 
                    let goal = new BigRedGoal(); 
                    this.add(goal); 
                    this.goal = goal;
                }
            }


            // if a power up has been obtained, decrement its timeLeft
            if (this.state.power.type != -1 && this.state.power.timeLeft > 0) {
                this.state.power.timeLeft -= 0.4; // 0.4 magic number, change depending on how long want power up 
            }
        
            // if no more time left, then take away the power up, set up for a new one to spawn 
            if (this.state.power.holder >= 0 && this.state.power.timeLeft <= 0) {
                this.clearPowerUp(); 
            }
            
 
            
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
            // PLAYER/PLAYER/BALL INTERACTIONS 
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//

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
                if (this.state.power.type == 6) {
                    transfer.multiplyScalar(3); 
                }
                this.state.red.circle.direction.add(transfer);
                this.state.blue.circle.direction.sub(transfer); 
            }

            // check collision between red and ball
            diff = this.state.red.circle.circle.position.clone().sub(this.state.ball.circle.position.clone());
            length = diff.length(); 
            if (length < 10) {
                this.state.lastTouch = 0; 
                diff.normalize().multiplyScalar(0.5*(10-length));
                this.state.red.circle.circle.position.add(diff.clone());
                this.state.ball.circle.position.sub(diff.clone());
                diff.normalize();
                blueMom = this.state.ball.direction.clone().projectOnVector(diff);
                redMom = this.state.red.circle.direction.clone().projectOnVector(diff);
                transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
                if (this.state.power.type == 6) {
                    transfer.multiplyScalar(3); 
                }
                this.state.red.circle.direction.add(transfer.clone().multiplyScalar(0.25));
                this.state.ball.direction.sub(transfer.clone().multiplyScalar(4)); 
            }   

            // check collission between blue and ball
            diff = this.state.ball.circle.position.clone().sub(this.state.blue.circle.circle.position.clone());
            length = diff.length();
            if (length < 10) {        
                this.state.lastTouch = 1;  
                diff.normalize().multiplyScalar(0.5*(10-length));
                this.state.ball.circle.position.add(diff.clone());
                this.state.blue.circle.circle.position.sub(diff.clone());
                diff.normalize();
                blueMom = this.state.blue.circle.direction.clone().projectOnVector(diff);
                redMom = this.state.ball.direction.clone().projectOnVector(diff);
                transfer = blueMom.clone().sub(redMom.clone()).multiplyScalar(0.5);
                if (this.state.power.type == 6) {
                    transfer.multiplyScalar(3); 
                }
                this.state.ball.direction.add(transfer.clone().multiplyScalar(4));
                this.state.blue.circle.direction.sub(transfer.clone().multiplyScalar(0.25)); 
            }

            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
            // UPDATE BALL POSITIONS, POWERUPS
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//

            // update ball positions based on keyboard input 
            this.arrowsInput();

            if (this.state.power.type == 1 && this.state.power.holder != undefined) { // SPEED UP 
                if (this.state.power.holder == 0) {
                    this.state.red.circle.update(1); 
                    this.state.blue.circle.update(0);
                    this.state.ball.update(0);
                }
                else {
                    this.state.blue.circle.update(1); 
                    this.state.red.circle.update(0);
                    this.state.ball.update(0);
                }
            } 
            else if (this.state.power.type == 2 && this.state.power.holder != undefined) { // SLOW DOWN 
                if (this.state.power.holder == 0) {
                    this.state.red.circle.update(2); 
                    this.state.blue.circle.update(0);
                    this.state.ball.update(0);
                }
                else {
                    this.state.blue.circle.update(2);
                    this.state.red.circle.update(0);
                    this.state.ball.update(0); 
                }
            }
            else {
                this.state.red.circle.update(0);
                this.state.blue.circle.update(0);
                this.state.ball.update(0);
            }
            
            // TELEPORT power up, swap red and blue positions 
            if (this.state.power.type == 0 && this.state.power.holder != undefined) {
                //console.log(this.state.red.circle.position); 
                let tmp = this.state.red.circle.circle.position.clone(); 
                let tmp2 = this.state.blue.circle.circle.position.clone();
                this.state.red.circle.circle.position.set(tmp2.x, tmp2.y, tmp2.z); 
                this.state.blue.circle.circle.position.set(tmp.x, tmp.y, tmp.z); 
                this.clearPowerUp(); 
            }
            
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//
            // BALL/GOAL INTERACTIONS
            //…………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………//

            var red_goal_z = 25; 
            var blue_goal_z = 25; 
            if (this.state.power.type == 3 && this.state.power.holder == 0 
                || this.state.power.type == 4 && this.state.power.holder == 1) { // blue's goal is big 
                blue_goal_z = 50; 
            }
            else if (this.state.power.type == 3 && this.state.power.holder == 1
                    || this.state.power.type == 4 && this.state.power.holder == 0) { // red's goal is big 
                red_goal_z = 50; 
            }


            // ball is in blue's goal? 
            if (this.state.ball.circle.position.x +radius> 200 && this.state.ball.circle.position.z < blue_goal_z && this.state.ball.circle.position.z > -blue_goal_z) {
                // update score, reset positions
                this.state.redScore++;
                this.state.scoreTime.updateScore(this.state.redScore, this.state.blueScore);
                // check if own-goal 
                if (this.state.lastTouch == 1) {
                    console.log("own goal!"); 
                }
                this.resetPositions(); // reset positions 
                if(this.state.redScore == 3) { // winner?
                    this.state.gameOver = true;
                    this.state.loserId = 2;
                }
            }

            // ball is in red's goal?
            if (this.state.ball.circle.position.x -radius < -200 && this.state.ball.circle.position.z < red_goal_z && this.state.ball.circle.position.z > -red_goal_z) {
                // update score
                this.state.blueScore++;
                this.state.scoreTime.updateScore(this.state.redScore, this.state.blueScore);

                // check if own-goal 
                if (this.state.lastTouch == 0) {
                    console.log("own goal!"); 
                }

                // reset positions, end game if score limit reached 
                this.resetPositions(); // reset positions 
                if(this.state.blueScore == 3) { // winner?
                    this.state.gameOver = true;
                    this.state.loserId = 1;
                }
            }
            
            // score limit reached?
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
