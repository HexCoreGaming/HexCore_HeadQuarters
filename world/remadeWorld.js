import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

// =====================================================
// HEXCORE GAMING // VISUAL FOUNDATION WORLD REMAKE
// =====================================================

export function* createRemadeWorldProgressive(scene, camera) {
    const root = new THREE.Group();
    root.name = 'HEXCORE_VISUAL_FOUNDATION';
    scene.add(root);

    const palette = {
        bg: 0x070b18,
        deep: 0x0c1324,
        steel: 0x17253f,
        steel2: 0x223354,
        glass: 0x224169,
        purple: 0x8c54ff,
        magenta: 0xd75fff,
        cyan: 0x75e0ff,
        blue: 0x6887ff,
        teal: 0x67ffd7
    };

    const darkMetal = new THREE.MeshStandardMaterial({
        color: palette.deep,
        metalness: 0.88,
        roughness: 0.2
    });

    const steel = new THREE.MeshStandardMaterial({
        color: palette.steel,
        metalness: 0.78,
        roughness: 0.24
    });

    const steel2 = new THREE.MeshStandardMaterial({
        color: palette.steel2,
        metalness: 0.76,
        roughness: 0.22
    });

    const glass = new THREE.MeshPhysicalMaterial({
        color: palette.glass,
        metalness: 0.22,
        roughness: 0.08,
        transparent: true,
        opacity: 0.64,
        transmission: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const obsidian = new THREE.MeshPhysicalMaterial({
        color: 0x0a0e18,
        metalness: 0.72,
        roughness: 0.14,
        clearcoat: 1,
        clearcoatRoughness: 0.08
    });

    const purpleGlow = new THREE.MeshStandardMaterial({
        color: 0x22173e,
        emissive: palette.purple,
        emissiveIntensity: 0.95,
        metalness: 0.65,
        roughness: 0.25
    });

    const magentaGlow = new THREE.MeshStandardMaterial({
        color: 0x2f173a,
        emissive: palette.magenta,
        emissiveIntensity: 0.9,
        metalness: 0.65,
        roughness: 0.25
    });

    const cyanGlow = new THREE.MeshStandardMaterial({
        color: 0x132539,
        emissive: palette.cyan,
        emissiveIntensity: 1.0,
        metalness: 0.64,
        roughness: 0.2
    });

    const blueGlow = new THREE.MeshStandardMaterial({
        color: 0x152041,
        emissive: palette.blue,
        emissiveIntensity: 0.95,
        metalness: 0.64,
        roughness: 0.22
    });

    const tealGlow = new THREE.MeshStandardMaterial({
        color: 0x113332,
        emissive: palette.teal,
        emissiveIntensity: 0.85,
        metalness: 0.55,
        roughness: 0.26
    });

    const lightMaterials = [purpleGlow, cyanGlow, magentaGlow, blueGlow, tealGlow];

    const geoms = {
        box: new THREE.BoxGeometry(1, 1, 1),
        oct: new THREE.CylinderGeometry(1, 1, 1, 8),
        cone: new THREE.ConeGeometry(1, 1, 6),
        slab: new THREE.BoxGeometry(1, 1, 1),
        cap: new THREE.CylinderGeometry(1, 1, 1, 12)
    };

    const batches = new Map();
    const temp = new THREE.Object3D();
    let stageCount = 0;

    function queue(type, material, x, y, z, sx, sy, sz, ry = 0) {
        const key = type + ':' + material.uuid;
        if (!batches.has(key)) {
            batches.set(key, {
                geometry: geoms[type],
                material,
                items: []
            });
        }
        batches.get(key).items.push([x, y, z, sx, sy, sz, ry]);
    }

    function box(x, y, z, w, h, d, material = steel, ry = 0) {
        queue('box', material, x, y, z, w, h, d, ry);
    }

    function octColumn(x, y, z, radius, h, material = steel) {
        queue('oct', material, x, y, z, radius, h, radius, 0);
    }

    function cone(x, y, z, radius, h, material = steel, ry = 0) {
        queue('cone', material, x, y, z, radius, h, radius, ry);
    }

    function cap(x, y, z, radius, h, material = steel) {
        queue('cap', material, x, y, z, radius, h, radius, 0);
    }

    function flush() {
        for (const bundle of batches.values()) {
            if (!bundle.items.length) continue;
            const mesh = new THREE.InstancedMesh(
                bundle.geometry,
                bundle.material,
                bundle.items.length
            );
            mesh.frustumCulled = true;
            bundle.items.forEach((item, index) => {
                const [x, y, z, sx, sy, sz, ry] = item;
                temp.position.set(x, y, z);
                temp.rotation.set(0, ry, 0);
                temp.scale.set(sx, sy, sz);
                temp.updateMatrix();
                mesh.setMatrixAt(index, temp.matrix);
            });
            mesh.instanceMatrix.needsUpdate = true;
            mesh.computeBoundingSphere();
            mesh.name = 'HEXCORE_STAGE_' + stageCount++;
            root.add(mesh);
            bundle.items.length = 0;
        }
    }

    function makeCanvasSign(text, width, height, accent = '#8cd6fd') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 220;
        const ctx = canvas.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 1024, 220);
        g.addColorStop(0, 'rgba(7,11,24,0.85)');
        g.addColorStop(1, 'rgba(21,28,48,0.85)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1024, 220);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 6;
        ctx.strokeRect(8, 8, 1008, 204);
        ctx.shadowColor = accent;
        ctx.shadowBlur = 28;
        ctx.fillStyle = '#ecf7ff';
        let size = 76;
        do {
            ctx.font = `700 ${size--}px system-ui`;
        } while (ctx.measureText(text).width > 940 && size > 20);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 512, 110);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
    }

    function ring(x, y, z, radius, tube, material, rx = Math.PI / 2, ry = 0) {
        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(radius, tube, 8, 72),
            material
        );
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, 0);
        root.add(mesh);
        return mesh;
    }

    function holoBillboard(x, y, z, w, h, text, accent, ry = 0) {
        const sign = makeCanvasSign(text, w, h, accent);
        sign.position.set(x, y, z);
        sign.rotation.y = ry;
        root.add(sign);
        return sign;
    }

    function makeSky() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createLinearGradient(0, 0, 0, 1024);
        grad.addColorStop(0, '#050812');
        grad.addColorStop(0.4, '#0c1224');
        grad.addColorStop(0.75, '#120c25');
        grad.addColorStop(1, '#05060d');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        ctx.globalAlpha = 0.35;
        for (let i = 0; i < 180; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 1024;
            const r = Math.random() * 2.4 + 0.2;
            ctx.beginPath();
            ctx.fillStyle = i % 5 === 0 ? '#d770ff' : i % 3 === 0 ? '#84e6ff' : '#dfe8ff';
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#8b58ff';
        for (let i = 0; i < 18; i++) {
            const y = 90 + i * 44;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(1024, y + Math.sin(i) * 16);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const dome = new THREE.Mesh(
            new THREE.SphereGeometry(950, 32, 24),
            new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })
        );
        root.add(dome);

        const starCount = 850;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const r = 680 + Math.random() * 160;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.55;
            positions[i * 3] = Math.cos(theta) * Math.sin(phi) * r;
            positions[i * 3 + 1] = 180 + Math.cos(phi) * r * 0.7;
            positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r;
        }
        const stars = new THREE.BufferGeometry();
        stars.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const points = new THREE.Points(stars, new THREE.PointsMaterial({
            color: 0xc7e0ff,
            size: 1.8,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.9
        }));
        root.add(points);

        const fogFloor = new THREE.Mesh(
            new THREE.CircleGeometry(420, 64),
            new THREE.MeshBasicMaterial({
                color: 0x40126e,
                transparent: true,
                opacity: 0.08,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        fogFloor.rotation.x = -Math.PI / 2;
        fogFloor.position.y = -3.8;
        fogFloor.position.z = 110;
        root.add(fogFloor);
    }

    function makeVoidDecor() {
        for (let i = 0; i < 18; i++) {
            const x = -230 + i * 28;
            const strip = new THREE.Mesh(
                new THREE.PlaneGeometry(5, 110),
                new THREE.MeshBasicMaterial({
                    color: i % 2 ? 0x8c54ff : 0x75e0ff,
                    transparent: true,
                    opacity: 0.11,
                    side: THREE.DoubleSide,
                    depthWrite: false
                })
            );
            strip.position.set(x, -48, 460);
            root.add(strip);
        }
    }

    function road(x, z, w, d, accentA = cyanGlow, accentB = purpleGlow) {
        box(x, -0.28, z, w, 0.65, d, darkMetal);
        box(x, -0.01, z, w * 0.98, 0.05, d * 0.98, obsidian);
        box(x - w / 2 + 0.28, 0.09, z, 0.18, 0.08, d, accentA);
        box(x + w / 2 - 0.28, 0.09, z, 0.18, 0.08, d, accentB);
        box(x, 0.02, z - d / 2 + 0.28, w, 0.05, 0.18, blueGlow);
        box(x, 0.02, z + d / 2 - 0.28, w, 0.05, 0.18, magentaGlow);
    }

    function bridgeLampLine(x1, x2, z, step, material) {
        for (let x = x1; x <= x2; x += step) {
            octColumn(x, 1.1, z, 0.12, 2.1, material);
        }
    }

    function makeFloatingLantern(x, y, z, c1, c2) {
        cap(x, y, z, 0.8, 0.32, steel2);
        cone(x, y + 0.92, z, 0.8, 1.4, c1);
        ring(x, y + 0.7, z, 0.85, 0.08, c2, Math.PI / 2);
    }

    function towerBase(x, z) {
        box(x, 2.5, z, 54, 5, 54, obsidian);
        box(x, 5.2, z, 40, 0.35, 40, cyanGlow);
        for (const sx of [-1, 1]) {
            for (const sz of [-1, 1]) {
                octColumn(x + sx * 22, 8, z + sz * 22, 2.2, 16, steel2);
                cone(x + sx * 22, 19.5, z + sz * 22, 2.8, 11, purpleGlow, Math.PI / 4);
            }
        }
    }

    function tower(x, z) {
        towerBase(x, z);
        const tiers = [
            [42, 44, steel],
            [96, 31, steel2],
            [150, 22, darkMetal],
            [194, 12, steel]
        ];
        for (const [height, width, mat] of tiers) {
            box(x, height / 2 + 5, z, width, height, width, mat);
            box(x, height / 2 + 5, z, width * 0.82, height * 0.96, width * 0.82, glass);
            for (let y = 12; y < height; y += 10) {
                box(x, y + 5, z + width * 0.51, width * 0.96, 0.18, 0.18, y % 20 ? cyanGlow : magentaGlow);
                box(x, y + 5, z - width * 0.51, width * 0.96, 0.18, 0.18, y % 20 ? purpleGlow : blueGlow);
                box(x + width * 0.51, y + 5, z, 0.18, 0.18, width * 0.96, cyanGlow);
                box(x - width * 0.51, y + 5, z, 0.18, 0.18, width * 0.96, magentaGlow);
            }
        }
        for (let i = 0; i < 8; i++) {
            const a = i / 8 * Math.PI * 2;
            const px = x + Math.cos(a) * 28;
            const pz = z + Math.sin(a) * 28;
            octColumn(px, 46, pz, 1.4, 92, steel2);
            cone(px, 105, pz, 2.2, 22, i % 2 ? cyanGlow : purpleGlow);
        }
        const crownRings = [];
        crownRings.push(ring(x, 187, z, 18, 0.16, cyanGlow, 0.24));
        crownRings.push(ring(x, 193, z, 22, 0.16, magentaGlow, 0.5));
        crownRings.push(ring(x, 200, z, 26, 0.18, purpleGlow, 0.82));
        cone(x, 230, z, 7, 58, steel2);
        octColumn(x, 258, z, 1.1, 18, cyanGlow);
        const sign1 = holoBillboard(x, 142, z + 24, 52, 8.2, 'HEXCORE', '#d9b2ff');
        const sign2 = holoBillboard(x, 33, z + 30, 34, 4.5, 'HEXCORE TOWER', '#8ce1ff');
        return [...crownRings, sign1, sign2];
    }

    function decorativeSkyscraper(x, z, w, d, h, variant) {
        const body = variant % 2 ? steel : steel2;
        const accentA = lightMaterials[variant % lightMaterials.length];
        const accentB = lightMaterials[(variant + 1) % lightMaterials.length];
        box(x, h / 2, z, w, h, d, body);
        box(x, h / 2 + 1, z, w * 0.82, h * 0.95, d * 0.82, glass);
        for (let y = 4; y < h; y += 8) {
            box(x, y, z + d * 0.5, w * 0.78, 0.14, 0.14, accentA);
            box(x, y, z - d * 0.5, w * 0.78, 0.14, 0.14, accentB);
        }
        box(x + w * 0.5, h / 2, z, 0.2, h * 0.95, d * 0.9, accentA);
        box(x - w * 0.5, h / 2, z, 0.2, h * 0.95, d * 0.9, accentB);
        box(x, h + 2.2, z, w * 1.08, 0.35, d * 1.08, accentA);
        if (variant % 3 === 0) {
            cone(x, h + 11, z, w * 0.22, 16, accentB);
        }
    }

    function districtMonument(x, z) {
        cap(x, 1.8, z, 10, 3.2, steel2);
        cap(x, 3.3, z, 7.6, 0.32, cyanGlow);
        cone(x, 10.2, z, 2.6, 14, glass);
        const inner = ring(x, 13.2, z, 9.4, 0.14, purpleGlow, 0.9);
        const outer = ring(x, 15.8, z, 12.4, 0.16, cyanGlow, 0.65);
        return [inner, outer];
    }

    const names = [
        'CYBER_ARENA HEX//BREAK',
        'WHERE LIGHT DIES',
        'UNTAMED HORIZON',
        'THE FORGOTTEN ASHES',
        'THE ACADEMY',
        'FUTURE GAME WORLDS',
        'ADMINISTRATION & LEGAL',
        'CUSTOMER SUPPORT',
        'COMMUNITY & EVENTS',
        'BUSINESS & PARTNERSHIPS',
        'GAME DEVELOPMENT',
        'HEXCORE HARDWARE LAB',
        'HEXCORE MERCHANDISE',
        'FUTURE WORLDS MUSEUM',
        'HEXCORE ARCADE',
        'GAMER RESIDENCES'
    ];

    const offsetsX = [-111, -37, 37, 111];
    const offsetsZ = [-114, -38, 38, 114];

    function themedShowcase(x, z, i) {
        const accent = lightMaterials[i % lightMaterials.length];
        const accentColor = ['#d69cff', '#89e6ff', '#ff87ef', '#8e9fff', '#80ffd3'][i % 5];
        const w = 46;
        const d = 40;
        const h = 20 + (i % 4) * 4;

        box(x, 2, z, 54, 4, 48, obsidian);
        box(x, h / 2 + 2, z - 2, w, h, d, steel);
        box(x, h / 2 + 3, z - 2, w * 0.84, h * 0.88, d * 0.84, glass);
        box(x, h + 4, z - 2, w + 6, 0.45, d + 6, accent);
        for (const sx of [-1, 1]) {
            octColumn(x + sx * 24, h / 2 + 3, z + 18, 1.7, h + 5, steel2);
            cone(x + sx * 24, h + 12, z + 18, 2.4, 10, accent);
        }
        box(x, 7, z + 20.8, 12, 14, 0.8, darkMetal);
        box(x - 5.2, 7, z + 20.2, 0.2, 13.5, 0.18, cyanGlow);
        box(x + 5.2, 7, z + 20.2, 0.2, 13.5, 0.18, purpleGlow);
        box(x, 14.2, z + 20.2, 12.4, 0.18, 0.18, magentaGlow);
        for (let y = 6; y < h; y += 6) {
            box(x, y, z + 20.1, w * 0.78, 0.16, 0.16, accent);
            box(x, y, z - 24.2, w * 0.78, 0.16, 0.16, accent);
        }
        const sign = holoBillboard(x, h + 7, z + 21.4, 42, 4.6, names[i], accentColor);

        if (i === 0) {
            for (let k = 0; k < 4; k++) {
                ring(x, h + 10 + k * 3, z - 2, 4.8 + k * 1.6, 0.1, k % 2 ? cyanGlow : magentaGlow, 0.38 + k * 0.22);
            }
        }
        if (i === 1) {
            for (let k = 0; k < 8; k++) {
                const a = k / 8 * Math.PI * 2;
                octColumn(x + Math.cos(a) * 18, 9, z + Math.sin(a) * 15, 0.45, 17, tealGlow);
                cone(x + Math.cos(a) * 18, 18, z + Math.sin(a) * 15, 3, 10, tealGlow);
            }
        }
        if (i === 2) {
            for (let k = 0; k < 4; k++) {
                const xx = x - 15 + k * 10;
                box(xx, 3.2, z + 22, 7, 0.7, 2, steel2);
                ring(xx, 3.4, z + 24.4, 2.6, 0.1, cyanGlow);
            }
        }
        if (i === 3) {
            for (let k = 0; k < 3; k++) {
                const xx = x - 14 + k * 14;
                cone(xx, h + 17, z - 5, 4.2, 22, steel2);
                cone(xx, h + 24, z - 5, 2.1, 12, purpleGlow);
            }
        }
        if (i === 12) {
            ring(x, h + 8, z - 2, 10, 0.14, magentaGlow, 0.8);
        }
        if (i === 13) {
            for (let k = 0; k < 4; k++) {
                octColumn(x + (k - 1.5) * 10, 17, z - 2, 1.5, 30, steel2);
            }
            ring(x, 26, z - 2, 12, 0.16, cyanGlow, 1.1);
        }
        return sign;
    }

    // Visual setup
    makeSky();
    makeVoidDecor();
    scene.background = new THREE.Color(palette.bg);
    scene.fog = new THREE.FogExp2(0x090d1b, 0.00105);

    const ambient = new THREE.HemisphereLight(0x92a7ff, 0x110e1d, 1.4);
    root.add(ambient);
    const key = new THREE.DirectionalLight(0xbecbff, 1.35);
    key.position.set(-140, 190, -120);
    root.add(key);
    const purpleFill = new THREE.PointLight(0x8c54ff, 4.5, 380);
    purpleFill.position.set(180, 95, 130);
    root.add(purpleFill);
    const cyanFill = new THREE.PointLight(0x75e0ff, 4.3, 420);
    cyanFill.position.set(440, 120, 80);
    root.add(cyanFill);

    // Stage 1 // Roads and closest approach around HQ
    road(0, 120, 118, 196, cyanGlow, purpleGlow);
    road(0, 255, 22, 282, cyanGlow, blueGlow);
    road(0, 345, 150, 156, magentaGlow, cyanGlow);
    road(140, 110, 155, 18, cyanGlow, magentaGlow);
    road(224, 110, 130, 130, cyanGlow, purpleGlow);
    road(281, 110, 60, 22, magentaGlow, blueGlow);
    road(448, 110, 326, 340, blueGlow, purpleGlow);
    road(-214, 115, 140, 130, magentaGlow, cyanGlow);
    road(-108, 115, 92, 18, cyanGlow, blueGlow);
    for (const x of [337, 411, 485, 559]) road(x, 110, 18, 335, cyanGlow, purpleGlow);
    for (const z of [-4, 72, 148, 224]) road(448, z, 320, 16, magentaGlow, cyanGlow);
    bridgeLampLine(-52, 52, 36, 8, cyanGlow);
    bridgeLampLine(-52, 52, 235, 8, purpleGlow);
    flush();
    yield;

    // Stage 2 // Gateway procession and close decorative pieces
    const animated = [];
    for (let i = 0; i < 16; i++) {
        const z = 44 + i * 11;
        for (const sx of [-1, 1]) {
            const x = sx * 54;
            octColumn(x, 3.8, z, 0.85, 7.6, steel2);
            octColumn(x, 7.6, z, 1.25, 0.42, lightMaterials[i % lightMaterials.length]);
        }
    }
    for (let i = 0; i < 9; i++) {
        makeFloatingLantern(-30 + i * 7.5, 4.2, 14, i % 2 ? cyanGlow : purpleGlow, i % 2 ? magentaGlow : blueGlow);
    }
    animated.push(...districtMonument(-210, 110));
    animated.push(...districtMonument(448, 110));
    flush();
    yield;

    // Stage 3 // Skyline districts
    const skylineA = [
        [-98, 56, 12, 13, 44, 0], [-122, 104, 14, 14, 58, 1], [-86, 152, 18, 15, 70, 2],
        [101, 70, 11, 11, 46, 3], [126, 132, 13, 14, 62, 4], [89, 188, 16, 16, 78, 5],
        [-154, 188, 14, 13, 64, 6], [154, 190, 15, 15, 72, 7], [-118, 228, 18, 14, 82, 8],
        [120, 232, 15, 13, 74, 9], [-92, 274, 13, 14, 56, 10], [98, 286, 12, 14, 52, 11]
    ];
    skylineA.forEach((b, i) => decorativeSkyscraper(...b));
    flush();
    yield;

    const skylineB = [];
    for (let i = 0; i < 28; i++) {
        const side = i % 2 ? 1 : -1;
        const x = 448 + side * (168 + (i % 4) * 22);
        const z = -48 + (i * 33) % 320;
        skylineB.push([x, z, 10 + (i % 4) * 3, 12 + (i % 3) * 2, 36 + (i * 11) % 62, i + 3]);
    }
    skylineB.forEach((b) => decorativeSkyscraper(...b));
    flush();
    yield;

    // Stage 4 // HexCore Tower
    const towerAnimObjects = tower(224, 110);
    flush();
    yield;

    // Stage 5 // Public game-showcase buildings
    const signs = [];
    for (let i = 0; i < 16; i++) {
        const x = 448 + offsetsX[i % 4];
        const z = 110 + offsetsZ[(i / 4) | 0];
        signs.push(themedShowcase(x, z, i));
        if (i % 2 === 1) {
            flush();
            yield;
        }
    }
    flush();
    yield;

    // Stage 6 // Street furniture, fountains, holograms
    const streetRings = [];
    for (const [x, z] of [[448, -42], [448, 262], [305, 110], [591, 110], [0, 345]]) {
        streetRings.push(ring(x, 14, z, 11, 0.12, cyanGlow, 0.72));
        streetRings.push(ring(x, 17, z, 14, 0.14, magentaGlow, 1.05));
    }
    for (let i = 0; i < 20; i++) {
        const x = 305 + (i % 5) * 38;
        const z = -40 + Math.floor(i / 5) * 84;
        box(x, 0.7, z, 6, 1.3, 2, steel2);
        box(x, 1.42, z, 6.1, 0.09, 2.1, cyanGlow);
        octColumn(x, 3.7, z, 0.15, 3.8, magentaGlow);
    }
    holoBillboard(15, 10, 80, 18, 2.4, 'WELCOME TO HEXCORE CITY', '#b98dff', 0);
    holoBillboard(448, 20, 110, 24, 3, 'FUTURE WORLDS DISTRICT', '#82e7ff', Math.PI / 2);
    holoBillboard(224, 22, 80, 18, 2.5, 'HEXCORE TOWER', '#f3beff', 0);
    flush();

    const pulseTargets = [
        ...towerAnimObjects,
        ...streetRings,
        ...animated,
        ...signs
    ];

    let t = 0;
    return () => {
        t += 0.016;
        for (let i = 0; i < pulseTargets.length; i++) {
            const obj = pulseTargets[i];
            if (!obj) continue;
            if (obj.rotation) obj.rotation.y += 0.001 * ((i % 2) ? -1 : 1);
            if (obj.material && obj.material.emissiveIntensity !== undefined) {
                obj.material.emissiveIntensity = 0.8 + Math.sin(t * 1.2 + i) * 0.12;
            }
        }
    };
}
