import {
    BoxGeometry,
    TorusKnotGeometry, 
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Group,
    Box3,
    Vector3,
    Clock,
    CylinderGeometry,
    CircleGeometry,
    SphereGeometry,
    TextureLoader
  } from 'three';
import footballTex from './football.jpg';
import redTex from './red.jpg';
import blueTex from './blue.jpg';

const LEFT  = 0;
const RIGHT = 2;
const UP    = 1;
const DOWN  = 3;
const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
const Z = new Vector3(0, 0, 1);

class Circle extends Group{
    constructor(parent, playerId) {
        super();
        this.direction = new Vector3(0,0,0);

        const geometry = new SphereGeometry(5, 64, 64);
        let material;
        if(playerId > 1.1 && playerId < 1.9) { // soccer ball 
            let texture2 = new TextureLoader().load(footballTex);
            material = new MeshBasicMaterial({map: texture2});
        }
        else if(playerId < 1.1) { // red player 
            let texture2 = new TextureLoader().load(redTex);
            material = new MeshBasicMaterial({map: texture2});
        }
        else { // blue player 
            let texture2 = new TextureLoader().load(blueTex);
            material = new MeshBasicMaterial({map: texture2});
        }
        this.circle = new Mesh(geometry, material);
        this.circle.position.set(-100 + (playerId - 1) * 200, 5, 0);
        this.circle.rotateX(3*Math.PI/2);
        this.lost = false;
        parent.add(this.circle);

        //parent.addToUpdateList(this);
    }

    updateDir(dir) {
        if(dir === 1) { // right 
            this.direction.z = Math.max(-1.5, this.direction.z - 0.05);
        }
        else if(dir === 3) { // down
            this.direction.z = Math.min(1.5, this.direction.z + 0.05);
        }
        else if(dir === 0) { // left
            this.direction.x = Math.max(-1.5, this.direction.x - 0.05);
        }
        else  { // up
            this.direction.x = Math.min(1.5, this.direction.x + 0.05);
        }
    }

    update(powerup) {
        let radius = 5
        this.circle.rotateOnWorldAxis(X, this.direction.z/10);     
        this.circle.rotateOnWorldAxis(Z, -this.direction.x/10);    
        //maybe some reflection law logic to better improve bounces
        //this is trash at the minute, defintely improve a l'avenir
        if(this.circle.position.x + radius > 200) {
            this.circle.position.x = 200-radius;
            this.direction.x = -this.direction.x/2;
            this.direction.z = this.direction.z/2;
        }
        if(this.circle.position.x -  radius < -200) {
            this.circle.position.x = -200+radius;
            this.direction.x = -this.direction.x/2;
            this.direction.z = this.direction.z/2;
        }

        //check z walls
        if(this.circle.position.z + radius > 200) {
            this.circle.position.z = 200-radius;
            this.direction.z = -this.direction.z/2;
            this.direction.x = this.direction.x/2;
        }
        if(this.circle.position.z -  radius < -200) {
            this.circle.position.z = -200+radius;
            this.direction.z = -this.direction.z/2;
            this.direction.x = this.direction.x/2;
        }
        //add collision detection with each other.


        //do the position change
        let toAdd = this.direction.clone()
        this.circle.position.add(toAdd);
        if (powerup == 1) {
            this.circle.position.add(toAdd); 
        }
        if (powerup == 2) {
            this.circle.position.sub(toAdd.multiplyScalar(0.5)); 
        }
        this.direction.multiplyScalar(0.99);
    }
}
export default Circle;