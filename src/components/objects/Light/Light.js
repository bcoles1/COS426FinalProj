import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Light extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.05, 0.05, 0.05);
            gltf.scene.rotateY(7*Math.PI/4);
            gltf.scene.position.set(-200,-20,-200);
            this.add(gltf.scene);
        });
        loader.load(MODEL, (gltf2) => {
            gltf2.scene.scale.set(0.05, 0.05, 0.05);
            gltf2.scene.rotateY(5*Math.PI/4);
            gltf2.scene.position.set(210,-20,-200);
            this.add(gltf2.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Light;
