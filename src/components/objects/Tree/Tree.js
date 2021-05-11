import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Tree extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(12, 12, 12);
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.position.set(300,0,0);
            this.add(gltf.scene);
        });
        loader.load(MODEL, (gltf2) => {
            gltf2.scene.scale.set(12, 12, 12);
            gltf2.scene.rotateY(Math.PI);
            gltf2.scene.position.set(300,0,100);
            this.add(gltf2.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Tree;
