import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Road extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(1, 1, 1);
            //gltf.scene.rotateY(Math.PI/2);
            gltf.scene.position.set(350,6,0);
            this.add(gltf.scene);
        });
        loader.load(MODEL, (gltf2) => {
            gltf2.scene.scale.set(1, 1, 1);
            //gltf2.scene.rotateY(Math.PI/2);
            gltf2.scene.position.set(350,6,120);
            this.add(gltf2.scene);
        });
        loader.load(MODEL, (gltf3) => {
            gltf3.scene.scale.set(1, 1, 1);
            //gltf2.scene.rotateY(Math.PI/2);
            gltf3.scene.position.set(350,6,-120);
            this.add(gltf3.scene);
        });
        loader.load(MODEL, (gltf4) => {
            gltf4.scene.scale.set(1, 1, 1);
            //gltf2.scene.rotateY(Math.PI/2);
            gltf4.scene.position.set(350,6,-240);
            this.add(gltf4.scene);
        });
        loader.load(MODEL, (gltf5) => {
            gltf5.scene.scale.set(1, 1, 1);
            //gltf2.scene.rotateY(Math.PI/2);
            gltf5.scene.position.set(350,6,-360);
            this.add(gltf5.scene);
        });
        loader.load(MODEL, (gltf6) => {
            gltf6.scene.scale.set(1, 1, 1);
            //gltf2.scene.rotateY(Math.PI/2);
            gltf6.scene.position.set(350,6,-480);
            this.add(gltf6.scene);
        });

    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Road;
