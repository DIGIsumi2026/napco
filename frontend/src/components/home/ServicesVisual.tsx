import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { imageAssets } from '../../data/imageAssets';

gsap.registerPlugin(ScrollTrigger);

const visualServices = [
  {
    image: imageAssets.services.visual.newspaperPrinting,
    type: 'Working Environment',
    title: 'Newspaper Printing',
    description:
      'High-volume newspaper printing with reliable production capacity, consistent colour output and professional finishing for media and publishing clients.',
  },
  {
    image: imageAssets.services.visual.booksPublishing,
    type: 'Working Environment',
    title: 'Books & Publishing',
    description:
      'Complete book and textbook production from pre-press to printing, binding, trimming and final finishing for institutional and commercial publishers.',
  },
  {
    image: imageAssets.services.visual.commercialPrinting,
    type: 'Working Environment',
    title: 'Commercial Printing',
    description:
      'Premium brochures, catalogues, posters and leaflets produced with sharp detail, rich colour and professional quality control.',
  },
  {
    image: imageAssets.services.visual.labelsCloseup,
    type: 'Close-up Detail',
    title: 'Labels & Tags',
    description:
      'Precision label and tag printing for product, packaging and retail applications with careful inspection and finishing accuracy.',
  },
  {
    image: imageAssets.services.visual.calendarsDiaries,
    type: 'Close-up Detail',
    title: 'Calendars, Diaries & Planners',
    description:
      'Customized calendars, diaries and planners with full-colour printing, binding and elegant finishing for corporate branding.',
  },
  {
    image: imageAssets.services.visual.annualReports,
    type: 'Close-up Detail',
    title: 'Annual Reports & Stationery',
    description:
      'Corporate annual reports, folders and stationery produced with refined presentation, accurate colour reproduction and premium paper quality.',
  },
];

export default function ServicesVisual() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const labelProgressRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!canvas || !section) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2, 64, 64);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;

        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uResolution;

        float blob(vec2 uv, vec2 p, float r) {
          float d = distance(uv, p);
          return smoothstep(r, 0.0, d);
        }

        void main() {
          vec2 uv = vUv;

          vec3 yellow = vec3(1.0, 0.92, 0.05);
          vec3 lime = vec3(0.52, 0.9, 0.25);
          vec3 cyan = vec3(0.0, 0.65, 0.95);
          vec3 blue = vec3(0.1, 0.45, 0.95);
          vec3 pink = vec3(0.95, 0.1, 0.55);
          vec3 cream = vec3(0.98, 0.96, 0.88);

          vec2 p1 = vec2(0.18 + sin(uTime * 0.22) * 0.05, 0.62);
          vec2 p2 = vec2(0.55 + cos(uTime * 0.18) * 0.08, 0.55 + sin(uTime * 0.2) * 0.04);
          vec2 p3 = vec2(0.88, 0.72 + cos(uTime * 0.24) * 0.08);
          vec2 p4 = vec2(0.75 + sin(uTime * 0.16) * 0.04, 0.18);

          vec3 color = cream;
          color = mix(color, yellow, blob(uv, p1, 0.55) * 0.75);
          color = mix(color, lime, blob(uv, p2, 0.48) * 0.55);
          color = mix(color, cyan, blob(uv, p3, 0.52) * 0.72);
          color = mix(color, blue, blob(uv, p4, 0.46) * 0.42);
          color = mix(color, pink, blob(uv, vec2(0.35, 0.22), 0.35) * 0.12);

          gl_FragColor = vec4(color, 0.78);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrame = 0;

    const resize = () => {
      const width = section.offsetWidth;
      const height = section.offsetHeight;

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      material.uniforms.uResolution.value.set(width, height);
    };

    const animate = () => {
      material.uniforms.uTime.value += 0.016;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrame);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const hero = section.querySelector('.services-visual__hero-card');
      const heroImage = section.querySelector('.services-visual__hero-card img');
      const grid = section.querySelector('.services-visual__grid');
      const tiles = gsap.utils.toArray<HTMLElement>('.services-visual__tile');
      const details = gsap.utils.toArray<HTMLElement>('.services-visual__detail');
      const detailImages = gsap.utils.toArray<HTMLElement>('.services-visual__detail-image');
      const detailText = gsap.utils.toArray<HTMLElement>('.services-visual__detail-copy');
      const controls = section.querySelector('.services-visual__controls');
      const gridLines = gsap.utils.toArray<HTMLElement>('.services-visual__line');

      gsap.set(hero, {
        autoAlpha: 0,
        scale: 0.64,
        y: 70,
        rotateX: 12,
        transformOrigin: '50% 50%',
      });

      gsap.set(heroImage, {
        scale: 1.18,
        transformOrigin: '50% 50%',
      });

      gsap.set(grid, {
        autoAlpha: 0,
        scale: 1.12,
        transformOrigin: '50% 50%',
      });

      gsap.set(tiles, {
        autoAlpha: 0,
        scale: 0.44,
        x: 0,
        y: 0,
        rotate: 0,
        transformOrigin: '50% 50%',
      });

      gsap.set(details, {
        autoAlpha: 0,
        pointerEvents: 'none',
      });

      gsap.set(detailImages, {
        autoAlpha: 0,
        scale: 1.14,
        y: 80,
        rotateX: 9,
        transformOrigin: '50% 50%',
      });

      gsap.set(detailText, {
        autoAlpha: 0,
        y: 36,
      });

      gsap.set(controls, {
        autoAlpha: 0,
        y: 24,
      });

      gsap.set(gridLines, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: '50% 50%',
      });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${window.innerHeight * 7}`,
          scrub: 1.15,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timelineRef.current = tl;
      scrollTriggerRef.current = tl.scrollTrigger || null;

      tl.addLabel('intro');

      tl.to(
        gridLines,
        {
          autoAlpha: 0.65,
          scale: 1,
          duration: 0.65,
          stagger: 0.04,
        },
        'intro'
      );

      tl.to(
        hero,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'back.out(1.45)',
        },
        'intro+=0.08'
      );

      tl.to(
        heroImage,
        {
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
        },
        'intro+=0.08'
      );

      tl.addLabel('grid');

      tl.to(
        hero,
        {
          autoAlpha: 0,
          scale: 0.56,
          y: -20,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        'grid'
      );

      tl.to(
        grid,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.inOut',
        },
        'grid+=0.08'
      );

      tl.to(
        tiles,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          stagger: {
            amount: 0.34,
            from: 'center',
          },
          ease: 'back.out(1.25)',
        },
        'grid+=0.14'
      );

      tl.to(
        tiles,
        {
          y: (index) => {
            const values = [-14, 18, -8, 22, -18, 10];
            return values[index] || 0;
          },
          x: (index) => {
            const values = [-12, 16, 10, -16, 8, -8];
            return values[index] || 0;
          },
          duration: 0.7,
          stagger: 0.04,
        },
        'grid+=0.78'
      );

      tl.addLabel('disperse');

      tl.to(
        tiles,
        {
          x: (index) => {
            const values = [-520, 0, 520, -560, 0, 560];
            return values[index] || 0;
          },
          y: (index) => {
            const values = [-240, -310, -240, 260, 330, 260];
            return values[index] || 0;
          },
          rotate: (index) => {
            const values = [-8, 4, 8, 6, -5, 10];
            return values[index] || 0;
          },
          scale: 0.74,
          autoAlpha: 0,
          duration: 1,
          stagger: {
            amount: 0.22,
            from: 'edges',
          },
          ease: 'power3.inOut',
        },
        'disperse'
      );

      tl.to(
        gridLines,
        {
          autoAlpha: 0.42,
          duration: 0.6,
        },
        'disperse'
      );

      visualServices.forEach((_, index) => {
        const label = `detail-${index}`;
        tl.addLabel(label);

        const detail = details[index];
        const image = detailImages[index];
        const text = detailText[index];

        tl.to(
          detail,
          {
            autoAlpha: 1,
            pointerEvents: 'auto',
            duration: 0.01,
          },
          label
        );

        tl.to(
          image,
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            duration: 0.82,
            ease: 'power3.out',
          },
          label
        );

        tl.to(
            text,
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.68,
                ease: 'power3.out',
            },
            `${label}+=0.14`
        );

        tl.to(
          controls,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
          },
          label
        );

        tl.to(
          {},
          {
            duration: 0.65,
          }
        );

        if (index < visualServices.length - 1) {
          tl.to(
            image,
            {
              autoAlpha: 0,
              scale: 0.92,
              y: -70,
              duration: 0.55,
              ease: 'power2.inOut',
            },
            `detail-${index}+=1.35`
          );

          tl.to(
            text,
            {
              autoAlpha: 0,
              y: -34,
              duration: 0.45,
              ease: 'power2.inOut',
            },
            `detail-${index}+=1.34`
          );

          tl.to(
            detail,
            {
              autoAlpha: 0,
              pointerEvents: 'none',
              duration: 0.01,
            },
            `detail-${index}+=1.9`
          );
        }
      });

      tl.addLabel('end');

      labelProgressRef.current = visualServices.map((_, index) => {
        const labelTime = tl.labels[`detail-${index}`] || 0;
        return labelTime / tl.duration();
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const goToService = (direction: 'prev' | 'next') => {
    const trigger = scrollTriggerRef.current;
    const progressList = labelProgressRef.current;

    if (!trigger || !progressList.length) return;

    const currentProgress = trigger.progress;

    let currentIndex = progressList.findIndex((progress, index) => {
      const nextProgress = progressList[index + 1] ?? 1;
      return currentProgress >= progress - 0.02 && currentProgress < nextProgress - 0.02;
    });

    if (currentIndex === -1) currentIndex = 0;

    const nextIndex =
      direction === 'next'
        ? Math.min(currentIndex + 1, progressList.length - 1)
        : Math.max(currentIndex - 1, 0);

    const targetProgress = progressList[nextIndex];
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section className="services-visual" ref={sectionRef}>
      <canvas ref={canvasRef} className="services-visual__canvas" />

      <div className="services-visual__noise" />

      <span className="services-visual__line services-visual__line--v services-visual__line--v1" />
      <span className="services-visual__line services-visual__line--v services-visual__line--v2" />
      <span className="services-visual__line services-visual__line--h services-visual__line--h1" />
      <span className="services-visual__line services-visual__line--h services-visual__line--h2" />

      <div className="services-visual__stage">
        <div className="services-visual__intro">
          <span>Visual Service Discovery</span>
          <h2>Explore NAPCO’s Print Capabilities</h2>
        </div>

        <article className="services-visual__hero-card">
          <img src={visualServices[0].image} alt={visualServices[0].title} />
        </article>

        <div className="services-visual__grid">
          {visualServices.map((service, index) => (
            <article
              className={`services-visual__tile services-visual__tile--${index + 1}`}
              key={service.title}
            >
              <img src={service.image} alt={service.title} />
            </article>
          ))}
        </div>

        <div className="services-visual__details">
          {visualServices.map((service, index) => (
            <article className="services-visual__detail" key={service.title}>
              <div className="services-visual__detail-image">
                <img src={service.image} alt={service.title} />
              </div>

              <div className="services-visual__detail-copy">
                <span>{service.type}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <small>{String(index + 1).padStart(2, '0')} / 06</small>
              </div>
            </article>
          ))}
        </div>

        <div className="services-visual__controls">
          <button
            type="button"
            onClick={() => goToService('prev')}
            aria-label="Previous service"
            data-cursor="Previous"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            onClick={() => goToService('next')}
            aria-label="Next service"
            data-cursor="Next"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}