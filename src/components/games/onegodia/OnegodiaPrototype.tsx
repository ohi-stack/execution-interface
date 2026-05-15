'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Screen = 'menu' | 'howto' | 'credits' | 'playing' | 'victory' | 'gameover';

const WORLD_SIZE = 120;
const START_POS = new THREE.Vector3(0, 1, 30);

export default function OnegodiaPrototype() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<Screen>('menu');
  const [fragments, setFragments] = useState(0);
  const [coreActive, setCoreActive] = useState(false);
  const [health, setHealth] = useState(3);
  const controls = useRef({ w: false, a: false, s: false, d: false, shift: false, canJump: true, vy: 0 });

  useEffect(() => {
    if (screen !== 'playing' || !mountRef.current) return;

    const container = mountRef.current;
    container.innerHTML = '';
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050611');
    scene.fog = new THREE.Fog('#050611', 10, 160);

    const camera = new THREE.PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight('#ffffff', '#221144', 1.5);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight('#ffd57a', 1.3);
    dir.position.set(25, 40, 10);
    scene.add(dir);

    const road = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE), new THREE.MeshStandardMaterial({ color: '#0b102d', emissive: '#1d2f90', emissiveIntensity: 0.35 }));
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    const makeTower = (x:number,z:number,h:number)=>{
      const m = new THREE.Mesh(new THREE.BoxGeometry(6, h, 6), new THREE.MeshStandardMaterial({ color:'#0f1338', emissive:'#5930b9', emissiveIntensity:0.25 }));
      m.position.set(x,h/2,z); scene.add(m);
    };
    [[-25,-20,18],[25,-12,22],[-18,22,26],[22,26,15],[-35,8,14],[35,10,16]].forEach((p)=>makeTower(p[0],p[1],p[2]));

    const player = new THREE.Mesh(new THREE.CapsuleGeometry(1, 2, 4, 8), new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#2244bb', emissiveIntensity: 0.3 }));
    player.position.copy(START_POS);
    scene.add(player);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 20), new THREE.MeshStandardMaterial({ color: '#222', emissive: '#3d2a7a', emissiveIntensity: 0.5 }));
    core.position.set(0, 2, 0);
    scene.add(core);

    const portal = new THREE.Mesh(new THREE.TorusGeometry(4, 0.8, 16, 40), new THREE.MeshStandardMaterial({ color: '#4c4c4c', emissive: '#220022', emissiveIntensity: 0.4 }));
    portal.position.set(0, 5, -42);
    portal.rotation.x = Math.PI / 2;
    scene.add(portal);

    const fragmentGeo = new THREE.OctahedronGeometry(1.3);
    const fragmentMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffd700', emissiveIntensity: 0.9 });
    const fragmentSpots = [new THREE.Vector3(-28,2,-5), new THREE.Vector3(24,2,20), new THREE.Vector3(30,2,-28)];
    const fragmentMeshes = fragmentSpots.map((p)=>{ const f = new THREE.Mesh(fragmentGeo, fragmentMat.clone()); f.position.copy(p); scene.add(f); return f; });

    const droneGeo = new THREE.SphereGeometry(1.4, 18, 18);
    const drones = [
      { mesh:new THREE.Mesh(droneGeo, new THREE.MeshStandardMaterial({color:'#0e0e0e', emissive:'#8a0000', emissiveIntensity:0.8})), t:0 },
      { mesh:new THREE.Mesh(droneGeo, new THREE.MeshStandardMaterial({color:'#0e0e0e', emissive:'#8a0000', emissiveIntensity:0.8})), t:2.1 },
      { mesh:new THREE.Mesh(droneGeo, new THREE.MeshStandardMaterial({color:'#0e0e0e', emissive:'#8a0000', emissiveIntensity:0.8})), t:4.4 },
    ];
    drones.forEach((d, i)=>{ d.mesh.position.set(-18 + i*16, 1.5, -10); scene.add(d.mesh); });

    const keyDown = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (k === 'w') controls.current.w = true; if (k === 'a') controls.current.a = true; if (k === 's') controls.current.s = true; if (k === 'd') controls.current.d = true; if (e.key === 'Shift') controls.current.shift = true; if (e.key === ' ' && controls.current.canJump) { controls.current.vy = 0.2; controls.current.canJump = false; } };
    const keyUp = (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if (k === 'w') controls.current.w = false; if (k === 'a') controls.current.a = false; if (k === 's') controls.current.s = false; if (k === 'd') controls.current.d = false; if (e.key === 'Shift') controls.current.shift = false; };
    window.addEventListener('keydown', keyDown); window.addEventListener('keyup', keyUp);

    let localFragments = 0; let localHealth = 3; let localCore = false; let coolDown = 0;
    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), 0.033);
      const speed = controls.current.shift ? 18 : 10;
      const forward = new THREE.Vector3();
      if (controls.current.w) forward.z -= 1; if (controls.current.s) forward.z += 1; if (controls.current.a) forward.x -= 1; if (controls.current.d) forward.x += 1;
      if (forward.lengthSq() > 0) forward.normalize().multiplyScalar(speed * dt);
      player.position.add(forward);
      player.position.x = THREE.MathUtils.clamp(player.position.x, -WORLD_SIZE/2 + 2, WORLD_SIZE/2 - 2);
      player.position.z = THREE.MathUtils.clamp(player.position.z, -WORLD_SIZE/2 + 2, WORLD_SIZE/2 - 2);
      controls.current.vy -= 0.45 * dt;
      player.position.y += controls.current.vy;
      if (player.position.y <= 1) { player.position.y = 1; controls.current.vy = 0; controls.current.canJump = true; }

      fragmentMeshes.forEach((f, idx) => {
        if (!f.visible) return;
        f.rotation.y += dt * 2.5;
        if (player.position.distanceTo(f.position) < 2.4) { f.visible = false; localFragments += 1; setFragments(localFragments); }
      });
      if (!localCore && localFragments === 3 && player.position.distanceTo(core.position) < 5.5) {
        localCore = true; setCoreActive(true); (core.material as THREE.MeshStandardMaterial).emissive.set('#ffd700'); (core.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
        (portal.material as THREE.MeshStandardMaterial).emissive.set('#8a4dff'); (portal.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5;
      }

      drones.forEach((d, i)=>{ d.t += dt*(0.8 + i*0.15); d.mesh.position.x = Math.sin(d.t)*(16+i*5); d.mesh.position.z = Math.cos(d.t*1.2)*(12+i*3); d.mesh.position.y = 1.7 + Math.sin(d.t*3)*0.3; });
      if (coolDown > 0) coolDown -= dt;
      if (coolDown <= 0 && drones.some((d)=>d.mesh.position.distanceTo(player.position) < 2.6)) {
        localHealth -= 1; setHealth(localHealth); player.position.copy(START_POS); coolDown = 1.2;
        if (localHealth <= 0) { setScreen('gameover'); return; }
      }
      if (localCore && player.position.distanceTo(portal.position) < 4.5) { setScreen('victory'); return; }

      const camOffset = new THREE.Vector3(0, 10, 16);
      camera.position.copy(player.position).add(camOffset);
      camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z - 6);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => { camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('keydown', keyDown); window.removeEventListener('keyup', keyUp); window.removeEventListener('resize', resize); renderer.dispose();
    };
  }, [screen]);

  const startGame = () => { setFragments(0); setCoreActive(false); setHealth(3); controls.current = { w:false,a:false,s:false,d:false,shift:false,canJump:true,vy:0 }; setScreen('playing'); };

  return <div style={{minHeight:'100vh',background:'radial-gradient(circle at top,#130b2f,#050611 65%)',color:'#fff',padding:'1rem'}}>
    <h1 style={{textAlign:'center',color:'#f7d26a',letterSpacing:'0.08em'}}>Onegodia: Rise of the Digital World</h1>
    {screen === 'menu' && <div style={{maxWidth:520,margin:'3rem auto',textAlign:'center',display:'grid',gap:'0.8rem'}}>
      <button onClick={startGame}>Start Game</button><button onClick={()=>setScreen('howto')}>How to Play</button><button onClick={()=>setScreen('credits')}>Credits</button><button onClick={()=>{ if (typeof window !== 'undefined') window.close(); }}>Exit</button>
    </div>}
    {screen === 'howto' && <div><p>Collect all 3 Sovereign Intelligence Fragments. Avoid corrupted drones. Activate the OHI Core at center. Enter unlocked portal to win.</p><button onClick={()=>setScreen('menu')}>Back</button></div>}
    {screen === 'credits' && <div><p>V1 Prototype: Onegodian Systems - Genesis District One.</p><button onClick={()=>setScreen('menu')}>Back</button></div>}
    {(screen === 'playing') && <>
      <div style={{display:'flex',justifyContent:'space-between',maxWidth:1100,margin:'0 auto 0.5rem',fontWeight:700}}><span>Fragments: {fragments}/3</span><span>Health: {health}/3</span><span>OHI Core: {coreActive?'ACTIVE':'LOCKED'}</span></div>
      <div ref={mountRef} style={{height:'72vh',maxWidth:1100,margin:'0 auto',border:'2px solid #f2c86c'}} />
      <div style={{textAlign:'center',marginTop:8}}>WASD move · Shift run · Space jump</div>
      <button onClick={()=>setScreen('menu')} style={{display:'block',margin:'0.75rem auto'}}>Main Menu</button>
    </>}
    {screen === 'victory' && <div style={{textAlign:'center',marginTop:'4rem'}}><h2>Victory: Portal to the Next Domain Opened</h2><button onClick={startGame}>Restart</button><button onClick={()=>setScreen('menu')}>Main Menu</button></div>}
    {screen === 'gameover' && <div style={{textAlign:'center',marginTop:'4rem'}}><h2>Game Over: Corrupted Drones Overwhelmed You</h2><button onClick={startGame}>Restart</button><button onClick={()=>setScreen('menu')}>Main Menu</button></div>}
  </div>;
}
