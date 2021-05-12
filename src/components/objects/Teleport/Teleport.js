import { Group, TorusKnotGeometry, TextureLoader, MeshBasicMaterial, Mesh, DoubleSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

var t = 0; 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
class Teleport extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        let radius = 3.5;  
        let tubeRadius = 1.5;  
        let radialSegments = 8;  
        let tubularSegments = 64;  
        let p = 2;  
        let q = 3;  
        let geometry = new TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
        let texture = new TextureLoader().load('src/teleport_powerup.jpeg');
        let material = new MeshBasicMaterial({map: texture, side: DoubleSide});

        var mesh = new Mesh(geometry, material); 
        let x = getRandomInt(380) - 190; // 380, 190 chosen so power up can't exist within 10 units of edge 
        let z = getRandomInt(380) - 190; 
        mesh.position.set(x, 10, z); 
        console.log("here");
        return mesh; 
        

    }
    update(timeStamp) {
        t += 0.02; 
        console.log('hi');
        this.rotateY(0.05);
        let pos = this.position; 
        this.position.set(pos.x, 10 + 3*Math.sin(t), pos.z); 
    }
}

export default Teleport;
