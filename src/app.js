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
  document.getElementById("finish-screen").style.display = 'none';

  const scene = new SeedScene(endGame);

  const renderer = new WebGLRenderer({ antialias: true });

// Set up camera and position it in the scene 
  const camera = new PerspectiveCamera();
  camera.position.set(0, 400, 300);
  camera.lookAt(new Vector3(0, 0, -10));
  console.log(camera.position);

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

  
// Key press handler 
  const onKeyDown = (keyEvent) => {
    const turningMoves = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'ArrowDown', 'ArrowUp'];
    if (turningMoves.includes(keyEvent.code)) {
      scene.keyUpdate && scene.keyUpdate(keyEvent.code, true);
    }
  };

  // Key release handler 
  const onKeyUp = (keyEvent) => {
    const turningMoves = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'ArrowDown', 'ArrowUp'];
    if (turningMoves.includes(keyEvent.code)) {
      scene.keyUpdate && scene.keyUpdate(keyEvent.code, false);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
};

const endGame = (loserId, red, blue) => {
  const winnerId = loserId == 1 ? 2 : 1;
  document.querySelector('canvas').remove();
  document.getElementById('menu-screen').style.display = 'none';
  document.getElementById('finish-screen').style.display = 'flex';
  document.getElementById('winnerText').style.fontSize = '60px';
  document.getElementById('winnerText').style.textShadow = '3px 1px grey';
  document.getElementById('winnerText').style.lineHeight = "10px";
  document.getElementById('winnerText').innerText = 'Player ' + winnerId + ' wins!';
  document.getElementById('score').style.fontSize = '60px';
  document.getElementById('score').style.color= 'rgb(0, 255, 255)';
  document.getElementById('score').style.lineHeight = "10px";
  document.getElementById('score').style.textShadow = '3px 1px grey';
  document.getElementById('score').innerText = red + ' - ' + blue;
}
