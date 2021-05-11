import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Nature extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(25, 30, 40);
            gltf.scene.rotateY(Math.PI);
            gltf.scene.position.set(-375,-712,-310);
            this.add(gltf.scene);
            console.log(gltf.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Nature;
