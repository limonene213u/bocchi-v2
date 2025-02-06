import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';
import { CameraController } from './cameraControls.js';

// シーン初期化
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  precision: 'highp'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

// ライト設定
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(1, 3, 2).normalize();
scene.add(directionalLight);

// VRMローダー設定
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));
loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

// アニメーション用変数
let vrm, mixer, clock = new THREE.Clock();
let lipSyncIndex = 0, lipSyncInterval;

// VRM読み込み処理
loader.load('/bocchi-v2-00_g.vrm', async (gltf) => {
  try {
    vrm = gltf.userData.vrm;
    VRMUtils.rotateVRM0(vrm);
    scene.add(vrm.scene);

    // カメラコントローラー初期化（モデル読み込み後）
    const { camera, controls } = CameraController.initialize(
      scene,
      renderer,
      vrm.scene  // モデルを直接渡す
    );

    // 表情初期設定
    initExpressions(vrm);
    initLipSync(vrm);
    initBlink(vrm);

    // アニメーションクリップ読み込み
    await loadVRMAnimation('/vrma/noko.vrma', vrm);

    // カメラアニメーション開始
    CameraController.startCameraAnimations();

    // アニメーションループ開始
    animate(renderer, camera, controls);

  } catch (error) {
    console.error('初期化エラー:', error);
  }
});

// 表情管理関数
function initExpressions(vrm) {
  vrm.expressionManager.setValue(VRMExpressionPresetName.Happy, 0.5);
  vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0.2);
  vrm.expressionManager.setValue(VRMExpressionPresetName.Ee, 0.5);
  console.log("利用可能な表情:", Object.keys(vrm.expressionManager.expressionMap));
}

// リップシンク設定
function initLipSync(vrm) {
  const mouthExpressions = [
    VRMExpressionPresetName.Ih, VRMExpressionPresetName.Aa,
    VRMExpressionPresetName.Ou, VRMExpressionPresetName.Ee,
    VRMExpressionPresetName.Ou, VRMExpressionPresetName.Ee,
    VRMExpressionPresetName.Aa, VRMExpressionPresetName.Ou,
    VRMExpressionPresetName.Ee, VRMExpressionPresetName.Aa,
    VRMExpressionPresetName.Nn
  ];

  lipSyncInterval = setInterval(() => {
    const current = mouthExpressions[lipSyncIndex];
    vrm.expressionManager.setValue(current, 0.4);
    
    setTimeout(() => {
      vrm.expressionManager.setValue(current, 0.0);
    }, 200);

    lipSyncIndex = (lipSyncIndex + 1) % mouthExpressions.length;
  }, 300);
}

// 自動まばたき設定
function initBlink(vrm) {
  setInterval(() => {
    vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0.8);
    vrm.expressionManager.update();

    setTimeout(() => {
      vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0.0);
      vrm.expressionManager.update();
    }, 80);
  }, 3000 + Math.random() * 2000);
}

// VRMアニメーション読み込み
async function loadVRMAnimation(url, vrm) {
  try {
    const animGltf = await loader.loadAsync(url);
    if (!animGltf.userData.vrmAnimations?.[0]) {
      throw new Error('無効なVRMAファイル');
    }

    const clip = createVRMAnimationClip(
      animGltf.userData.vrmAnimations[0],
      vrm
    );

    mixer = new THREE.AnimationMixer(vrm.scene);
    mixer.clipAction(clip).play();

  } catch (error) {
    console.error('アニメーション読み込みエラー:', error);
  }
}

// アニメーションループ
function animate(renderer, camera, controls) {
  requestAnimationFrame(() => animate(renderer, camera, controls));
  const delta = clock.getDelta();

  // VRM更新
  if (vrm) vrm.update(delta);
  if (mixer) mixer.update(delta);

  // カメラ更新
  CameraController.updateCameraMotion();

  // レンダリング
  renderer.render(scene, camera);
}

// ウィンドウリサイズ処理
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
