import { Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './scene.gltf';
const Y = new Vector3(0, 1, 0);
class Ferrari extends Group {
    constructor(parent, x, z) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        this.name = 'speedup';
        var mesh; 

        loader.load(MODEL, (gltf) => {
            console.log(gltf); 
            gltf.scene.scale.set(0.8, 0.8, 0.8);
            gltf.scene.position.set(x, 5 ,z);
            //gltf.scene.children[0].rotation.set(0, 0.05, 0); 
             
            this.add(gltf.scene);
            //this.rotation.set(0, 0.05, 0);
            //mesh = gltf.scene.children[0]; 
            //parent.add(gltf.scene.children[0]);
        });
        

    }
    update(timeStamp) {
        let axis = new Vector3(this.x, 200, this.z); 
        axis.normalize(); 
       // this.rotateY(0.01);
       
        //this.position.set(this.x + 2, 12, this.z); 
        //console.log(this.rotation); 
        //console.log('hi');
    }
}

export default Ferrari;
