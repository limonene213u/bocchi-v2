import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRMLoaderPlugin, VRMUtils, VRMExpressionPresetName } from '@pixiv/three-vrm';
import { VRMAnimationLoaderPlugin, createVRMAnimationClip } from '@pixiv/three-vrm-animation';

// シーンの作成
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); 
document.body.appendChild(renderer.domElement);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.0, 0.0);
controls.update();

// Light
const light = new THREE.DirectionalLight(0xffffff, Math.PI);
light.position.set(1.0, 1.0, 1.0).normalize();
scene.add(light);

let vrm;
let clock = new THREE.Clock();
let mixer;

// **GLTFLoaderを統一**
const loader = new GLTFLoader();
loader.register((parser) => new VRMLoaderPlugin(parser));
loader.register((parser) => new VRMAnimationLoaderPlugin(parser));

loader.load('/bocchi-v2-00.vrm', (gltf) => {
  vrm = gltf.userData.vrm;
  VRMUtils.rotateVRM0(vrm);
  scene.add(vrm.scene);
  
  // 表情設定
  vrm.expressionManager.setValue(VRMExpressionPresetName.Happy, 0.5);
  vrm.expressionManager.setValue(VRMExpressionPresetName.Aa, 0.2);
  vrm.expressionManager.setValue(VRMExpressionPresetName.Ee, 0.5);
  console.log("表情リスト:", vrm.expressionManager.expressionMap);

  // 口形状プリセット配列（既存の表情設定の下に追加）
const mouthExpressions = [
    VRMExpressionPresetName.Ih,  // 「し」
    VRMExpressionPresetName.Aa,  // 「か」
    VRMExpressionPresetName.Ou,  // 「の」
    VRMExpressionPresetName.Ee,  // 「こ」
    VRMExpressionPresetName.Ou,  // 「の」
    VRMExpressionPresetName.Ee,  // 「こ」
    VRMExpressionPresetName.Aa,  // 「の」
    VRMExpressionPresetName.Ou,  // 「こ」
    VRMExpressionPresetName.Ee,  // 「し」
    VRMExpressionPresetName.Aa,  // 「た」
    VRMExpressionPresetName.Nn   // 「ん」
];

let lipSyncIndex = 0;
let lipSyncInterval;

  //自動まばたき
  function startBlinking() {
    setInterval(() => {
      if (vrm) {
        // まばたき開始
        vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0.8);
        vrm.expressionManager.update();
  
        // まばたき終了（0.1秒後に目を開ける）
        setTimeout(() => {
          vrm.expressionManager.setValue(VRMExpressionPresetName.Blink, 0.0);
          vrm.expressionManager.update();
        }, 80);
      }
    }, 3000 + Math.random() * 2000); // 3秒〜5秒のランダム間隔でまばたき
  }

  function startLipSync() {
    lipSyncInterval = setInterval(() => {
        if (!vrm) return;

        // 既存表情を保持しつつ口形状のみ更新
        const currentExpression = mouthExpressions[lipSyncIndex];
        vrm.expressionManager.setValue(currentExpression, 0.4);
        
        // 0.1秒後にリセット
        setTimeout(() => {
            vrm.expressionManager.setValue(currentExpression, 0.0);
        }, 200);

        lipSyncIndex = (lipSyncIndex + 1) % mouthExpressions.length;
    }, 300);
}

  // **VRMAのロード（同じloaderを使用する）**
  loader.load('/vrma/noko.vrma', (animGltf) => {
    if (!animGltf.userData.vrmAnimations || animGltf.userData.vrmAnimations.length === 0) {
      console.error('VRMAデータが正しくありません');
      return;
    }

    const vrmAnimation = animGltf.userData.vrmAnimations[0];
    console.log("VRMAのデータ構造:", animGltf.userData);
    console.log("表情アニメーション:", vrmAnimation.expressionTracks);

    // `vrmMeta` の安全なチェック
    if (vrmAnimation.vrmMeta && vrmAnimation.vrmMeta.metaVersion) {
      console.log("VRMAの仕様バージョン:", vrmAnimation.vrmMeta.metaVersion);
    } else {
      console.warn("⚠ VRMAファイルに metaVersion がありません。仮のバージョンを設定します。");
      vrmAnimation.vrmMeta = { metaVersion: "1.0" }; // 仮のバージョンを設定
    }

    try {
      // **VRMAのアニメーションを適用**
      const clip = createVRMAnimationClip(vrmAnimation, vrm); // 最新仕様に合わせた引数順に修正
      mixer = new THREE.AnimationMixer(vrm.scene);
      const action = mixer.clipAction(clip);
      action.play();
    } catch (error) {
      console.error("VRMアニメーションの適用に失敗しました:", error);
    }
  });

  // **まばたき開始**
  startBlinking();
  startLipSync();  // リップシンク開始

  animate();
});

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta();
  
  if (vrm) {
    vrm.update(deltaTime); 
  }

  if (mixer) {
    mixer.update(deltaTime);
  }

  renderer.render(scene, camera);
}
