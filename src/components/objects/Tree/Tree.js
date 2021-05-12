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
        loader.load(MODEL, (gltf3) => {
            gltf3.scene.scale.set(12, 12, 12);
            gltf3.scene.rotateY(3*Math.PI/2);
            gltf3.scene.position.set(300,0,200);
            this.add(gltf3.scene);
        });
        loader.load(MODEL, (gltf4) => {
            gltf4.scene.scale.set(12, 12, 12);
            gltf4.scene.rotateY(3*Math.PI/2);
            gltf4.scene.position.set(300,0,300);
            this.add(gltf4.scene);
        });
        loader.load(MODEL, (gltf5) => {
            gltf5.scene.scale.set(12, 12, 12);
            gltf5.scene.rotateY(Math.PI/2);
            gltf5.scene.position.set(300,0,-100);
            this.add(gltf5.scene);
        });
        loader.load(MODEL, (gltf6) => {
            gltf6.scene.scale.set(12, 12, 12);
            gltf6.scene.rotateY(Math.PI);
            gltf6.scene.position.set(300,0,-200);
            this.add(gltf6.scene);
        });
        loader.load(MODEL, (gltf7) => {
            gltf7.scene.scale.set(12, 12, 12);
            gltf7.scene.rotateY(3*Math.PI/2);
            gltf7.scene.position.set(300,0,-300);
            this.add(gltf7.scene);
        });
        loader.load(MODEL, (gltf8) => {
            gltf8.scene.scale.set(12, 12, 12);
            gltf8.scene.rotateY(3*Math.PI/2);
            gltf8.scene.position.set(300,0,-400);
            this.add(gltf8.scene);
        });
        loader.load(MODEL, (gltf9) => {
            gltf9.scene.scale.set(12, 12, 12);
            gltf9.scene.rotateY(3*Math.PI/2);
            gltf9.scene.position.set(300,0,-500);
            this.add(gltf9.scene);
        });


        loader.load(MODEL, (gltf1) => {
            gltf1.scene.scale.set(12, 12, 12);
            gltf1.scene.rotateY(Math.PI/2);
            gltf1.scene.position.set(400,0,0);
            this.add(gltf1.scene);
        });
        loader.load(MODEL, (gltf12) => {
            gltf12.scene.scale.set(12, 12, 12);
            gltf12.scene.rotateY(Math.PI);
            gltf12.scene.position.set(400,0,100);
            this.add(gltf12.scene);
        });
        loader.load(MODEL, (gltf13) => {
            gltf13.scene.scale.set(12, 12, 12);
            gltf13.scene.rotateY(3*Math.PI/2);
            gltf13.scene.position.set(400,0,200);
            this.add(gltf13.scene);
        });
        loader.load(MODEL, (gltf14) => {
            gltf14.scene.scale.set(12, 12, 12);
            gltf14.scene.rotateY(3*Math.PI/2);
            gltf14.scene.position.set(400,0,300);
            this.add(gltf14.scene);
        });
        loader.load(MODEL, (gltf15) => {
            gltf15.scene.scale.set(12, 12, 12);
            gltf15.scene.rotateY(Math.PI/2);
            gltf15.scene.position.set(400,0,-100);
            this.add(gltf15.scene);
        });
        loader.load(MODEL, (gltf16) => {
            gltf16.scene.scale.set(12, 12, 12);
            gltf16.scene.rotateY(Math.PI);
            gltf16.scene.position.set(400,0,-200);
            this.add(gltf16.scene);
        });
        loader.load(MODEL, (gltf17) => {
            gltf17.scene.scale.set(12, 12, 12);
            gltf17.scene.rotateY(3*Math.PI/2);
            gltf17.scene.position.set(400,0,-300);
            this.add(gltf17.scene);
        });
        loader.load(MODEL, (gltf18) => {
            gltf18.scene.scale.set(12, 12, 12);
            gltf18.scene.rotateY(3*Math.PI/2);
            gltf18.scene.position.set(400,0,-400);
            this.add(gltf18.scene);
        });
        loader.load(MODEL, (gltf19) => {
            gltf19.scene.scale.set(12, 12, 12);
            gltf19.scene.rotateY(3*Math.PI/2);
            gltf19.scene.position.set(400,0,-500);
            this.add(gltf19.scene);
        });
    }
    update(timeStamp) {
        console.log('hi');
    }
}

export default Tree;
