import {
    BoxGeometry,
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

const LEFT = 0;
const RIGHT = 2;
const UP = 1;
const DOWN=3;
const X = new Vector3(1, 0,0);
const Y = new Vector3(0, 1,0);
const Z = new Vector3(0, 0,1);
class Circle extends Group{
    constructor(parent, playerId) {
        super();
        this.direction = new Vector3(0,0,0);
        const geometry = new SphereGeometry(5, 64, 64);
        let material;
        if(playerId > 1.1 && playerId < 1.9) {
            let texture2 = new TextureLoader().load('src/football.jpg');
            material = new MeshBasicMaterial({map: texture2});
        }
        else if(playerId < 1.1) {
            let texture2 = new TextureLoader().load('src/red.jpg');
            material = new MeshBasicMaterial({map: texture2});
        }
        else {
        //idek what this color is - just roll with it for now.
        let texture2 = new TextureLoader().load('src/blue.jpg');
        material = new MeshBasicMaterial({map: texture2});
        }
        this.circle = new Mesh(geometry, material);
        this.circle.position.set(-100 + (playerId-1)*200, 5, 0);
        this.circle.rotateX(3*Math.PI/2);
        this.lost = false;
        parent.add(this.circle)
        //console.log(this.circle.position);

        //parent.addToUpdateList(this);
    }
    updateDir(dir) {
        //console.log(dir);
        if(dir === 1) {
            //console.log(this.direction);
            this.direction.z = Math.max(-1.5, this.direction.z - 0.05);
        }
        else if(dir === 3) {
            this.direction.z = Math.min(1.5, this.direction.z + 0.05);
        }
        else if(dir === 0) {
            this.direction.x = Math.max(-1.5, this.direction.x - 0.05);
        }
        else  {
            this.direction.x = Math.min(1.5, this.direction.x + 0.05);
        }
       // console.log(this.direction);
    }
    update() {
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
        this.direction.multiplyScalar(0.99);



    }
}
export default Circle;