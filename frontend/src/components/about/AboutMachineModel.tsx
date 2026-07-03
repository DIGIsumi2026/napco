import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

gsap.registerPlugin(ScrollTrigger);

const MODEL_PATH = '/models/industrial-offset-printer.glb';

const qualityFacts = [
  {
    eyebrow: 'Technology',
    title: 'State of the art machinery',
    description:
      'Modern machinery, technology, accessories and qualified press personnel support demanding print requirements.',
    rotationY: -0.72,
  },
  {
    eyebrow: 'Capacity',
    title: 'Web, sheet-fed and finishing strength',
    description:
      'NAPCO is equipped for web printing, sheet-fed offset printing and finishing workflows at large production scale.',
    rotationY: 0.06,
  },
  {
    eyebrow: 'Finishing',
    title: 'Premium finishing services',
    description:
      'UV varnishing, gold foiling, laminating, hard case binding, perfect binding, wire binding and spiral binding support high-quality final output.',
    rotationY: 0.92,
  },
  {
    eyebrow: 'Output',
    title: '35,000 A4 books per day',
    description:
      'The production setup can deliver 35,000 A4 perfect-bound or wire-stitched books per day with finishing options.',
    rotationY: 1.5,
  },
];

type ResponsiveSettings = {
  cameraPosition: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  polarAngle: number;
  viewportFill: number;
};

type StoryState = {
  activeFact: number;
  isObserverMode: boolean;
};

const INTRO_ROTATION_Y = -0.92;
const FACT_PULSE_ZOOM = 1.62;
const FACT_SETTLE_ZOOM = 1.44;
const OBSERVER_ZOOM = 1.1;

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

function disposeModel(root: THREE.Object3D) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();

      if (child.material) {
        disposeMaterial(child.material);
      }
    }
  });
}

function isStageLikeName(name: string) {
  const lower = name.toLowerCase();

  return (
    lower.includes('floor') ||
    lower.includes('stage') ||
    lower.includes('studio') ||
    lower.includes('platform') ||
    lower.includes('ground') ||
    lower.includes('white_studio_floor')
  );
}

function getRelevantBounds(root: THREE.Object3D) {
  const bounds = new THREE.Box3();
  let hasRelevantMesh = false;

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const meshName = child.name.toLowerCase();

    let skip = isStageLikeName(meshName);

    if (!skip) {
      const materials = Array.isArray(child.material)
        ? child.material
        : child.material
          ? [child.material]
          : [];

      skip = materials.some((material) => isStageLikeName(material.name || ''));
    }

    if (skip) return;

    child.geometry.computeBoundingBox();

    const geometryBox = child.geometry.boundingBox?.clone();
    if (!geometryBox) return;

    const worldBox = geometryBox.applyMatrix4(child.matrixWorld);

    if (!hasRelevantMesh) {
      bounds.copy(worldBox);
      hasRelevantMesh = true;
    } else {
      bounds.union(worldBox);
    }
  });

  if (!hasRelevantMesh) {
    bounds.setFromObject(root);
  }

  return bounds;
}

function computeFitScale(
  boundsSize: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  viewportFill: number
) {
  const distance = camera.position.distanceTo(target);
  const vFov = THREE.MathUtils.degToRad(camera.fov);

  const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
  const visibleWidth = visibleHeight * camera.aspect;

  const widthScale = (visibleWidth * viewportFill) / boundsSize.x;
  const heightScale = (visibleHeight * (viewportFill * 0.68)) / boundsSize.y;
  const depthScale = (visibleWidth * (viewportFill * 0.58)) / boundsSize.z;

  return Math.min(widthScale, heightScale, depthScale);
}

export default function AboutMachineModel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const guideRef = useRef<HTMLDivElement | null>(null);
  const observerModeRef = useRef<HTMLDivElement | null>(null);

  const factRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showRendering, setShowRendering] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isHeaderReady = hasError || (!isLoading && !showRendering);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const container = containerRef.current;
    const scrollHint = scrollHintRef.current;
    const guide = guideRef.current;
    const observerMode = observerModeRef.current;

    if (!section || !sticky || !container || !scrollHint || !guide || !observerMode) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = null;

    const getResponsiveSettings = (): ResponsiveSettings => {
      const width = container.clientWidth;

      if (width <= 560) {
        return {
          cameraPosition: new THREE.Vector3(8.2, 4.4, 10.4),
          minDistance: 5.1,
          maxDistance: 14,
          polarAngle: 63,
          viewportFill: 0.64,
        };
      }

      if (width <= 1024) {
        return {
          cameraPosition: new THREE.Vector3(9.8, 5.2, 12),
          minDistance: 5.6,
          maxDistance: 15.5,
          polarAngle: 62,
          viewportFill: 0.69,
        };
      }

      return {
        cameraPosition: new THREE.Vector3(11.8, 6.2, 14),
        minDistance: 6.2,
        maxDistance: 18,
        polarAngle: 61,
        viewportFill: 0.7,
      };
    };

    let responsive = getResponsiveSettings();

    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.copy(responsive.cameraPosition);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const orbitTarget = new THREE.Vector3(0, 1.22, 0);

    const applyControlSettings = (settings: ResponsiveSettings) => {
      const fixedPolarAngle = THREE.MathUtils.degToRad(settings.polarAngle);

      controls.minDistance = settings.minDistance;
      controls.maxDistance = settings.maxDistance;
      controls.minPolarAngle = fixedPolarAngle;
      controls.maxPolarAngle = fixedPolarAngle;
      controls.target.copy(orbitTarget);
      controls.update();
      controls.saveState();
    };

    controls.enabled = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.screenSpacePanning = false;
    controls.zoomSpeed = 0.82;
    controls.rotateSpeed = 0.72;

    applyControlSettings(responsive);

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.25);
    const keyLight = new THREE.DirectionalLight('#ffffff', 4.8);
    const fillLight = new THREE.DirectionalLight('#d3e6ff', 2.2);
    const rimLight = new THREE.DirectionalLight('#ffffff', 2.2);

    keyLight.position.set(5.5, 8, 6);
    keyLight.castShadow = true;

    fillLight.position.set(-6.5, 4.5, -5);
    rimLight.position.set(0, 5.5, -7);

    scene.add(ambientLight, keyLight, fillLight, rimLight);

    const floorGeometry = new THREE.CircleGeometry(16, 128);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#4e5a69',
      roughness: 0.62,
      metalness: 0,
      transparent: true,
      opacity: 0,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.08;
    scene.add(floor);

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();

    const storyState: StoryState = {
      activeFact: -3,
      isObserverMode: false,
    };

    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationFrame = 0;
    let renderTimer: number | undefined;
    let scrollTrigger: ScrollTrigger | null = null;
    let modelBaseScale = 1;
    let relevantBoundsSize = new THREE.Vector3(1, 1, 1);
    let isHovering = false;
    let isDragging = false;
    let hasUnmounted = false;
    let scaleTimeline: gsap.core.Timeline | null = null;

    const facts = factRefs.current.filter(
      (element): element is HTMLDivElement => Boolean(element)
    );

    const dots = dotRefs.current.filter(
      (element): element is HTMLSpanElement => Boolean(element)
    );

    const lines = lineRefs.current.filter(
      (element): element is HTMLSpanElement => Boolean(element)
    );

    const hideFactElements = (excludedIndex = -1) => {
      facts.forEach((fact, index) => {
        if (index === excludedIndex) return;

        gsap.to(fact, {
          autoAlpha: 0,
          y: 14,
          scale: 0.98,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: true,
        });
      });

      dots.forEach((dot, index) => {
        if (index === excludedIndex) return;

        gsap.to(dot, {
          autoAlpha: 0,
          scale: 0.72,
          duration: 0.16,
          ease: 'power2.out',
          overwrite: true,
        });
      });

      lines.forEach((line, index) => {
        if (index === excludedIndex) return;

        gsap.to(line, {
          autoAlpha: 0,
          scaleX: 0,
          duration: 0.16,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    };

    const setControlsEnabled = (enabled: boolean) => {
      controls.enabled = enabled;
      controls.enableZoom = enabled;

      container.classList.toggle('about-machine-model__canvas--interactive', enabled);

      if (!enabled) {
        isDragging = false;
        container.classList.remove('about-machine-model__canvas--dragging');
      }
    };

    const animateModelScale = (targetScale: number, withPulse: boolean) => {
      if (!model) return;

      scaleTimeline?.kill();
      gsap.killTweensOf(model.scale);

      if (!withPulse) {
        gsap.to(model.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.42,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        return;
      }

      scaleTimeline = gsap
        .timeline()
        .to(model.scale, {
          x: modelBaseScale * FACT_PULSE_ZOOM,
          y: modelBaseScale * FACT_PULSE_ZOOM,
          z: modelBaseScale * FACT_PULSE_ZOOM,
          duration: 0.46,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        .to(model.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.72,
          ease: 'power3.out',
          overwrite: 'auto',
        });
    };

    const activateFact = (index: number) => {
      if (!model || (storyState.activeFact === index && !storyState.isObserverMode)) {
        return;
      }

      storyState.activeFact = index;
      storyState.isObserverMode = false;

      setControlsEnabled(false);
      controls.reset();

      gsap.to(scrollHint, {
        autoAlpha: 0,
        y: 18,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to([observerMode, guide], {
        autoAlpha: 0,
        y: 14,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      });

      hideFactElements(index);

      const fact = facts[index];
      const dot = dots[index];
      const line = lines[index];

      if (fact) {
        gsap.to(fact, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: true,
        });
      }

      if (dot) {
        gsap.to(dot, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.24,
          ease: 'power3.out',
          overwrite: true,
        });
      }

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.28,
            ease: 'power3.out',
            overwrite: true,
          }
        );
      }

      gsap.killTweensOf(model.rotation);
      gsap.killTweensOf(model.scale);

      gsap.to(model.rotation, {
        y: qualityFacts[index].rotationY,
        duration: 0.74,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });

      animateModelScale(modelBaseScale * FACT_SETTLE_ZOOM, true);
    };

    const showIntro = () => {
      if (!model || (storyState.activeFact === -1 && !storyState.isObserverMode)) {
        return;
      }

      storyState.activeFact = -1;
      storyState.isObserverMode = false;

      setControlsEnabled(false);
      controls.reset();
      hideFactElements();

      gsap.to(scrollHint, {
        autoAlpha: 1,
        y: 0,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to([observerMode, guide], {
        autoAlpha: 0,
        y: 14,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to(model.rotation, {
        y: INTRO_ROTATION_Y,
        duration: 0.46,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      animateModelScale(modelBaseScale, false);
    };

    const unlockObserverMode = () => {
      if (!model || storyState.isObserverMode) {
        return;
      }

      storyState.activeFact = -1;
      storyState.isObserverMode = true;

      hideFactElements();
      setControlsEnabled(true);

      gsap.to(scrollHint, {
        autoAlpha: 0,
        y: 18,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to(observerMode, {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        ease: 'power3.out',
        overwrite: true,
      });

      gsap.to(guide, {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        delay: 0.03,
        ease: 'power3.out',
        overwrite: true,
      });

      animateModelScale(modelBaseScale * OBSERVER_ZOOM, false);
    };

    const getActiveFactFromProgress = (progress: number) => {
      if (progress >= 0.08 && progress < 0.27) return 0;
      if (progress >= 0.27 && progress < 0.46) return 1;
      if (progress >= 0.46 && progress < 0.65) return 2;
      if (progress >= 0.65 && progress < 0.84) return 3;

      return -1;
    };

    const updateStoryByProgress = (progress: number) => {
      if (progress >= 0.84) {
        unlockObserverMode();
        return;
      }

      const activeFact = getActiveFactFromProgress(progress);

      if (activeFact === -1) {
        showIntro();
        return;
      }

      activateFact(activeFact);
    };

    const buildScrollStory = () => {
      gsap.set(facts, {
        autoAlpha: 0,
        y: 18,
        scale: 0.98,
      });

      gsap.set(dots, {
        autoAlpha: 0,
        scale: 0.72,
      });

      gsap.set(lines, {
        autoAlpha: 0,
        scaleX: 0,
      });

      gsap.set(scrollHint, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set([guide, observerMode], {
        autoAlpha: 0,
        y: 14,
      });

      scrollTrigger = ScrollTrigger.create({
        trigger: sticky,
        start: 'top top',
        end: () => (window.innerWidth <= 760 ? '+=2800' : '+=3300'),
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateStoryByProgress(self.progress),
        onRefresh: (self) => updateStoryByProgress(self.progress),
      });

      updateStoryByProgress(scrollTrigger.progress);

      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    const onWheel = (event: WheelEvent) => {
      if (!storyState.isObserverMode) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!storyState.isObserverMode || event.touches.length < 2) return;

      event.preventDefault();
      event.stopPropagation();
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
      if (!storyState.isObserverMode) return;

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
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);

    const handleModelLoaded = (gltf: GLTF) => {
      if (hasUnmounted) {
        disposeModel(gltf.scene);
        return;
      }

      model = gltf.scene;

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const lowerObjectName = child.name.toLowerCase();

          const updateMaterial = (material: THREE.Material) => {
            const lowerMaterialName = material.name.toLowerCase();

            const isStageMesh =
              isStageLikeName(lowerObjectName) || isStageLikeName(lowerMaterialName);

            if (isStageMesh && material instanceof THREE.MeshStandardMaterial) {
              material.color = new THREE.Color('#4f5b69');
              material.roughness = 0.62;
              material.metalness = 0.03;
            }

            material.needsUpdate = true;
          };

          if (Array.isArray(child.material)) {
            child.material.forEach(updateMaterial);
          } else if (child.material) {
            updateMaterial(child.material);
          }
        }
      });

      const fullBox = new THREE.Box3().setFromObject(model);
      const modelCenter = new THREE.Vector3();
      fullBox.getCenter(modelCenter);

      model.position.sub(modelCenter);
      model.position.y = -0.08;
      model.rotation.y = INTRO_ROTATION_Y;

      scene.add(model);

      const relevantBox = getRelevantBounds(model);
      const relevantCenter = new THREE.Vector3();
      relevantBox.getCenter(relevantCenter);
      relevantBox.getSize(relevantBoundsSize);

      model.position.x -= relevantCenter.x;
      model.position.z -= relevantCenter.z;

      modelBaseScale = computeFitScale(
        relevantBoundsSize,
        camera,
        orbitTarget,
        responsive.viewportFill
      );

      model.scale.setScalar(modelBaseScale);

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

      renderTimer = window.setTimeout(() => {
        setShowRendering(false);
      }, 2000);

      buildScrollStory();
    };

    loader.load(
      MODEL_PATH,
      handleModelLoaded,
      undefined,
      (error) => {
        console.error('GLB model loading failed:', error);
        setIsLoading(false);
        setShowRendering(false);
        setHasError(true);
      }
    );

    const handleResize = () => {
      responsive = getResponsiveSettings();

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.copy(responsive.cameraPosition);
      camera.updateProjectionMatrix();

      applyControlSettings(responsive);

      if (model) {
        modelBaseScale = computeFitScale(
          relevantBoundsSize,
          camera,
          orbitTarget,
          responsive.viewportFill
        );

        const nextScale =
          storyState.activeFact >= 0 && !storyState.isObserverMode
            ? modelBaseScale * FACT_SETTLE_ZOOM
            : storyState.isObserverMode
              ? modelBaseScale * OBSERVER_ZOOM
              : modelBaseScale;

        model.scale.setScalar(nextScale);
      }

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      if (model && storyState.isObserverMode && isHovering && !isDragging) {
        model.rotation.y += 0.0014;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      hasUnmounted = true;

      cancelAnimationFrame(animationFrame);
      if (renderTimer) window.clearTimeout(renderTimer);

      scrollTrigger?.kill();
      scaleTimeline?.kill();

      if (model) {
        gsap.killTweensOf(model.rotation);
        gsap.killTweensOf(model.scale);
      }

      gsap.killTweensOf([...facts, ...dots, ...lines, scrollHint, guide, observerMode]);

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerup', onPointerUp);

      container.removeEventListener('pointerenter', onPointerEnter);
      container.removeEventListener('pointerleave', onPointerLeave);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('touchmove', onTouchMove);

      controls.dispose();

      if (mixer) {
        mixer.stopAllAction();
      }

      if (model) {
        scene.remove(model);
        disposeModel(model);
      }

      scene.remove(floor);
      floorGeometry.dispose();
      floorMaterial.dispose();

      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="about-machine-model" ref={sectionRef}>
      <div className="about-machine-model__bg" />

      <div
        className={`about-machine-model__header ${
          isHeaderReady ? 'about-machine-model__header--ready' : ''
        }`}
      >
        <span>Interactive Print Quality</span>

        <h2>
          See the quality
          <br />
          behind every print.
        </h2>

        <p>
          Scroll through the 3D press to discover NAPCO’s technology, production
          capacity and finishing strength.
        </p>
      </div>

      <div className="about-machine-model__sticky" ref={stickyRef}>
        <div className="about-machine-model__stage">
          <div className="about-machine-model__scroll-story" ref={scrollHintRef}>
            <span className="about-machine-model__scroll-line">
              <i />
            </span>

            <strong>Scroll Down</strong>
            <small>Reveal printing quality facts</small>
          </div>

          <div className="about-machine-model__hotspots">
            {qualityFacts.map((fact, index) => (
              <div
                key={fact.title}
                className={`about-machine-model__fact about-machine-model__fact--${
                  index + 1
                }`}
                ref={(element) => {
                  factRefs.current[index] = element;
                }}
              >
                <span
                  className="about-machine-model__fact-dot"
                  ref={(element) => {
                    dotRefs.current[index] = element;
                  }}
                />

                <span
                  className="about-machine-model__fact-line"
                  ref={(element) => {
                    lineRefs.current[index] = element;
                  }}
                />

                <article>
                  <span>{fact.eyebrow}</span>
                  <h3>{fact.title}</h3>
                  <p>{fact.description}</p>
                </article>
              </div>
            ))}
          </div>

          <div className="about-machine-model__observer-mode" ref={observerModeRef}>
            <strong>Interactive mode unlocked</strong>
            <small>Drag, hover and zoom to inspect the machine.</small>
          </div>

          <div className="about-machine-model__guide" ref={guideRef}>
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
      </div>
    </section>
  );
}