import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MODEL_PATH = '/models/industrial-offset-printer.glb';

export default function AboutMachineModel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRendering, setShowRendering] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const getResponsiveSettings = () => {
      const width = container.clientWidth;

      if (width <= 560) {
        return {
          cameraPosition: new THREE.Vector3(6.4, 3.4, 7.2),
          modelSize: 10.6,
          minDistance: 4.8,
          maxDistance: 13.5,
          polarAngle: 64,
        };
      }

      if (width <= 1024) {
        return {
          cameraPosition: new THREE.Vector3(7.2, 3.8, 8.1),
          modelSize: 11.2,
          minDistance: 5.2,
          maxDistance: 15,
          polarAngle: 63,
        };
      }

      return {
        cameraPosition: new THREE.Vector3(7.6, 3.9, 8.4),
        modelSize: 12.1,
        minDistance: 5,
        maxDistance: 16,
        polarAngle: 62,
      };
    };

    const responsive = getResponsiveSettings();

    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.copy(responsive.cameraPosition);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.touchAction = 'none';

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.075;

    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.screenSpacePanning = false;

    controls.zoomSpeed = 0.82;
    controls.rotateSpeed = 0.72;

    controls.minDistance = responsive.minDistance;
    controls.maxDistance = responsive.maxDistance;

    const fixedPolarAngle = THREE.MathUtils.degToRad(responsive.polarAngle);
    controls.minPolarAngle = fixedPolarAngle;
    controls.maxPolarAngle = fixedPolarAngle;

    controls.target.set(0, 1.18, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#ffffff', 4.2);
    keyLight.position.set(5.5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight('#b8dcff', 2.4);
    fillLight.position.set(-6.5, 4.5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight('#ffffff', 2.2);
    rimLight.position.set(0, 5.5, -7);
    scene.add(rimLight);

    const cyanAccent = new THREE.PointLight('#00aeef', 2.8, 14);
    cyanAccent.position.set(-4, 2.8, 3.6);
    scene.add(cyanAccent);

    const purpleAccent = new THREE.PointLight('#7c3aed', 2.4, 14);
    purpleAccent.position.set(4.6, 2.4, -3.5);
    scene.add(purpleAccent);

    const floorGeometry = new THREE.CircleGeometry(14, 128);
    const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#aeb9c7',
    roughness: 0.48,
    metalness: 0,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    scene.add(floor);

    const loader = new GLTFLoader();

    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let isHovering = false;
    let isDragging = false;
    let animationFrame = 0;

    const stopPageScroll = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const stopTouchScroll = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onPointerEnter = () => {
      isHovering = true;
      container.classList.add('about-machine-model__canvas--hovering');
    };

    const onPointerLeave = () => {
      isHovering = false;
      isDragging = false;
      container.classList.remove('about-machine-model__canvas--hovering');
      container.classList.remove('about-machine-model__canvas--dragging');
    };

    const onPointerDown = () => {
      isDragging = true;
      container.classList.add('about-machine-model__canvas--dragging');
    };

    const onPointerUp = () => {
      isDragging = false;
      container.classList.remove('about-machine-model__canvas--dragging');
    };

    container.addEventListener('pointerenter', onPointerEnter);
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('wheel', stopPageScroll, { passive: false });
    container.addEventListener('touchmove', stopTouchScroll, { passive: false });

    renderer.domElement.addEventListener('wheel', stopPageScroll, {
      passive: false,
    });

    window.addEventListener('pointerup', onPointerUp);

    loader.load(
      MODEL_PATH,
      (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    child.castShadow = true;
    child.receiveShadow = true;

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        material.needsUpdate = true;
      });
    } else if (child.material) {
      child.material.needsUpdate = true;
    }

    const lowerName = child.name.toLowerCase();

    /* CHANGE THE STAGE / FLOOR UNDER THE MACHINE */
    if (
      lowerName.includes('floor') ||
      lowerName.includes('stage') ||
      lowerName.includes('studio') ||
      lowerName.includes('platform') ||
      lowerName.includes('ground')
    ) {
      const applyStageLook = (material: THREE.Material) => {
        const standardMaterial = material as THREE.MeshStandardMaterial;

        if ('color' in standardMaterial) {
          standardMaterial.color = new THREE.Color('#383b3d');
        }

        if ('roughness' in standardMaterial) {
          standardMaterial.roughness = 0.5;
        }

        if ('metalness' in standardMaterial) {
          standardMaterial.metalness = 0.04;
        }

        standardMaterial.needsUpdate = true;
      };

      if (Array.isArray(child.material)) {
        child.material.forEach(applyStageLook);
      } else if (child.material) {
        applyStageLook(child.material);
      }
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
        const modelScale = responsive.modelSize / maxSize;

        model.scale.setScalar(modelScale);
        model.position.y = 0.03;

        scene.add(model);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);

          gltf.animations.forEach((clip) => {
            const action = mixer?.clipAction(clip);
            action?.reset();
            action?.setLoop(THREE.LoopRepeat, Infinity);
            action?.play();
          });
        }

        setIsLoading(false);

        window.setTimeout(() => {
          setShowRendering(false);
        }, 2000);
      },
      undefined,
      (error) => {
        console.error('GLB model loading failed:', error);
        setIsLoading(false);
        setHasError(true);
      }
    );

    const handleResize = () => {
      const nextResponsive = getResponsiveSettings();

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.copy(nextResponsive.cameraPosition);
      camera.updateProjectionMatrix();

      controls.minDistance = nextResponsive.minDistance;
      controls.maxDistance = nextResponsive.maxDistance;

      const nextPolarAngle = THREE.MathUtils.degToRad(
        nextResponsive.polarAngle
      );

      controls.minPolarAngle = nextPolarAngle;
      controls.maxPolarAngle = nextPolarAngle;
      controls.target.set(0, 1.18, 0);
      controls.update();

      if (model) {
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxSize = Math.max(size.x, size.y, size.z);
        const currentScale = model.scale.x;
        const originalMaxSize = maxSize / currentScale;
        const newScale = nextResponsive.modelSize / originalMaxSize;

        model.scale.setScalar(newScale);
      }

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      if (model && isHovering && !isDragging) {
        model.rotation.y += 0.0016;
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
      container.removeEventListener('wheel', stopPageScroll);
      container.removeEventListener('touchmove', stopTouchScroll);

      renderer.domElement.removeEventListener('wheel', stopPageScroll);

      controls.dispose();

      if (mixer) {
        mixer.stopAllAction();
      }

      if (model) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });

        scene.remove(model);
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
    <section className="about-machine-model">
      <div className="about-machine-model__bg" />

      <div className="about-machine-model__header" data-reveal>
        <span>Interactive 3D Technology</span>

        <h2>
          Explore the printing
          <br />
          engine behind NAPCO.
        </h2>

        <p>
          Hover, drag and zoom to observe the industrial press from every premium
          angle.
        </p>
      </div>

      <div className="about-machine-model__stage" data-reveal>
        <div className="about-machine-model__guide">
          <div className="about-machine-model__mouse">
            <span />
          </div>

          <div>
            <strong>Drag to rotate</strong>
            <small>Scroll or pinch to zoom</small>
          </div>
        </div>

        {(isLoading || showRendering || hasError) && (
          <div
            className={`about-machine-model__rendering ${
              hasError ? 'about-machine-model__rendering--error' : ''
            }`}
          >
            {!hasError && (
              <>
                <div className="about-machine-model__render-ring">
                  <span />
                </div>

                <strong>Model Rendering</strong>
                <small>Preparing interactive 3D view</small>
              </>
            )}

            {hasError && (
              <>
                <strong>Model failed to load</strong>
                <small>Check the GLB file path in public/models.</small>
              </>
            )}
          </div>
        )}

        <div ref={containerRef} className="about-machine-model__canvas" />
      </div>

      <div className="about-machine-model__description" data-reveal>
        <span>Machine Capability</span>

        <p>
          This 3D press represents NAPCO’s production strength in web printing,
          sheet-fed offset printing and finishing. The company combines modern
          machinery, qualified personnel and specialist finishing services such
          as UV varnishing, gold foiling, laminating, hard case binding, perfect
          binding, wire binding, spiral binding and shrink wrapping.
        </p>

        <div className="about-machine-model__facts">
          <div>
            <strong>Web &amp; Sheet-fed</strong>
            <small>Large-scale printing capacity</small>
          </div>

          <div>
            <strong>Finishing Lines</strong>
            <small>Binding, varnishing and packaging support</small>
          </div>

          <div>
            <strong>35,000 A4 Books</strong>
            <small>Daily perfect-bound or wire-stitched capacity</small>
          </div>
        </div>
      </div>
    </section>
  );
}