import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // HEADQUARTERS ENVIRONMENT
// =====================================================

// SECTION 01 // CREATE HEADQUARTERS

export function createHeadquarters(scene) {

    // SECTION 02 // MAIN FLOOR

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(60, 1, 60),
        new THREE.MeshStandardMaterial({
            color: 0x080711,
            metalness: 0.8,
            roughness: 0.25
        })
    );

    floor.position.y = -0.5;
    scene.add(floor);

    // SECTION 03 // PURPLE FLOOR GRID

    const grid = new THREE.GridHelper(
        60,
        60,
        0x8650E8,
        0x241247
    );

    grid.position.y = 0.015;
    scene.add(grid);

    // SECTION 04 // GLOWING CENTRAL PLATFORM

    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 0.4, 64),
        new THREE.MeshStandardMaterial({
            color: 0x241247,
            emissive: 0x5F1DDA,
            emissiveIntensity: 0.35,
            metalness: 0.7,
            roughness: 0.2
        })
    );

    platform.position.set(0, 0.2, 0);
    scene.add(platform);

    // SECTION 05 // PLATFORM LIGHT RING

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(4.8, 0.07, 8, 96),
        new THREE.MeshBasicMaterial({
            color: 0x8CD6FD
        })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.43;
    scene.add(ring);

    // SECTION 06 // AMBIENT LIGHTING

    scene.add(new THREE.AmbientLight(
        0x8650E8,
        1.5
    ));

    // SECTION 07 // CYAN ACCENT LIGHT

    const cyanLight = new THREE.PointLight(
        0x8CD6FD,
        100,
        35
    );

    cyanLight.position.set(0, 10, 0);
    scene.add(cyanLight);

    // SECTION 08 // PURPLE ACCENT LIGHT

    const purpleLight = new THREE.PointLight(
        0x8650E8,
        80,
        30
    );

    purpleLight.position.set(12, 6, -8);
    scene.add(purpleLight);

    // =====================================================
    // SECTION 09 // HEADQUARTERS ARCHITECTURE
    // =====================================================

    const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x101020,
    metalness: 0.8,
    roughness: 0.25
});

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x241247,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x5F1DDA,
        emissiveIntensity: 0.15
    });

    // SECTION 10 // REAR WALL

    const rearWall = new THREE.Mesh(
        new THREE.BoxGeometry(60, 20, 1),
        wallMaterial
    );

    rearWall.position.set(0, 10, -30);
    scene.add(rearWall);

    // SECTION 11 // LEFT WALL

    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 20, 60),
        wallMaterial
    );

    leftWall.position.set(-30, 10, 0);
    scene.add(leftWall);

    // SECTION 12 // RIGHT WALL

    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 20, 60),
        wallMaterial
    );

    rightWall.position.set(30, 10, 0);
    scene.add(rightWall);

    // SECTION 13 // PANORAMIC FRONT WINDOW

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x436CDB,
        metalness: 0.1,
        roughness: 0.08,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const frontGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(58, 18),
        glassMaterial
    );

    frontGlass.position.set(0, 10, 29.5);
    scene.add(frontGlass);

    // SECTION 14 // WINDOW SUPPORT COLUMNS

    for (let x = -30; x <= 30; x += 10) {
        const column = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 20, 0.7),
            frameMaterial
        );

        column.position.set(x, 10, 29.5);
        scene.add(column);
    }

    // SECTION 15 // WINDOW TOP SUPPORT

    const topBeam = new THREE.Mesh(
        new THREE.BoxGeometry(60, 0.7, 1),
        frameMaterial
    );

    topBeam.position.set(0, 20, 29.5);
    scene.add(topBeam);

    // SECTION 16 // PURPLE ACCENT STRIPS

    const accentMaterial = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    for (const x of [-29.5, 29.5]) {
        const strip = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.12, 59),
            accentMaterial
        );

        strip.position.set(x, 0.12, 0);
        scene.add(strip);
    }
    // =====================================================
    // SECTION 17 // ILLUMINATED WALL ARCHITECTURE
    // =====================================================

    const purpleGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyanGlow = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // SECTION 18 // REAR WALL VERTICAL LIGHT STRIPS

    for (let x = -25; x <= 25; x += 10) {

        const lightStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, 17, 0.15),
            purpleGlow
        );

        lightStrip.position.set(x, 10, -29.35);
        scene.add(lightStrip);
    }

    // SECTION 19 // REAR WALL HORIZONTAL LIGHTING

    for (const y of [2, 18]) {

        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(55, 0.15, 0.15),
            cyanGlow
        );

        beam.position.set(0, y, -29.3);
        scene.add(beam);
    }

    // SECTION 20 // SIDE WALL VERTICAL LIGHT STRIPS

    for (const x of [-29.35, 29.35]) {

        for (let z = -20; z <= 20; z += 10) {

            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 16, 0.18),
                purpleGlow
            );

            strip.position.set(x, 10, z);
            scene.add(strip);
        }
    }

    // SECTION 21 // FLOOR PERIMETER LIGHTING

    for (const z of [-28.5, 28.5]) {

        const floorBeam = new THREE.Mesh(
            new THREE.BoxGeometry(57, 0.08, 0.12),
            cyanGlow
        );

        floorBeam.position.set(0, 0.08, z);
        scene.add(floorBeam);
    }

    // SECTION 22 // UPPER ARCHITECTURAL LIGHTING

    for (const x of [-28.5, 28.5]) {

        const upperBeam = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.15, 57),
            purpleGlow
        );

        upperBeam.position.set(x, 19, 0);
        scene.add(upperBeam);
    }

    
    // =====================================================
    // SECTION 23 // GRAND LOBBY SUPPORT PILLARS
    // =====================================================

    const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0x151124,
        metalness: 0.75,
        roughness: 0.25
    });

    const pillarGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    for (const x of [-20, 20]) {

        for (const z of [-18, 18]) {

            // MAIN PILLAR

            const pillar = new THREE.Mesh(
                new THREE.BoxGeometry(2, 19, 2),
                pillarMaterial
            );

            pillar.position.set(x, 9.5, z);
            scene.add(pillar);

            // FRONT-FACING PURPLE LIGHT STRIP

            const glowStrip = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 17, 0.08),
                pillarGlow
            );

            glowStrip.position.set(x, 9.5, z + 1.05);
            scene.add(glowStrip);

            // PILLAR BASE

            const base = new THREE.Mesh(
                new THREE.BoxGeometry(3, 0.6, 3),
                pillarMaterial
            );

            base.position.set(x, 0.3, z);
            scene.add(base);
        }
    }

    // =====================================================
    // SECTION 24 // CEILING CROSSBEAMS
    // =====================================================

    const ceilingBeamMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151124,
            metalness: 0.8,
            roughness: 0.25
        });

    for (const z of [-20, 0, 20]) {

        const crossbeam = new THREE.Mesh(
            new THREE.BoxGeometry(58, 1, 1.5),
            ceilingBeamMaterial
        );

        crossbeam.position.set(0, 19.5, z);
        scene.add(crossbeam);
    }

    // =====================================================
    // SECTION 25 // CEILING LIGHT STRIPS
    // =====================================================

    const ceilingGlow = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    for (const z of [-20, 0, 20]) {

        const lightBeam = new THREE.Mesh(
            new THREE.BoxGeometry(56, 0.12, 0.2),
            ceilingGlow
        );

        lightBeam.position.set(0, 18.9, z);
        scene.add(lightBeam);
    }

    // =====================================================
    // SECTION 26 // CENTRAL HOLOGRAPHIC ENERGY CORE
    // =====================================================

    const energyCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2, 2),
        new THREE.MeshStandardMaterial({
            color: 0x8650E8,
            emissive: 0x5F1DDA,
            emissiveIntensity: 0.8,
            metalness: 0.4,
            roughness: 0.15,
            flatShading: true
        })
    );

    energyCore.position.set(0, 5, 0);
    scene.add(energyCore);

    // SECTION 27 // ENERGY CORE LIGHT

    const coreLight = new THREE.PointLight(
        0x8650E8,
        45,
        18
    );

    coreLight.position.set(0, 5, 0);
    scene.add(coreLight);

}
