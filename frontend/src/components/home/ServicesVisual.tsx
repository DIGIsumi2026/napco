import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

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

        float blob(vec2 uv, vec2 p, float r) {
          float d = distance(uv, p);
          return smoothstep(r, 0.0, d);
        }

        void main() {
          vec2 uv = vUv;

          vec3 cream = vec3(0.98, 0.95, 0.84);
          vec3 yellow = vec3(1.0, 0.92, 0.02);
          vec3 lime = vec3(0.52, 0.9, 0.28);
          vec3 cyan = vec3(0.0, 0.68, 0.95);
          vec3 blue = vec3(0.14, 0.48, 0.95);
          vec3 peach = vec3(1.0, 0.78, 0.66);

          vec2 p1 = vec2(0.16 + sin(uTime * 0.18) * 0.04, 0.58);
          vec2 p2 = vec2(0.48 + cos(uTime * 0.16) * 0.06, 0.48);
          vec2 p3 = vec2(0.86, 0.67 + sin(uTime * 0.2) * 0.06);
          vec2 p4 = vec2(0.62, 0.14 + cos(uTime * 0.18) * 0.04);

          vec3 color = cream;
          color = mix(color, yellow, blob(uv, p1, 0.55) * 0.78);
          color = mix(color, lime, blob(uv, p2, 0.52) * 0.58);
          color = mix(color, cyan, blob(uv, p3, 0.56) * 0.72);
          color = mix(color, blue, blob(uv, p4, 0.42) * 0.34);
          color = mix(color, peach, blob(uv, vec2(0.2, 0.12), 0.42) * 0.28);

          gl_FragColor = vec4(color, 0.84);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId = 0;

    const resize = () => {
      const width = section.offsetWidth;
      const height = section.offsetHeight;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height, false);
    };

    const animate = () => {
      material.uniforms.uTime.value += 0.016;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frameId);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const intro = section.querySelector<HTMLElement>('.services-visual__intro');
      const introTitle = section.querySelector<HTMLElement>(
        '.services-visual__intro h2'
      );
      const pill = section.querySelector<HTMLElement>(
        '.services-visual__intro span'
      );
      const scrollHint = section.querySelector<HTMLElement>(
        '.services-visual__scroll-hint'
      );

      const tiles = Array.from(
        section.querySelectorAll<HTMLElement>('.services-visual__tile')
      );

      const gridLines = Array.from(
        section.querySelectorAll<HTMLElement>('.services-visual__line')
      );

      const details = Array.from(
        section.querySelectorAll<HTMLElement>('.services-visual__detail')
      );

      const detailImages = Array.from(
        section.querySelectorAll<HTMLElement>('.services-visual__detail-image')
      );

      const detailCopies = Array.from(
        section.querySelectorAll<HTMLElement>('.services-visual__detail-copy')
      );

      const firstTile = tiles[0];
      const otherTiles = tiles.slice(1);

      if (!intro || !introTitle || !pill || !scrollHint || !firstTile) return;

      gsap.set(intro, {
        autoAlpha: 1,
      });

      gsap.set(pill, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
      });

      gsap.set(introTitle, {
        autoAlpha: 1,
        y: 24,
        scale: 0.96,
      });

      gsap.set(gridLines, {
        autoAlpha: 0,
        scale: 0,
        transformOrigin: '50% 50%',
      });

      gsap.set(tiles, {
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 0,
        scale: 0.86,
        rotate: 0,
        transformOrigin: '50% 50%',
      });

      gsap.set(firstTile, {
        autoAlpha: 0,
        scale: 1.58,
        y: 56,
        rotateX: 10,
        zIndex: 12,
      });

      gsap.set(otherTiles, {
        autoAlpha: 0,
        scale: 0.82,
        y: 34,
      });

      gsap.set(details, {
        autoAlpha: 0,
        pointerEvents: 'none',
      });

      gsap.set(detailImages, {
        autoAlpha: 0,
        scale: 1.08,
        y: 64,
        rotateX: 7,
      });

      gsap.set(detailCopies, {
        autoAlpha: 0,
        y: 36,
      });

      gsap.set(scrollHint, {
        autoAlpha: 1,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * 8}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.addLabel('start');

      tl.to(
        gridLines,
        {
          autoAlpha: 0.62,
          scale: 1,
          duration: 0.8,
          stagger: 0.05,
        },
        'start'
      );

      tl.to(
        introTitle,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power3.out',
        },
        'start'
      );

      tl.to(
        introTitle,
        {
          autoAlpha: 0,
          y: -90,
          scale: 0.96,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        'start+=0.55'
      );

      tl.to(
        pill,
        {
          y: -130,
          scale: 0.94,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        'start+=0.55'
      );

      tl.to(
        firstTile,
        {
          autoAlpha: 1,
          scale: 1.28,
          y: 0,
          rotateX: 0,
          duration: 1.05,
          ease: 'back.out(1.45)',
        },
        'start+=0.92'
      );

      tl.addLabel('grid-build');

      tl.to(
        firstTile,
        {
          scale: 1,
          y: 0,
          duration: 0.88,
          ease: 'power3.inOut',
        },
        'grid-build'
      );

      tl.to(
        otherTiles,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.88,
          stagger: {
            amount: 0.36,
            from: 'center',
          },
          ease: 'back.out(1.18)',
        },
        'grid-build+=0.16'
      );

      tl.to(
        tiles,
        {
          x: (index) => {
            const values = [0, -10, 10, -14, 0, 14];
            return values[index] || 0;
          },
          y: (index) => {
            const values = [0, -12, 10, 12, -10, 14];
            return values[index] || 0;
          },
          duration: 0.65,
          stagger: 0.03,
        },
        'grid-build+=0.82'
      );

      tl.addLabel('grid-disperse');

      tl.to(
        pill,
        {
          autoAlpha: 0,
          y: -24,
          duration: 0.4,
          ease: 'power2.out',
        },
        'grid-disperse'
      );

      tl.to(
        tiles,
        {
          x: (index) => {
            const values = [0, -560, 560, -620, 0, 620];
            return values[index] || 0;
          },
          y: (index) => {
            const values = [0, -330, -310, 330, 380, 320];
            return values[index] || 0;
          },
          scale: 0.78,
          rotate: (index) => {
            const values = [0, -6, 6, 8, -5, 7];
            return values[index] || 0;
          },
          autoAlpha: 0,
          duration: 1,
          stagger: {
            amount: 0.2,
            from: 'edges',
          },
          ease: 'power3.inOut',
        },
        'grid-disperse+=0.05'
      );

      tl.to(
        gridLines,
        {
          autoAlpha: 0.44,
          duration: 0.5,
        },
        'grid-disperse+=0.2'
      );

      visualServices.forEach((_, index) => {
        const label = `detail-${index}`;
        tl.addLabel(label);

        const detail = details[index];
        const image = detailImages[index];
        const copy = detailCopies[index];

        if (!detail || !image || !copy) return;

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
            duration: 0.85,
            ease: 'power3.out',
          },
          label
        );

        tl.to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
          },
          `${label}+=0.12`
        );

        tl.to({}, { duration: 0.74 });

        if (index < visualServices.length - 1) {
          tl.to(
            image,
            {
              autoAlpha: 0,
              scale: 0.94,
              y: -58,
              duration: 0.52,
              ease: 'power2.inOut',
            },
            `${label}+=1.32`
          );

          tl.to(
            copy,
            {
              autoAlpha: 0,
              y: -32,
              duration: 0.44,
              ease: 'power2.inOut',
            },
            `${label}+=1.3`
          );

          tl.to(
            detail,
            {
              autoAlpha: 0,
              pointerEvents: 'none',
              duration: 0.01,
            },
            `${label}+=1.86`
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

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

        <div className="services-visual__grid">
          {visualServices.map((service, index) => (
            <article
              className={`services-visual__tile services-visual__tile--${
                index + 1
              }`}
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

        <div className="services-visual__scroll-hint" aria-hidden="true">
          <span className="services-visual__scroll-line" />
          <span className="services-visual__scroll-text">Scroll</span>
          <span className="services-visual__scroll-dot" />
        </div>
      </div>
    </section>
  );
}