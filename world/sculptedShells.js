import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { HEXCORE_WORLD, HEXCORE_EXTERIOR_SITES } from './worldLayout.js';

// HEXCORE // Original architectural shells. Geometry is generated once per silhouette
// family and reused, then placed around the existing interaction anchors.
// The open southern entrance remains clear at world z=site.z+29.
export function* createSculptedShells(scene) {
  const root = new THREE.Group();
  root.name = 'HEXCORE_SCULPTED_BUILDING_SHELLS';
  scene.add(root);
  const obsidian = new THREE.MeshStandardMaterial({color:0x090f1b,metalness:.68,roughness:.27,side:THREE.DoubleSide});
  const pearlescent = new THREE.MeshStandardMaterial({color:0x203349,metalness:.58,roughness:.23,side:THREE.DoubleSide});
  const deepGlass = new THREE.MeshStandardMaterial({color:0x0e394d,metalness:.44,roughness:.16,transparent:true,opacity:.68,side:THREE.DoubleSide,depthWrite:false});
  const bioglass = new THREE.MeshStandardMaterial({color:0x21666b,emissive:0x0b8580,emissiveIntensity:.25,metalness:.32,roughness:.24,side:THREE.DoubleSide});
  const lights = [0x8d66f9,0x72eafa,0x88f3be,0xf073e1,0x8da3ff].map(c=>new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));

  // Loft a smooth tapered, asymmetric elven pavilion surface. Front face has
  // a broad, actual opening rather than being closed by a slab.
  const cache = new Map();
  function shellGeometry(family) {
    if (cache.has(family)) return cache.get(family);
    const vertices=[], normals=[], uvs=[], indices=[];
    const segments=64, levels=26;
    for(let j=0;j<=levels;j++){
      const t=j/levels;
      const h=2+Math.sin(t*Math.PI*.5)*25;
      const taper=1-.33*Math.pow(t,1.35);
      const billow=1+.07*Math.sin(t*Math.PI*3+family);
      for(let i=0;i<=segments;i++){
        const a=(i/segments)*Math.PI*2;
        const wave=1+.085*Math.cos(a*4+family*.6)+.045*Math.cos(a*7+t*4);
        const dx=Math.sin(a)*22*taper*billow*wave;
        const dz=Math.cos(a)*19*taper*billow*wave;
        vertices.push(dx,h+Math.cos(a*2+family)*t*1.3,dz-2);
        uvs.push(i/segments,t);
      }
    }
    for(let j=0;j<levels;j++)for(let i=0;i<segments;i++){
      // Leave a generous entrance gap in the front (positive Z face) all the way
      // from ground to mid-height, preserving original building interaction point.
      const a=(i+.5)/segments*Math.PI*2;
      if(j<15 && Math.abs(Math.sin(a))<.29 && Math.cos(a)>.6)continue;
      const q=j*(segments+1)+i;
      indices.push(q,q+1,q+segments+1,q+1,q+segments+2,q+segments+1);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();
    cache.set(family,g);return g;
  }
  function spline(points,radius,material,steps=48){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return new THREE.Mesh(new THREE.TubeGeometry(curve,steps,radius,5,false),material);
  }
  function addCanopy(g,accent){
    // Continuous sculpted leaf canopy with a curved central ridge.
    const v=[],uv=[],idx=[],n=32;
    for(let j=0;j<=12;j++){
      const t=j/12,z=-23+t*41;
      for(let i=0;i<=n;i++){
        const s=(i/n)*2-1,x=s*(18+5*Math.sin(t*Math.PI));
        const y=23+9*(1-s*s)+2*Math.sin(t*Math.PI)-5*t;
        v.push(x,y,z);uv.push(i/n,t);
      }
    }
    for(let j=0;j<12;j++)for(let i=0;i<n;i++){
      const q=j*(n+1)+i;idx.push(q,q+n+1,q+1,q+1,q+n+1,q+n+2);
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
    const canopy=new THREE.Mesh(geo,deepGlass);g.add(canopy);
    for(const side of [-1,1]){
      const pts=[];for(let t=0;t<=1.0001;t+=.1){let x=side*(18+5*Math.sin(t*Math.PI));pts.push([x,23+2*Math.sin(t*Math.PI)-5*t,-23+t*41]);}
      g.add(spline(pts,.15,accent,42));
    }
  }
  // Single landmark per destination, distinct lofted structure instead of box facades.
  for(const i of HEXCORE_EXTERIOR_SITES){
    const point=HEXCORE_WORLD.sites[i],g=new THREE.Group();g.position.set(point.x,0,point.z);
    g.name='SCULPTED_SITE_'+String(i+1).padStart(2,'0');root.add(g);
    const light=lights[i%lights.length];
    const body=new THREE.Mesh(shellGeometry(i%5),i%4===1?bioglass:(i%3===0?obsidian:pearlescent));
    body.rotation.y=(i%3-1)*.06;g.add(body);
    addCanopy(g,light);
    // Arcing luminous ribs express the geometry of the actual shell.
    for(const side of [-1,1]){
      for(let rib=0;rib<2;rib++){
        const pts=[];
        for(let t=0;t<=1.0001;t+=.1){
          const a=(side===1?.33:Math.PI-.33)+rib*.22;
          const y=2+t*25;
          const radius=1-.33*Math.pow(t,1.35);
          pts.push([Math.sin(a)*22*radius,y,Math.cos(a)*19*radius-2]);
        }
        g.add(spline(pts,.12,light,40));
      }
    }
    // A clear 10m portal facing the established site doorway.
    g.add(spline([[-7,0,22],[-7.6,8,23],[-5,16,23],[0,20,23],[5,16,23],[7.6,8,23],[7,0,22]],.24,light,60));
    // Distinct silhouette families: flower ribs / vertical fins / low-wing flares.
    if(i%4===0){for(const side of [-1,1])g.add(spline([[side*16,0,-7],[side*28,8,-12],[side*30,23,-10],[side*15,36,-3]],.5,pearlescent,48));}
    if(i%4===1){for(const side of [-1,1])g.add(spline([[side*11,0,-18],[side*16,18,-23],[side*10,41,-18],[side*3,48,-8]],.42,pearlescent,52));}
    if(i%4===2){for(const side of [-1,1])g.add(spline([[side*20,8,0],[side*35,12,-6],[side*31,18,-20],[side*19,25,-22]],.44,pearlescent,52));}
    if(i%4===3){for(const side of [-1,1])g.add(spline([[side*14,0,-11],[side*21,15,-16],[side*19,29,-18],[side*8,43,-13]],.36,pearlescent,50));}
    yield;
  }
  // The tower gets its own tall, sculptural flying-buttress set, distinct from
  // the buildings. Ribs taper inward toward the central HexCore spire.
  const tower=new THREE.Group();tower.position.set(HEXCORE_WORLD.tower.x,0,HEXCORE_WORLD.tower.z);
  tower.name='SCULPTED_TOWER_RIBS';root.add(tower);
  for(let i=0;i<8;i++){
    const angle=i*Math.PI/4,radial=(r,y)=>[Math.sin(angle)*r,y,Math.cos(angle)*r];
    tower.add(spline([radial(42,1),radial(52,32),radial(47,68),radial(34,128),radial(18,203),radial(7,283)],1.12,i%2?obsidian:pearlescent,95));
    tower.add(spline([radial(43,1),radial(51.5,32),radial(46.5,68),radial(33.5,128),radial(17.5,203),radial(6.5,283)],.14,lights[i%lights.length],95));
    yield;
  }
  return ()=>{};
}
