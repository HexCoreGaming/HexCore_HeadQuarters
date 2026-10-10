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

}
