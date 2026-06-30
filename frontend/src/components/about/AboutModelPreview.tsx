import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function AboutModelPreview() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f6f9ff');

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(8.5, 4.2, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Allow user to click and rotate
    controls.enableRotate = true;

    // Disable zoom for preview
    controls.enableZoom = false;

    // Disable dragging/panning
    controls.enablePan = false;
    controls.screenSpacePanning = false;

    // Disable vertical Y-axis rotation.
    // User can rotate left/right only.
    const fixedPolarAngle = THREE.MathUtils.degToRad(64);
    controls.minPolarAngle = fixedPolarAngle;
    controls.maxPolarAngle = fixedPolarAngle;

    controls.target.set(0, 1.35, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 3.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#b9ddff', 1.9);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 1.6);
    rimLight.position.set(0, 5, -7);
    scene.add(rimLight);

    const floorGeometry = new THREE.CircleGeometry(13, 96);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.45,
      metalness: 0,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.04;
    scene.add(floor);

    const loader = new GLTFLoader();

    let model: THREE.Group | null = null;
    let isHovering = false;
    let isDragging = false;
    let animationFrame = 0;

    const onPointerEnter = () => {
      isHovering = true;
      container.classList.add('about-model-preview__canvas--hovering');
    };

    const onPointerLeave = () => {
      isHovering = false;
      isDragging = false;
      container.classList.remove('about-model-preview__canvas--hovering');
      container.classList.remove('about-model-preview__canvas--dragging');
    };

    const onPointerDown = () => {
      isDragging = true;
      container.classList.add('about-model-preview__canvas--dragging');
    };

    const onPointerUp = () => {
      isDragging = false;
      container.classList.remove('about-model-preview__canvas--dragging');
    };

    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    loader.load(
      '/models/industrial-offset-printer.glb',
      (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();

        box.getCenter(center);
        box.getSize(size);

        model.position.sub(center);

        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 8.8 / maxSize;

        model.scale.setScalar(scale);
        model.position.y = 0;

        scene.add(model);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('GLB model loading failed:', error);
        setIsLoading(false);
        setHasError(true);
      }
    );

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      // Hover preview rotation only.
      // Dragging still works with mouse/touch.
      if (model && isHovering && !isDragging) {
        model.rotation.y += 0.004;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerup', onPointerUp);

      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerDown);

      controls.dispose();

      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }

      floorGeometry.dispose();
      floorMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="about-model-preview">
      <div className="about-model-preview__content">
        <span>3D Model Preview</span>

        <h2>Test the printer model.</h2>

        <p>
          Hover to auto-rotate. Click and drag to observe the model from left and
          right. Vertical Y-axis movement is disabled for this preview.
        </p>
      </div>

      <div className="about-model-preview__viewer">
        {isLoading && (
          <div className="about-model-preview__status">
            Loading 3D model...
          </div>
        )}

        {hasError && (
          <div className="about-model-preview__status about-model-preview__status--error">
            Model could not be loaded. Check the GLB file path.
          </div>
        )}

        <div ref={containerRef} className="about-model-preview__canvas" />
      </div>
    </section>
  );
}