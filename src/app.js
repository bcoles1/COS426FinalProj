/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
//How to get the start screen?
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    MeshPhongMaterial,
    Mesh,
    FontLoader,
    TextGeometry,
    Vector2
  } from 'three';
  import {
    OrbitControls
  } from 'three/examples/jsm/controls/OrbitControls.js';
  import {
    SeedScene
  } from 'scenes';
  import {
    EffectComposer
  } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import {
    UnrealBloomPass
  } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import {
    RenderPass
  } from 'three/examples/jsm/postprocessing/RenderPass.js';
console.log(document);


document.getElementById('startButton').addEventListener('click', () => initGame());
document.getElementById('replayButton').addEventListener('click', () => initGame());

// Initialize core ThreeJS components
//const initGame = () => {

const initGame = () => {
  console.log("We started the game");
  document.getElementById("menu-screen").style.display = 'none';

  const scene = new SeedScene(endGame);


  const renderer = new WebGLRenderer({ antialias: true });

  const camera = new PerspectiveCamera();
  camera.position.set(340, 300, -10);
  camera.lookAt(new Vector3(0, 0, 0));
  console.log(camera.position)

// Set up renderer, canvas, and minor CSS adjustments
  renderer.setPixelRatio(window.devicePixelRatio);
  const canvas = renderer.domElement;
  canvas.style.display = 'block'; // Removes padding below canvas
  document.body.style.margin = 0; // Removes margin around page
  document.body.style.overflow = 'hidden'; // Fix scrolling
  document.body.appendChild(canvas);

// Set up controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 4;
//controls.maxDistance = 16;
  controls.update();

// Render loop
  const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    if(!scene.state.gameOver) {
      window.requestAnimationFrame(onAnimationFrameHandler);
    }
  };
  window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
  const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  windowResizeHandler();
  window.addEventListener('resize', windowResizeHandler, false);

  

  const onKeyDown = (keyEvent) => {
    const turningMoves = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'ArrowDown', 'ArrowUp'];
    if (turningMoves.includes(keyEvent.code)) {
      scene.keyUpdate && scene.keyUpdate(keyEvent.code, true);
    }
  };

  const onKeyUp = (keyEvent) => {
    const turningMoves = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'ArrowDown', 'ArrowUp'];
    if (turningMoves.includes(keyEvent.code)) {
      scene.keyUpdate && scene.keyUpdate(keyEvent.code, false);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
};

const endGame = (loserId) => {
  const winnerId = loserId == 1 ? 2 : 1;
  document.querySelector('canvas').remove();
  document.getElementById('finish-screen').style.display = 'flex';
  document.getElementById('winnerText').innerText = 'Player ' + winnerId + ' wins!';
}
