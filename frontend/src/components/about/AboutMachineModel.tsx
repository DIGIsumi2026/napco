import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

gsap.registerPlugin(ScrollTrigger);

const MODEL_PATH = '/models/industrial-offset-printer-polished-animated.glb';
const FALLBACK_MODEL_PATH = '/models/industrial-offset-printer.glb';

const qualityFacts = [
  {
    eyebrow: 'Technology',
    title: 'State-of-the-art machinery',
    description:
      'Modern machinery, technology, accessories and qualified press personnel support demanding print requirements.',
    rotationY: -0.72,
  },
  {
    eyebrow: 'Capacity',
    title: 'Web, sheet-fed and finishing strength',
    description:
      'NAPCO is equipped for web printing, sheet-fed offset printing and finishing workflows at large production scale.',
    rotationY: 0.1,
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
    rotationY: 1.58,
  },
];

type ResponsiveSettings = {
  cameraPosition: THREE.Vector3;
  modelSize: number;
  minDistance: number;
  maxDistance: number;
  polarAngle: number;
};

type StoryState = {
  activeFact: number;
  isObserverMode: boolean;
};

const INTRO_ROTATION_Y = -0.95;

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
          cameraPosition: new THREE.Vector3(6.5, 3.35, 7.3),
          modelSize: 10.3,
          minDistance: 4.8,
          maxDistance: 13.5,
          polarAngle: 64,
        };
      }

      if (width <= 1024) {
        return {
          cameraPosition: new THREE.Vector3(7.2, 3.8, 8.1),
          modelSize: 11.1,
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
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const fixedPolarAngle = THREE.MathUtils.degToRad(responsive.polarAngle);

    controls.enabled = false;
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
    controls.minPolarAngle = fixedPolarAngle;
    controls.maxPolarAngle = fixedPolarAngle;
    controls.target.set(0, 1.18, 0);
    controls.update();
    controls.saveState();

    const ambientLight = new THREE.AmbientLight('#ffffff', 1.38);
    const keyLight = new THREE.DirectionalLight('#ffffff', 4.7);
    const fillLight = new THREE.DirectionalLight('#bfdfff', 2.15);
    const rimLight = new THREE.DirectionalLight('#ffffff', 2);

    keyLight.position.set(5.5, 8, 6);
    keyLight.castShadow = true;
    fillLight.position.set(-6.5, 4.5, -5);
    rimLight.position.set(0, 5.5, -7);

    scene.add(ambientLight, keyLight, fillLight, rimLight);

    const floorGeometry = new THREE.CircleGeometry(14, 128);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#8796a8',
      roughness: 0.58,
      metalness: 0.02,
      transparent: true,
      opacity: 0.18,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.08;
    floor.receiveShadow = true;
    scene.add(floor);

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    const storyState: StoryState = {
      activeFact: -2,
      isObserverMode: false,
    };

    let model: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let animationFrame = 0;
    let renderTimer = 0;
    let scrollTrigger: ScrollTrigger | null = null;
    let modelBaseScale = 1;
    let originalMaxSize = 1;
    let isHovering = false;
    let isDragging = false;
    let hasUnmounted = false;
    let scaleTimeline: gsap.core.Timeline | null = null;
    const modelRequestController = new AbortController();

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
          duration: 0.34,
          ease: 'power3.out',
          overwrite: true,
        });
        return;
      }

      scaleTimeline = gsap
        .timeline()
        .to(model.scale, {
          x: modelBaseScale * 1.06,
          y: modelBaseScale * 1.06,
          z: modelBaseScale * 1.06,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: true,
        })
        .to(model.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.34,
          ease: 'power3.out',
        });
    };

    const activateFact = (index: number, force = false) => {
      if (!model || (!force && storyState.activeFact === index && !storyState.isObserverMode)) {
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

      gsap.to(model.rotation, {
        y: qualityFacts[index].rotationY,
        duration: 0.62,
        ease: 'power3.inOut',
        overwrite: true,
      });

      animateModelScale(modelBaseScale * 1.03, true);
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
        overwrite: true,
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

      animateModelScale(modelBaseScale, false);
    };

    const getActiveFactFromProgress = (progress: number) => {
      if (progress >= 0.1 && progress < 0.28) return 0;
      if (progress >= 0.28 && progress < 0.46) return 1;
      if (progress >= 0.46 && progress < 0.64) return 2;
      if (progress >= 0.64 && progress < 0.82) return 3;

      return -1;
    };

    const updateStoryByProgress = (progress: number) => {
      if (progress >= 0.82) {
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
        trigger: section,
        start: 'top top',
        end: () => (window.innerWidth <= 760 ? '+=3000' : '+=3700'),
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateStoryByProgress(self.progress),
        onRefresh: (self) => updateStoryByProgress(self.progress),
      });

      updateStoryByProgress(scrollTrigger.progress);
      ScrollTrigger.refresh();
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

            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                material.needsUpdate = true;
              });
            } else if (child.material) {
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

        originalMaxSize = Math.max(size.x, size.y, size.z);
        modelBaseScale = responsive.modelSize / originalMaxSize;

        model.scale.setScalar(modelBaseScale);
        model.position.y = 0.04;
        model.rotation.y = INTRO_ROTATION_Y;

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

        renderTimer = window.setTimeout(() => {
          setShowRendering(false);
        }, 2000);

        buildScrollStory();
    };

    const loadMachineModel = (path: string, canUseFallback: boolean) => {
      loader.load(
        path,
        handleModelLoaded,
        undefined,
        (error) => {
          if (hasUnmounted) return;

          if (canUseFallback) {
            loadMachineModel(FALLBACK_MODEL_PATH, false);
            return;
          }

          console.error('GLB model loading failed:', error);
          setIsLoading(false);
          setHasError(true);
        }
      );
    };

    const resolveAndLoadModel = async () => {
      try {
        const response = await fetch(MODEL_PATH, {
          method: 'HEAD',
          signal: modelRequestController.signal,
        });

        const contentType = response.headers.get('content-type') ?? '';
        const isModelResponse =
          response.ok &&
          !contentType.includes('text/html') &&
          !contentType.includes('text/plain');

        if (!hasUnmounted && isModelResponse) {
          loadMachineModel(MODEL_PATH, true);
          return;
        }
      } catch {
        if (hasUnmounted) return;
      }

      if (!hasUnmounted) {
        loadMachineModel(FALLBACK_MODEL_PATH, false);
      }
    };

    void resolveAndLoadModel();

    const handleResize = () => {
      const nextResponsive = getResponsiveSettings();

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.copy(nextResponsive.cameraPosition);
      camera.updateProjectionMatrix();

      controls.minDistance = nextResponsive.minDistance;
      controls.maxDistance = nextResponsive.maxDistance;

      const nextPolarAngle = THREE.MathUtils.degToRad(nextResponsive.polarAngle);
      controls.minPolarAngle = nextPolarAngle;
      controls.maxPolarAngle = nextPolarAngle;
      controls.target.set(0, 1.18, 0);
      controls.update();
      controls.saveState();

      if (model && originalMaxSize > 0) {
        modelBaseScale = nextResponsive.modelSize / originalMaxSize;
        const nextScale =
          storyState.activeFact >= 0 && !storyState.isObserverMode
            ? modelBaseScale * 1.03
            : modelBaseScale;

        model.scale.setScalar(nextScale);
      }

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      ScrollTrigger.refresh();
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
      modelRequestController.abort();
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(renderTimer);

      scrollTrigger?.kill();
      scaleTimeline?.kill();

      if (model) {
        gsap.killTweensOf(model.rotation);
        gsap.killTweensOf(model.scale);
      }

      gsap.killTweensOf([facts, dots, lines, scrollHint, guide, observerMode]);

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

      <div className="about-machine-model__sticky" ref={stickyRef}>
        <div className="about-machine-model__header" data-reveal>
          <span>Interactive Print Quality</span>

          <h2>
            See the quality
            <br />
            behind every print.
          </h2>

          <p>
            Scroll through the 3D press to discover NAPCO’s technology,
            production capacity and finishing strength.
          </p>
        </div>

        <div className="about-machine-model__stage" data-reveal>
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

      <div className="about-machine-model__description" data-reveal>
        <span>Machine Capability</span>

        <p>
          This 3D press represents NAPCO’s production strength in web printing,
          sheet-fed offset printing and finishing. The company combines modern
          machinery, qualified personnel and specialist finishing services to
          deliver reliable print output at scale.
        </p>

        <div className="about-machine-model__facts">
          <div>
            <strong>Web &amp; Sheet-fed</strong>
            <small>Large-scale printing capacity</small>
          </div>

          <div>
            <strong>Premium Finishing</strong>
            <small>Varnishing, foiling, laminating and binding</small>
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
