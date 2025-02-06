// cameraControls.js
import * as gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// プライベート変数
let _camera, _controls, _modelCenter = new THREE.Vector3();
let _cameraVelocity = new THREE.Vector3();
let _shakeIntensity = 0;
const _focusPoints = [];

export class CameraController {
  static initialize(scene, renderer, model) {
    // カメラとコントロールの初期化
    _camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    _controls = new OrbitControls(_camera, renderer.domElement);
    _controls.enableDamping = true;
    _controls.dampingFactor = 0.05;

    // モデル中心点の計算
    this.calculateModelCenter(model);
    
    // 初期視点設定
    _camera.position.copy(_modelCenter).add(new THREE.Vector3(0, 1.5, 3));
    _controls.target.copy(_modelCenter);
    _controls.update();

    // フォーカスポイントの生成
    this.generateFocusPoints();

    return { camera: _camera, controls: _controls };
  }

  static calculateModelCenter(model) {
    const bbox = new THREE.Box3().setFromObject(model);
    _modelCenter = bbox.getCenter(new THREE.Vector3());
  }

  static generateFocusPoints() {
    _focusPoints.length = 0;
    _focusPoints.push(
      { 
        position: new THREE.Vector3().copy(_modelCenter).add(new THREE.Vector3(0, 1.5, 3)), 
        target: _modelCenter.clone() 
      },
      {
        position: new THREE.Vector3().copy(_modelCenter).add(new THREE.Vector3(-2, 2.5, 1)),
        target: _modelCenter.clone().add(new THREE.Vector3(0.5, 0.2, -0.5))
      },
      {
        position: new THREE.Vector3().copy(_modelCenter).add(new THREE.Vector3(1.5, 1.0, 2)),
        target: _modelCenter.clone().add(new THREE.Vector3(-0.3, 0.1, 0.2))
      }
    );
  }

  static startCameraAnimations() {
    // ドリーズーム
    setInterval(() => this.randomDollyZoom(), 10000);
    
    // フォーカスシフト
    setInterval(() => this.changeViewpoint(), 15000);
    
    // ランダムシェイク
    setInterval(() => {
      if (Math.random() < 0.3) this.applyCameraShake(0.1);
    }, 8000);
  }

  static randomDollyZoom() {
    const spherical = new THREE.Spherical()
      .setFromVector3(_camera.position.clone().sub(_modelCenter))
      .makeSafe();

    spherical.radius *= 0.5 + Math.random();
    spherical.theta += (Math.random() - 0.5) * Math.PI * 0.5;
    spherical.phi = THREE.MathUtils.clamp(
      spherical.phi + (Math.random() - 0.5) * Math.PI * 0.2,
      Math.PI * 0.1,
      Math.PI * 0.9
    );

    const newPosition = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(_modelCenter);

    _controls.enabled = false;
    gsap.to(_camera.position, {
      ...newPosition,
      duration: 2.5,
      ease: "power2.inOut",
      onComplete: () => _controls.enabled = true,
      onUpdate: () => _controls.update()
    });
  }

  static changeViewpoint() {
    const { position, target } = _focusPoints[Math.floor(Math.random() * _focusPoints.length)];
    
    _controls.enabled = false;
    gsap.to(_camera.position, {
      ...position,
      duration: 2,
      ease: "sine.inOut",
      onComplete: () => _controls.enabled = true,
      onUpdate: () => _controls.update()
    });

    gsap.to(_controls.target, {
      ...target,
      duration: 2,
      ease: "sine.inOut"
    });
  }

  static applyCameraShake(intensity = 0.05) {
    _shakeIntensity = intensity;
  }

  static updateCameraMotion() {
    // 物理ベースモーション
    const direction = new THREE.Vector3(
      Math.sin(performance.now() * 0.001),
      Math.cos(performance.now() * 0.002),
      Math.sin(performance.now() * 0.0015)
    ).normalize();

    _cameraVelocity.add(direction.multiplyScalar(0.002));
    _cameraVelocity.multiplyScalar(0.98);
    _camera.position.add(_cameraVelocity);
    _controls.target.add(_cameraVelocity.multiplyScalar(0.3));

    // シェイク処理
    if (_shakeIntensity > 0) {
      const shake = new THREE.Vector3(
        (Math.random() - 0.5) * _shakeIntensity,
        (Math.random() - 0.5) * _shakeIntensity,
        (Math.random() - 0.5) * _shakeIntensity
      );
      _camera.position.add(shake);
      _controls.target.add(shake);
      _shakeIntensity *= 0.85;
    }

    _controls.update();
  }
}
