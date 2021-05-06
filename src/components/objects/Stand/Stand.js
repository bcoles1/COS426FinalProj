import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './scene.gltf';

class Stand extends Group {
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
        loader.load(MODEL, (gltf2) => {
            gltf2.scene.scale.set(0.04, 0.04, 0.04);
            gltf2.scene.rotateY(Math.PI/2);
            gltf2.scene.position.set(-100,0,-250);
            this.add(gltf2.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Stand;
