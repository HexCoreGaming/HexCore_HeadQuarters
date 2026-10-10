
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // HEADQUARTERS ENVIRONMENT
// =====================================================

// SECTION 01 // CREATE HEADQUARTERS

export function createHeadquarters(scene) {

   
    // =====================================================
    // SECTION 02 // LUXURY BLACK MARBLE FLOOR
    // =====================================================

    // SECTION 02A // CREATE MARBLE TEXTURE

    const marbleCanvas = document.createElement("canvas");
    marbleCanvas.width = 1024;
    marbleCanvas.height = 1024;

    const marbleContext = marbleCanvas.getContext("2d");

    // Deep black and violet stone base

    const marbleGradient = marbleContext.createLinearGradient(
        0, 0, 1024, 1024
    );

    marbleGradient.addColorStop(0, "#07070D");
    marbleGradient.addColorStop(0.35, "#151321");
    marbleGradient.addColorStop(0.65, "#090A11");
    marbleGradient.addColorStop(1, "#1A1727");

    marbleContext.fillStyle = marbleGradient;
    marbleContext.fillRect(0, 0, 1024, 1024);

    // SECTION 02B // WHITE MARBLE VEINS

    // Seeded random numbers ensure a consistent floor
    // appearance whenever the website is refreshed.

    let marbleSeed = 12791;

    function marbleRandom() {
        marbleSeed = (
            marbleSeed * 1664525 + 1013904223
        ) >>> 0;

        return marbleSeed / 4294967296;
    }

    // Fine mineral streaks running through the marble

    for (let i = 0; i < 44; i++) {

        let x = marbleRandom() * 1250 - 100;
        let y = marbleRandom() * 1250 - 100;

        const length = 80 + marbleRandom() * 330;
        const segments = 12;

        const angle = -0.65 + marbleRandom() * 0.5;

        marbleContext.beginPath();
        marbleContext.moveTo(x, y);

        for (let j = 0; j < segments; j++) {

            x += Math.cos(angle) * length / segments;
            y += Math.sin(angle) * length / segments;

            x += (marbleRandom() - 0.5) * 22;
            y += (marbleRandom() - 0.5) * 22;

            marbleContext.lineTo(x, y);
        }

        marbleContext.strokeStyle =
            i % 5 === 0
                ? "rgba(235,235,255,0.58)"
                : "rgba(190,190,215,0.19)";

        marbleContext.lineWidth =
            i % 5 === 0 ? 2.2 : 0.85;

        marbleContext.shadowColor = "#C7C3E8";
        marbleContext.shadowBlur =
            i % 5 === 0 ? 5 : 0;

        marbleContext.stroke();
    }

    marbleContext.shadowBlur = 0;

    // SECTION 02C // SUBTLE STONE SLAB SEAMS

    marbleContext.strokeStyle = "rgba(130,130,160,0.17)";
    marbleContext.lineWidth = 2;

    for (let p = 0; p <= 1024; p += 256) {

        marbleContext.beginPath();
        marbleContext.moveTo(p, 0);
        marbleContext.lineTo(p, 1024);
        marbleContext.stroke();

        marbleContext.beginPath();
        marbleContext.moveTo(0, p);
        marbleContext.lineTo(1024, p);
        marbleContext.stroke();
    }

    // SECTION 02D // CREATE THREE.JS MARBLE MATERIAL

    const marbleTexture = new THREE.CanvasTexture(
        marbleCanvas
    );

    marbleTexture.colorSpace = THREE.SRGBColorSpace;

    marbleTexture.anisotropy = Math.min(
        8,
        16
    );

    const marbleMaterial = new THREE.MeshPhysicalMaterial({
        map: marbleTexture,
        color: 0xFFFFFF,
        metalness: 0.2,
        roughness: 0.075,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04
    });

    // SECTION 02E // BUILD MARBLE FLOOR

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(60, 1, 60),
        marbleMaterial
    );

    floor.position.y = -0.5;
    scene.add(floor);

    // =====================================================
    // SECTION 03 // HEXCORE FLOOR EMBLEM
    // =====================================================

    // This emblem sits on top of the existing circular
    // energy-core platform at the center of the lobby.

    // SECTION 03A // EMBLEM CANVAS

    const emblemCanvas = document.createElement("canvas");

    emblemCanvas.width = 1024;
    emblemCanvas.height = 1024;

    const emblemContext = emblemCanvas.getContext("2d");

    emblemContext.clearRect(0, 0, 1024, 1024);

    // SECTION 03B // HEXAGON BORDER

    function drawHexagon(radius) {

        emblemContext.beginPath();

        for (let i = 0; i < 6; i++) {

            const angle =
                Math.PI / 3 * i - Math.PI / 6;

            const x =
                512 + Math.cos(angle) * radius;

            const y =
                512 + Math.sin(angle) * radius;

            if (i === 0) {
                emblemContext.moveTo(x, y);
            } else {
                emblemContext.lineTo(x, y);
            }
        }

        emblemContext.closePath();
    }

    emblemContext.shadowColor = "#8650E8";
    emblemContext.shadowBlur = 35;
    emblemContext.strokeStyle = "#B885FF";
    emblemContext.lineWidth = 24;

    drawHexagon(430);
    emblemContext.stroke();

    emblemContext.shadowBlur = 15;
    emblemContext.strokeStyle = "#8CD6FD";
    emblemContext.lineWidth = 5;

    drawHexagon(385);
    emblemContext.stroke();

    // SECTION 03C // LARGE HEXCORE H SYMBOL

    emblemContext.shadowColor = "#8650E8";
    emblemContext.shadowBlur = 45;

    emblemContext.fillStyle = "#D9C5FF";

    // Left vertical bar

    emblemContext.fillRect(
        305, 325, 100, 380
    );

    // Right vertical bar

    emblemContext.fillRect(
        619, 325, 100, 380
    );

    // Center connecting bar

    emblemContext.fillRect(
        400, 465, 225, 100
    );

    // SECTION 03D // EMBLEM MATERIAL

    const emblemTexture = new THREE.CanvasTexture(
        emblemCanvas
    );

    emblemTexture.colorSpace = THREE.SRGBColorSpace;

    const emblemMaterial = new THREE.MeshBasicMaterial({
        map: emblemTexture,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    // SECTION 03E // PLACE EMBLEM AT LOBBY CENTER

    const floorEmblem = new THREE.Mesh(
        new THREE.PlaneGeometry(5.4, 5.4),
        emblemMaterial
    );

    floorEmblem.rotation.x = -Math.PI / 2;

    // Platform top is Y = 0.4.
    // Emblem sits slightly above it to avoid flickering.

    floorEmblem.position.set(0, 0.415, 0);

    scene.add(floorEmblem);

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
    // SECTION 26 // HEXCORE COSMIC ENERGY ARTIFACT
    // =====================================================

    // SECTION 26A // CENTRAL PURPLE ENERGY CRYSTAL

    const energyCore = new THREE.Group();

    energyCore.position.set(0, 5, 0);
    scene.add(energyCore);

    const crystalMaterial = new THREE.MeshStandardMaterial({
        color: 0xC58AFF,
        emissive: 0x852DFF,
        emissiveIntensity: 2.5,
        metalness: 0.25,
        roughness: 0.08,
        flatShading: true
    });

    const crystal = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.0, 1),
        crystalMaterial
    );

    energyCore.add(crystal);

    // SECTION 26B // INNER ENERGY SHELL

    const innerShell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 2),
        new THREE.MeshBasicMaterial({
            color: 0xB75FFF,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
            depthWrite: false
        })
    );

    energyCore.add(innerShell);

    // SECTION 26C // ARTIFACT METALLIC MATERIALS

    const artifactMetal = new THREE.MeshStandardMaterial({
        color: 0x211A36,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x43117F,
        emissiveIntensity: 0.5,
        side: THREE.DoubleSide
    });

    const artifactGlow = new THREE.MeshBasicMaterial({
        color: 0xB568FF
    });

    const artifactCyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // SECTION 26D // ROTATING SEGMENTED RINGS

    const artifactRings = [];

    for (let ringIndex = 0; ringIndex < 3; ringIndex++) {

        const ringGroup = new THREE.Group();

        const radius = 1.75 + ringIndex * 0.33;

        const segmentCount = 14 + ringIndex * 4;

        const segmentArc =
            (Math.PI * 2) / segmentCount;

        for (let i = 0; i < segmentCount; i++) {

            const startAngle =
                i * segmentArc + 0.035;

            const endAngle =
                (i + 0.72) * segmentArc;

            const segment = new THREE.Mesh(
                new THREE.RingGeometry(
                    radius,
                    radius + 0.17,
                    5,
                    1,
                    startAngle,
                    endAngle - startAngle
                ),
                artifactMetal
            );

            ringGroup.add(segment);

            // Thin luminous segment within each metal ring.

            const glowSegment = new THREE.Mesh(
                new THREE.RingGeometry(
                    radius + 0.17,
                    radius + 0.21,
                    5,
                    1,
                    startAngle,
                    endAngle - startAngle
                ),
                ringIndex === 1
                    ? artifactCyan
                    : artifactGlow
            );

            ringGroup.add(glowSegment);
        }

        ringGroup.rotation.set(
            ringIndex * 0.45,
            ringIndex * 0.6,
            ringIndex * 0.3
        );

        energyCore.add(ringGroup);
        artifactRings.push(ringGroup);
    }

    // SECTION 26E // FLOATING METALLIC FRAGMENTS

    const artifactFragments = new THREE.Group();

    const fragmentGeometry =
        new THREE.OctahedronGeometry(0.16, 0);

    const fragmentCount = 34;

    for (let i = 0; i < fragmentCount; i++) {

        const fragment = new THREE.Mesh(
            fragmentGeometry,
            i % 5 === 0
                ? artifactGlow
                : artifactMetal
        );

        const angle =
            (i / fragmentCount) * Math.PI * 2;

        const distance =
            2.4 + (i % 4) * 0.17;

        const height =
            Math.sin(i * 2.4) * 0.8;

        fragment.position.set(
            Math.cos(angle) * distance,
            height,
            Math.sin(angle) * distance
        );

        fragment.rotation.set(
            i * 0.7,
            i * 0.4,
            i * 0.9
        );

        fragment.scale.set(
            0.7 + (i % 3) * 0.35,
            1.1,
            0.7
        );

        artifactFragments.add(fragment);
    }

    energyCore.add(artifactFragments);

    // SECTION 26F // INNER ENERGY HALO

    const energyHalo = new THREE.Mesh(
        new THREE.TorusGeometry(1.48, 0.035, 8, 96),
        artifactGlow
    );

    energyHalo.rotation.x = Math.PI / 2;
    energyCore.add(energyHalo);

    // SECTION 26G // CORE PULSE LIGHT

    const innerCoreLight = new THREE.PointLight(
        0xA24EFF,
        25,
        12
    );

    energyCore.add(innerCoreLight);

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
    // SECTION 33 // LUXURY LOBBY LOUNGES
    // =====================================================

    // Two symmetrical seating areas:
    // left lounge at X = -20
    // right lounge at X = 20
    // both centered around Z = 7

    // SECTION 33A // LOUNGE MATERIALS

    const loungeSofaMaterial = new THREE.MeshStandardMaterial({
        color: 0x11111C,
        metalness: 0.25,
        roughness: 0.55
    });

    const loungeFrameMaterial = new THREE.MeshStandardMaterial({
        color: 0x242035,
        metalness: 0.85,
        roughness: 0.22
    });

    const loungeTableMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x181627,
        metalness: 0.75,
        roughness: 0.12,
        clearcoat: 0.8
    });

    const loungePurpleGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const loungeCyanGlow = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // SECTION 33B // FURNITURE HELPER

    function addLoungeBox(
        width,
        height,
        depth,
        material,
        x,
        y,
        z,
        parent
    ) {

        const part = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            material
        );

        part.position.set(x, y, z);
        parent.add(part);

        return part;
    }

    // SECTION 33C // BUILD SOFA

    function createLoungeSofa(parent, x, z, rotation) {

        const sofa = new THREE.Group();

        sofa.position.set(x, 0, z);
        sofa.rotation.y = rotation;

        // Base
        addLoungeBox(
            5.2, 0.55, 1.8,
            loungeFrameMaterial,
            0, 0.45, 0,
            sofa
        );

        // Seat cushions
        for (const cushionX of [-1.65, 0, 1.65]) {

            addLoungeBox(
                1.58, 0.34, 1.45,
                loungeSofaMaterial,
                cushionX, 0.9, 0.1,
                sofa
            );
        }

        // Backrest
        addLoungeBox(
            5.2, 1.25, 0.4,
            loungeSofaMaterial,
            0, 1.35, -0.85,
            sofa
        );

        // Armrests
        for (const armX of [-2.45, 2.45]) {

            addLoungeBox(
                0.35, 0.85, 1.8,
                loungeSofaMaterial,
                armX, 1.05, 0,
                sofa
            );
        }

        // Purple illuminated lower trim
        addLoungeBox(
            4.8, 0.07, 0.08,
            loungePurpleGlow,
            0, 0.24, 0.93,
            sofa
        );

        parent.add(sofa);
    }

    // SECTION 33D // LOUNGE TABLE

    function createLoungeTable(parent, x, z) {

        const table = new THREE.Group();
        table.position.set(x, 0, z);

        // Table surface
        addLoungeBox(
            3.2, 0.16, 1.6,
            loungeTableMaterial,
            0, 0.65, 0,
            table
        );

        // Central support
        addLoungeBox(
            1.15, 0.55, 0.75,
            loungeFrameMaterial,
            0, 0.32, 0,
            table
        );

        // Illuminated table trim
        addLoungeBox(
            3.1, 0.045, 0.08,
            loungeCyanGlow,
            0, 0.73, 0.81,
            table
        );

        parent.add(table);
    }

    // SECTION 33E // FUTURISTIC PLANTER

    function createLoungePlanter(parent, x, z) {

        const planter = new THREE.Group();
        planter.position.set(x, 0, z);

        const planterMaterial = new THREE.MeshStandardMaterial({
            color: 0x171523,
            metalness: 0.7,
            roughness: 0.3
        });

        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x244F49,
            emissive: 0x092A29,
            emissiveIntensity: 0.45,
            roughness: 0.8
        });

        const pot = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.55, 0.42, 1.0, 8
            ),
            planterMaterial
        );

        pot.position.y = 0.5;
        planter.add(pot);

        const planterRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.54, 0.04, 8, 32),
            loungePurpleGlow
        );

        planterRing.rotation.x = Math.PI / 2;
        planterRing.position.y = 1.0;
        planter.add(planterRing);

        // Stylized foliage
        for (let i = 0; i < 7; i++) {

            const leaf = new THREE.Mesh(
                new THREE.ConeGeometry(0.25, 1.5, 5),
                foliageMaterial
            );

            const angle = i * Math.PI * 2 / 7;

            leaf.position.set(
                Math.cos(angle) * 0.22,
                1.55 + (i % 3) * 0.17,
                Math.sin(angle) * 0.22
            );

            leaf.rotation.z = Math.cos(angle) * 0.3;
            leaf.rotation.x = Math.sin(angle) * 0.3;

            planter.add(leaf);
        }

        parent.add(planter);
    }

    // SECTION 33F // ASSEMBLE LEFT AND RIGHT LOUNGES

    function createLobbyLounge(centerX) {

        const lounge = new THREE.Group();

        // Matching sofas face the center table.
        // All coordinates below are relative to
        // the center of each lounge.

        createLoungeSofa(
            lounge,
            0,
            -3.2,
            0
        );

        createLoungeSofa(
            lounge,
            0,
            3.2,
            Math.PI
        );

        createLoungeTable(
            lounge,
            0,
            0
        );

        createLoungePlanter(
            lounge,
            -4.3,
            -4.2
        );

        createLoungePlanter(
            lounge,
            4.3,
            4.2
        );

        // Subtle illuminated lounge boundary.
        // No raised floor or platform is added.

        for (const edgeX of [-5.3, 5.3]) {

            addLoungeBox(
                0.07, 0.035, 11,
                loungePurpleGlow,
                edgeX, 0.04, 0,
                lounge
            );
        }

        lounge.position.set(centerX, 0, 7);
        scene.add(lounge);
    }

    createLobbyLounge(-20);
    createLobbyLounge(20);
    // =====================================================
    // SECTION 34 // EXTERIOR DIGITAL REALM
    // =====================================================

    // This exterior sits outside the front glass wall.
    // Interior front glass is at Z = 29.5, so the realm
    // begins beyond that point and stretches outward.

    // SECTION 34A // EXTERIOR MATERIALS

    const exteriorTowerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0A0D14,
        metalness: 0.92,
        roughness: 0.22,
        emissive: 0x120E24,
        emissiveIntensity: 0.22
    });

    const exteriorPanelMaterial = new THREE.MeshStandardMaterial({
        color: 0x121827,
        metalness: 0.75,
        roughness: 0.18,
        emissive: 0x1A1F35,
        emissiveIntensity: 0.35
    });

    const exteriorPurpleGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const exteriorCyanGlow = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    const exteriorMagentaGlow = new THREE.MeshBasicMaterial({
        color: 0xD96BFF
    });

    // SECTION 34B // EXTERIOR MASTER GROUP

    const exteriorRealm = new THREE.Group();
    exteriorRealm.position.set(0, 0, 0);
    scene.add(exteriorRealm);

    // SECTION 34C // EXTERIOR GROUND PLANE

    const exteriorGround = new THREE.Mesh(
        new THREE.BoxGeometry(200, 2, 220),
        new THREE.MeshStandardMaterial({
            color: 0x05070B,
            metalness: 0.55,
            roughness: 0.35,
            emissive: 0x090B14,
            emissiveIntensity: 0.18
        })
    );

    exteriorGround.position.set(0, -1.2, 110);
    exteriorRealm.add(exteriorGround);

    // SECTION 34D // GLOWING EXTERIOR PATHWAYS

    function addExteriorPathway(width, length, x, z, material) {
        const path = new THREE.Mesh(
            new THREE.BoxGeometry(width, 0.06, length),
            material
        );

        path.position.set(x, 0.08, z);
        exteriorRealm.add(path);
    }

    addExteriorPathway(6, 160, 0, 105, exteriorPurpleGlow);
    addExteriorPathway(0.14, 160, -3.2, 105, exteriorCyanGlow);
    addExteriorPathway(0.14, 160, 3.2, 105, exteriorCyanGlow);

    for (const laneX of [-42, -22, 22, 42]) {
        addExteriorPathway(0.12, 150, laneX, 112, exteriorPurpleGlow);
    }

    // SECTION 34E // DISTANT TOWERS

    function createExteriorTower(x, y, z, width, height, depth) {

        const tower = new THREE.Group();

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            exteriorTowerMaterial
        );

        body.position.y = height / 2;
        tower.add(body);

        // Vertical edge glows
        for (const edgeX of [-width / 2 + 0.18, width / 2 - 0.18]) {

            const edgeGlow = new THREE.Mesh(
                new THREE.BoxGeometry(0.14, height * 0.92, 0.12),
                exteriorPurpleGlow
            );

            edgeGlow.position.set(edgeX, height / 2, depth / 2 + 0.08);
            tower.add(edgeGlow);
        }

        // Top cyan trim
        const topTrim = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.94, 0.12, 0.12),
            exteriorCyanGlow
        );

        topTrim.position.set(0, height - 0.35, depth / 2 + 0.08);
        tower.add(topTrim);

        // Mid panel
        const midPanel = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.72, height * 0.28, 0.18),
            exteriorPanelMaterial
        );

        midPanel.position.set(0, height * 0.58, depth / 2 + 0.09);
        tower.add(midPanel);

        tower.position.set(x, y, z);
        exteriorRealm.add(tower);

        return tower;
    }

    const exteriorTowers = [];

    exteriorTowers.push(
        createExteriorTower(-52, 0, 78, 10, 34, 10),
        createExteriorTower(-32, 0, 68, 8, 26, 8),
        createExteriorTower(-12, 0, 58, 7, 22, 7),
        createExteriorTower(14, 0, 60, 8, 25, 8),
        createExteriorTower(34, 0, 72, 10, 30, 10),
        createExteriorTower(56, 0, 84, 12, 38, 12),
        createExteriorTower(-68, 0, 98, 12, 46, 12),
        createExteriorTower(74, 0, 102, 13, 50, 13)
    );

    // SECTION 34F // FLOATING PLATFORMS / RINGS

    const floatingStructures = [];

    function createFloatingRing(x, y, z, radius, tiltX, tiltY) {

        const ringGroup = new THREE.Group();

        const outerRing = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.25, 14, 72),
            exteriorPurpleGlow
        );

        ringGroup.add(outerRing);

        const innerRing = new THREE.Mesh(
            new THREE.TorusGeometry(radius - 0.65, 0.12, 12, 72),
            exteriorCyanGlow
        );

        ringGroup.add(innerRing);

        const platform = new THREE.Mesh(
            new THREE.CylinderGeometry(radius * 0.8, radius * 0.8, 0.5, 8),
            exteriorTowerMaterial
        );

        platform.position.y = -0.05;
        ringGroup.add(platform);

        ringGroup.position.set(x, y, z);
        ringGroup.rotation.x = tiltX;
        ringGroup.rotation.y = tiltY;

        exteriorRealm.add(ringGroup);
        floatingStructures.push(ringGroup);

        return ringGroup;
    }

    createFloatingRing(-24, 18, 86, 5.2, Math.PI / 2, 0.4);
    createFloatingRing(26, 24, 94, 6.4, Math.PI / 2, -0.25);
    createFloatingRing(0, 31, 128, 10, Math.PI / 2, 0);

    // SECTION 34G // CENTRAL ENERGY SPIRE

    const energySpire = new THREE.Group();

    const spireBase = new THREE.Mesh(
        new THREE.CylinderGeometry(3.8, 5.5, 8, 8),
        exteriorTowerMaterial
    );

    spireBase.position.y = 4;
    energySpire.add(spireBase);

    const spireCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 34, 8),
        exteriorCyanGlow
    );

    spireCore.position.y = 20;
    energySpire.add(spireCore);

    const spireHalo = new THREE.Mesh(
        new THREE.TorusGeometry(4.8, 0.16, 12, 72),
        exteriorMagentaGlow
    );

    spireHalo.rotation.x = Math.PI / 2;
    spireHalo.position.y = 16;
    energySpire.add(spireHalo);

    const spireTop = new THREE.Mesh(
        new THREE.OctahedronGeometry(2.2, 0),
        new THREE.MeshStandardMaterial({
            color: 0xC58AFF,
            emissive: 0x852DFF,
            emissiveIntensity: 1.3,
            metalness: 0.25,
            roughness: 0.08
        })
    );

    spireTop.position.y = 36;
    energySpire.add(spireTop);

    energySpire.position.set(0, 0, 88);
    exteriorRealm.add(energySpire);

    // SECTION 34H // SIDE ENERGY BEAMS

    function createBeamLine(length, x, y, z, rotationY, material) {
        const beam = new THREE.Mesh(
            new THREE.BoxGeometry(length, 0.07, 0.07),
            material
        );

        beam.position.set(x, y, z);
        beam.rotation.y = rotationY;
        exteriorRealm.add(beam);

        return beam;
    }

    const beamLines = [];

    beamLines.push(
        createBeamLine(38, -26, 18, 88, 0.08, exteriorPurpleGlow),
        createBeamLine(38, 26, 18, 88, -0.08, exteriorPurpleGlow),
        createBeamLine(44, -34, 16, 88, 0.04, exteriorCyanGlow),
        createBeamLine(44, 34, 16, 88, -0.04, exteriorCyanGlow)
    );

    // SECTION 34I // HOLOGRAPHIC BILLBOARDS

    function createHologramPanel(textLines, x, y, z, width, height) {

        const holoCanvas = document.createElement("canvas");
        holoCanvas.width = 512;
        holoCanvas.height = 768;

        const holoContext = holoCanvas.getContext("2d");

        holoContext.clearRect(0, 0, 512, 768);

        const holoGradient = holoContext.createLinearGradient(0, 0, 0, 768);
        holoGradient.addColorStop(0, "rgba(90,40,180,0.82)");
        holoGradient.addColorStop(1, "rgba(20,10,40,0.18)");

        holoContext.fillStyle = holoGradient;
        holoContext.fillRect(0, 0, 512, 768);

        holoContext.strokeStyle = "rgba(140,214,253,0.95)";
        holoContext.lineWidth = 8;
        holoContext.strokeRect(16, 16, 480, 736);

        holoContext.textAlign = "center";
        holoContext.textBaseline = "middle";
        holoContext.shadowColor = "#8650E8";
        holoContext.shadowBlur = 18;
        holoContext.fillStyle = "#F0ECFF";
        holoContext.font = "bold 42px Arial";

        const startY = 220;
        const stepY = 88;

        textLines.forEach((line, index) => {
            holoContext.fillText(line, 256, startY + index * stepY);
        });

        const holoTexture = new THREE.CanvasTexture(holoCanvas);
        holoTexture.colorSpace = THREE.SRGBColorSpace;

        const holoMaterial = new THREE.MeshBasicMaterial({
            map: holoTexture,
            transparent: true,
            opacity: 0.82,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const panel = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            holoMaterial
        );

        panel.position.set(x, y, z);
        exteriorRealm.add(panel);

        return panel;
    }

    const hologramPanels = [];

    hologramPanels.push(
        createHologramPanel(
            ["NEUTRAL", "GROUND", "DOMAIN"],
            -44, 18, 62, 7, 10.5
        ),
        createHologramPanel(
            ["HUMANS", "VS", "ELVES"],
            44, 18, 68, 7, 10.5
        ),
        createHologramPanel(
            ["SIMULATION", "BEYOND"],
            0, 28, 116, 8.5, 11.5
        )
    );

    // SECTION 34J // FLOATING DIGITAL SHARDS

    const exteriorShards = new THREE.Group();

    for (let i = 0; i < 40; i++) {

        const shard = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.4 + (i % 4) * 0.08, 0),
            i % 3 === 0
                ? exteriorCyanGlow
                : exteriorPurpleGlow
        );

        const angle = (i / 40) * Math.PI * 2;
        const radius = 18 + (i % 5) * 3.5;

        shard.position.set(
            Math.cos(angle) * radius,
            16 + Math.sin(i * 0.7) * 8,
            88 + Math.sin(angle) * 10
        );

        shard.rotation.set(i * 0.2, i * 0.5, i * 0.3);
        exteriorShards.add(shard);
    }

    exteriorRealm.add(exteriorShards);

    // SECTION 34K // EXTERIOR ATMOSPHERIC HAZE

    const hazeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(90, 24, 16),
        new THREE.MeshBasicMaterial({
            color: 0x1D1038,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            depthWrite: false
        })
    );

    hazeSphere.position.set(0, 28, 98);
    exteriorRealm.add(hazeSphere);

    // SECTION 34L // EXTERIOR LIGHTING

    const realmGlowLight = new THREE.PointLight(
        0x8650E8,
        26,
        140
    );

    realmGlowLight.position.set(0, 26, 88);
    exteriorRealm.add(realmGlowLight);

    const realmCyanLight = new THREE.PointLight(
        0x8CD6FD,
        18,
        120
    );

    realmCyanLight.position.set(0, 18, 104);
    exteriorRealm.add(realmCyanLight);
    // =====================================================
    // SECTION 35 // ENVIRONMENT ANIMATION
    // =====================================================

    // ANIMATION 01 // ROTATING AND FLOATING ENERGY CORE
    // ANIMATION 02 // PULSING RECEPTION SIGN

    const animationClock = new THREE.Clock();

    
    function animateHeadquarters() {

        const elapsedTime = animationClock.getElapsedTime();

        // ANIMATION 01 // FLOATING ENERGY ARTIFACT

        energyCore.position.y =
            5 + Math.sin(elapsedTime * 1.2) * 0.35;

        energyCore.rotation.y = elapsedTime * 0.12;

        // ANIMATION 02 // ROTATING CRYSTAL

        crystal.rotation.y = elapsedTime * 0.45;
        crystal.rotation.x = elapsedTime * 0.22;

        innerShell.rotation.y = -elapsedTime * 0.18;
        innerShell.rotation.z = elapsedTime * 0.11;

        // ANIMATION 03 // INDEPENDENT METALLIC RINGS

        artifactRings[0].rotation.z =
            elapsedTime * 0.25;

        artifactRings[1].rotation.z =
            -elapsedTime * 0.34;

        artifactRings[2].rotation.z =
            elapsedTime * 0.18;

        // ANIMATION 04 // FLOATING FRAGMENTS

        artifactFragments.rotation.y =
            -elapsedTime * 0.2;

        artifactFragments.rotation.z =
            Math.sin(elapsedTime * 0.4) * 0.12;

        // ANIMATION 05 // ENERGY PULSE

        const pulse =
            1 + Math.sin(elapsedTime * 2.5) * 0.07;

        crystal.scale.setScalar(pulse);

        innerCoreLight.intensity =
            22 + Math.sin(elapsedTime * 3) * 8;

        // ANIMATION 06 // EXISTING ENERGY LIGHT

        coreLight.position.y = energyCore.position.y;

        // ANIMATION 07 // RECEPTION SIGN

        receptionSign.material.opacity =
            0.85 + Math.sin(elapsedTime * 1.5) * 0.15;
    }


    // =====================================================
    // SECTION 36 // REGISTER ANIMATION
    // =====================================================

    return animateHeadquarters;
}
