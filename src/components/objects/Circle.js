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
    CircleGeometry
  } from 'three';

const LEFT = 0;
const RIGHT = 2;
const UP = 1;
const DOWN=3;
class Circle extends Group{
    constructor(parent, playerId) {
        super();
        this.direction = new Vector3(0,0,0);
        const geometry = new CircleGeometry(5, 32);
        //idek what this color is - just roll with it for now.
        const material = new MeshBasicMaterial({color:0xff0591});
        this.circle = new Mesh(geometry, material);
        this.circle.position.set(-100 + (playerId-1)*200, 10, 0);
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
            this.direction.z = Math.max(-1, this.direction.z - 0.1);
        }
        else if(dir === 3) {
            this.direction.z = Math.min(1, this.direction.z + 0.1);
        }
        else if(dir === 0) {
            this.direction.x = Math.max(-1, this.direction.x - 0.1);
        }
        else  {
            this.direction.x = Math.min(1, this.direction.x + 0.1);
        }
       // console.log(this.direction);
    }
    update() {
        let radius = 5
        
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



    }
}
export default Circle;