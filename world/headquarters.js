
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

    // =====================================================
    // SECTION 28 // HEXCORE RECEPTION CENTER
    // =====================================================

    // Reception desk is positioned near the rear wall,
    // away from the central energy platform.

    const receptionMaterial = new THREE.MeshStandardMaterial({
        color: 0x151124,
        metalness: 0.8,
        roughness: 0.2
    });

    const receptionGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    // SECTION 28A // RECEPTION DESK

    const receptionDesk = new THREE.Mesh(
        new THREE.BoxGeometry(12, 1.5, 2.5),
        receptionMaterial
    );

    receptionDesk.position.set(0, 0.75, -24);
    scene.add(receptionDesk);

    // SECTION 28B // DESK TOP

    const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(12.5, 0.2, 3),
        receptionMaterial
    );

    deskTop.position.set(0, 1.6, -24);
    scene.add(deskTop);

    // SECTION 28C // FRONT LIGHT STRIP

    const deskGlow = new THREE.Mesh(
        new THREE.BoxGeometry(11.5, 0.12, 0.08),
        receptionGlow
    );

    deskGlow.position.set(0, 1.1, -22.7);
    scene.add(deskGlow);

    // =====================================================
    // SECTION 28D // HOLOGRAPHIC HEXCORE SIGN
    // =====================================================

    const signCanvas = document.createElement("canvas");
    signCanvas.width = 1024;
    signCanvas.height = 256;

    const signContext = signCanvas.getContext("2d");

    signContext.clearRect(0, 0, 1024, 256);

    signContext.font = "bold 100px Consolas";
    signContext.textAlign = "center";
    signContext.textBaseline = "middle";

    signContext.shadowColor = "#8650E8";
    signContext.shadowBlur = 35;

    signContext.fillStyle = "#B863ED";
    signContext.fillText(
        "HEXCORE GAMING",
        512,
        128
    );

    const signTexture = new THREE.CanvasTexture(signCanvas);

    const signMaterial = new THREE.MeshBasicMaterial({
        map: signTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const receptionSign = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 3),
        signMaterial
    );

    receptionSign.position.set(0, 5, -28.8);
    scene.add(receptionSign);

    // =====================================================
    // SECTION 29 // HERO LOBBY WALL
    // =====================================================

    const heroWallMaterial = new THREE.MeshStandardMaterial({
        color: 0x11111d,
        metalness: 0.82,
        roughness: 0.22
    });

    const heroPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0x1b1731,
        metalness: 0.75,
        roughness: 0.18,
        emissive: 0x221044,
        emissiveIntensity: 0.25
    });

    const heroGlowPurple = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const heroGlowCyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // SECTION 29A // CENTRAL TOWER SHELL

    const centralTower = new THREE.Mesh(
        new THREE.BoxGeometry(22, 30, 2.2),
        heroWallMaterial
    );

    centralTower.position.set(0, 15, -28.8);
    scene.add(centralTower);

    // SECTION 29B // CENTRAL DISPLAY PANEL

    const centralPanel = new THREE.Mesh(
        new THREE.BoxGeometry(16, 18, 0.3),
        heroPanelMaterial
    );

    centralPanel.position.set(0, 13, -27.55);
    scene.add(centralPanel);

    // SECTION 29C // CENTRAL PANEL GLOW FRAME

    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 23, 0.18),
        heroGlowPurple
    );

    leftFrame.position.set(-8.2, 13, -27.35);
    scene.add(leftFrame);

    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 23, 0.18),
        heroGlowPurple
    );

    rightFrame.position.set(8.2, 13, -27.35);
    scene.add(rightFrame);

    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(16.6, 0.2, 0.18),
        heroGlowCyan
    );

    topFrame.position.set(0, 24.4, -27.35);
    scene.add(topFrame);

    const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(16.6, 0.2, 0.18),
        heroGlowCyan
    );

    bottomFrame.position.set(0, 1.6, -27.35);
    scene.add(bottomFrame);

    // SECTION 29D // HERO TITLE PANEL

    const heroTitleCanvas = document.createElement("canvas");
    heroTitleCanvas.width = 1400;
    heroTitleCanvas.height = 500;

    const heroTitleContext =
        heroTitleCanvas.getContext("2d");

    heroTitleContext.clearRect(
        0,
        0,
        heroTitleCanvas.width,
        heroTitleCanvas.height
    );

    heroTitleContext.textAlign = "center";
    heroTitleContext.textBaseline = "middle";

    heroTitleContext.shadowColor = "#8650E8";
    heroTitleContext.shadowBlur = 40;

    heroTitleContext.fillStyle = "#E7E4FF";
    heroTitleContext.font = "bold 160px Arial";
    heroTitleContext.fillText(
        "HEXCORE",
        700,
        180
    );

    heroTitleContext.fillStyle = "#C79CFF";
    heroTitleContext.font = "bold 70px Arial";
    heroTitleContext.fillText(
        "GAMING",
        700,
        310
    );

    const heroTitleTexture =
        new THREE.CanvasTexture(heroTitleCanvas);

    const heroTitleMaterial =
        new THREE.MeshBasicMaterial({
            map: heroTitleTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

    const heroTitle = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 5.7),
        heroTitleMaterial
    );

    heroTitle.position.set(0, 12, -27.2);
    scene.add(heroTitle);

    // SECTION 29E // UPPER EMBLEM

    const heroEmblem = new THREE.Mesh(
        new THREE.OctahedronGeometry(2.6, 0),
        new THREE.MeshStandardMaterial({
            color: 0x9B6BFF,
            emissive: 0x5F1DDA,
            emissiveIntensity: 0.8,
            metalness: 0.35,
            roughness: 0.12
        })
    );

    heroEmblem.position.set(0, 22, -27.35);
    scene.add(heroEmblem);

    const heroEmblemRing = new THREE.Mesh(
        new THREE.TorusGeometry(3.8, 0.12, 12, 96),
        heroGlowCyan
    );

    heroEmblemRing.rotation.x = Math.PI / 2;
    heroEmblemRing.position.set(0, 22, -27.8);
    scene.add(heroEmblemRing);

    // =====================================================
    // SECTION 30 // SIDE TOWER WALLS
    // =====================================================

    for (const x of [-24, 24]) {

        const sideTower = new THREE.Mesh(
            new THREE.BoxGeometry(8, 26, 2),
            heroWallMaterial
        );

        sideTower.position.set(x, 13, -28.9);
        scene.add(sideTower);

        const sideInnerPanel = new THREE.Mesh(
            new THREE.BoxGeometry(5.6, 18, 0.25),
            heroPanelMaterial
        );

        sideInnerPanel.position.set(x, 16, -27.6);
        scene.add(sideInnerPanel);
    }

    // =====================================================
    // SECTION 31 // SIDE BANNER PANELS
    // =====================================================

    function createBannerPanel(lines, xPosition) {

        const bannerCanvas = document.createElement("canvas");
        bannerCanvas.width = 512;
        bannerCanvas.height = 1024;

        const bannerContext = bannerCanvas.getContext("2d");

        bannerContext.fillStyle = "rgba(20, 12, 40, 0.92)";
        bannerContext.fillRect(0, 0, 512, 1024);

        bannerContext.strokeStyle = "#8650E8";
        bannerContext.lineWidth = 10;
        bannerContext.strokeRect(12, 12, 488, 1000);

        bannerContext.textAlign = "center";
        bannerContext.textBaseline = "middle";
        bannerContext.fillStyle = "#EFEAFF";
        bannerContext.shadowColor = "#8650E8";
        bannerContext.shadowBlur = 28;
        bannerContext.font = "bold 50px Arial";

        const startY = 220;
        const stepY = 130;

        lines.forEach((line, index) => {
            bannerContext.fillText(
                line,
                256,
                startY + index * stepY
            );
        });

        const bannerTexture =
            new THREE.CanvasTexture(bannerCanvas);

        const bannerMaterial =
            new THREE.MeshBasicMaterial({
                map: bannerTexture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

        const banner = new THREE.Mesh(
            new THREE.PlaneGeometry(5.2, 12),
            bannerMaterial
        );

        banner.position.set(xPosition, 16.5, -27.1);
        scene.add(banner);
    }

    createBannerPanel(
        ["GAMES", "PEOPLE", "WORLDS", "BEYOND"],
        -24
    );

    createBannerPanel(
        ["PLAY", "CREATE", "BELONG", "FURTHER"],
        24
    );

    // =====================================================
    // SECTION 32 // LOWER SIDE DISPLAY PANELS
    // =====================================================

    const displayPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0x171428,
        metalness: 0.65,
        roughness: 0.2,
        emissive: 0x140c2b,
        emissiveIntensity: 0.35
    });

    for (const x of [-21, 21]) {

        const displayPanel = new THREE.Mesh(
            new THREE.BoxGeometry(7, 4.5, 0.4),
            displayPanelMaterial
        );

        displayPanel.position.set(x, 6, -26.8);
        scene.add(displayPanel);

        const displayGlow = new THREE.Mesh(
            new THREE.BoxGeometry(6.6, 0.12, 0.08),
            heroGlowCyan
        );

        displayGlow.position.set(x, 3.9, -26.5);
        scene.add(displayGlow);
    }

    // =====================================================
    // SECTION 33 // ENVIRONMENT ANIMATION
    // =====================================================

    // ANIMATION 01 // ROTATING AND FLOATING ENERGY CORE
    // ANIMATION 02 // PULSING RECEPTION SIGN

    const animationClock = new THREE.Clock();

    function animateHeadquarters() {

        const elapsedTime = animationClock.getElapsedTime();

        energyCore.rotation.y = elapsedTime * 0.3;
        energyCore.rotation.x = elapsedTime * 0.1;

        energyCore.position.y =
            5 + Math.sin(elapsedTime * 1.2) * 0.35;

        coreLight.position.y = energyCore.position.y;

        receptionSign.material.opacity =
            0.85 + Math.sin(elapsedTime * 1.5) * 0.15;
    }

    // =====================================================
    // SECTION 34 // REGISTER ANIMATION
    // =====================================================

    return animateHeadquarters;
}
