import { useEffect, useRef } from "react";

/** Distorted chrome sphere with ultraviolet/lime reflections (Three.js, client-only). */
export function ChromeOrb() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 6;

      const geo = new THREE.IcosahedronGeometry(1.5, 64);
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } },
        vertexShader: `
          uniform float uTime; uniform vec2 uMouse;
          varying vec3 vN; varying vec3 vV;
          vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
          vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
          vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
          float noise(vec3 p){vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.-2.*d);
            vec4 b=a.xxyy+vec4(0.,1.,0.,1.);vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);
            vec4 c=k2+a.zzzz;vec4 k3=perm(c);vec4 k4=perm(c+1.);
            vec4 o1=fract(k3*(1./41.));vec4 o2=fract(k4*(1./41.));
            vec4 o3=o2*d.z+o1*(1.-d.z);vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);
            return o4.y*d.y+o4.x*(1.-d.y);}
          float f(vec3 p){ return noise(p*1.4+uTime*.35)*.55 + noise(p*3.2-uTime*.2)*.18; }
          void main(){
            vec3 p = position + normal * (f(normal) + length(uMouse)*.08);
            float e=.01;
            vec3 t=normalize(cross(normal,vec3(0.,1.,0.)+.001)); vec3 b=cross(normal,t);
            vec3 p1=normalize(position+t*e); vec3 p2=normalize(position+b*e);
            p1 = p1*1.5 + p1*f(p1); p2 = p2*1.5 + p2*f(p2);
            vec3 n = normalize(cross(p1-p, p2-p));
            vN = normalize(normalMatrix*n);
            vec4 mv = modelViewMatrix*vec4(p,1.);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix*mv;
          }`,
        fragmentShader: `
          varying vec3 vN; varying vec3 vV; uniform float uTime;
          void main(){
            vec3 n = normalize(vN); vec3 r = reflect(-vV, n);
            float h = r.y*.5+.5;
            vec3 uv = vec3(.48,.17,1.); vec3 lime = vec3(.85,1.,0.); vec3 silver = vec3(.78,.8,.83);
            vec3 col = mix(vec3(.02,.02,.04), uv*.9, smoothstep(.15,.55,h));
            col = mix(col, silver, smoothstep(.62,.8,h));
            col += vec3(1.)*pow(smoothstep(.86,.98,h),3.);
            float band = smoothstep(.02,0., abs(r.x+.35+sin(uTime*.3)*.1)) * smoothstep(-.2,.4,r.y);
            col = mix(col, lime, band*.9);
            float fres = pow(1.-max(dot(n,vV),0.),3.);
            col += uv*fres*1.2;
            col += vec3(1.,.3,0.)*smoothstep(.04,0.,abs(r.y+.55))*.5;
            gl_FragColor = vec4(col,1.);
          }`,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const target = new THREE.Vector2();
      const onMove = (e: PointerEvent) => {
        target.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
      };
      window.addEventListener("pointermove", onMove);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      let raf = 0;
      const clock = new THREE.Clock();
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const t = clock.getElapsedTime();
        mat.uniforms.uTime.value = reduce ? 2 : t;
        mat.uniforms.uMouse.value.lerp(target, 0.05);
        mesh.rotation.y += reduce ? 0 : 0.0025;
        mesh.rotation.x = mat.uniforms.uMouse.value.y * 0.6;
        mesh.rotation.z = mat.uniforms.uMouse.value.x * 0.4;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={ref} aria-hidden className="h-full w-full" />;
}
