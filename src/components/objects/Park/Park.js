import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Park extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(0.04, 0.04, 0.04);
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.position.set(100,0,-250);
            this.add(gltf.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Park;
