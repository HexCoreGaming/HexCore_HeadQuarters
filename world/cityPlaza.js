
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // CITY SOCIAL PLAZA
// =====================================================

export function createCityPlaza(scene) {

    // =====================================================
    // SECTION 01 // PLAZA GROUP AND POSITION
    // =====================================================

    const plaza = new THREE.Group();

    plaza.name = "HEXCORE_SOCIAL_PLAZA";
    plaza.position.set(0, 0, 65);

    scene.add(plaza);

    // =====================================================
    // SECTION 02 // MATERIALS
    // =====================================================

    const marble = new THREE.MeshStandardMaterial({
        color: 0x14111F,
        metalness: 0.45,
        roughness: 0.3
    });

    const darkMetal = new THREE.MeshStandardMaterial({
        color: 0x202538,
        metalness: 0.8,
        roughness: 0.3
    });

    const purple = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    const magenta = new THREE.MeshBasicMaterial({
        color: 0xE34BC9
    });

    // =====================================================
    // SECTION 03 // CIRCULAR MARBLE PLAZA
    // =====================================================

    const floor = new THREE.Mesh(
        new THREE.CylinderGeometry(17, 17, 0.15, 48),
        marble
    );

    // Slightly above the existing city ground.

    floor.position.y = 0.04;
    plaza.add(floor);

    // =====================================================
    // SECTION 04 // GLOWING FLOOR RINGS
    // =====================================================

    function floorRing(radius, material, thickness = 0.08) {

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(
                radius,
                thickness,
                6,
                64
            ),
            material
        );

        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.14;

        plaza.add(ring);
    }

    floorRing(16.5, purple, 0.13);
    floorRing(14.7, cyan, 0.055);
    floorRing(8.5, magenta, 0.07);

    // =====================================================
    // SECTION 05 // DECORATIVE MARBLE FLOOR LINES
    // =====================================================

    for (let i = 0; i < 12; i++) {

        const angle = i * Math.PI / 6;

        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.025, 6),
            i % 2 === 0 ? purple : cyan
        );

        line.position.set(
            Math.sin(angle) * 11.6,
            0.14,
            Math.cos(angle) * 11.6
        );

        line.rotation.y = angle;

        plaza.add(line);
    }

    // =====================================================
    // SECTION 06 // FUTURISTIC PLAZA BENCHES
    // =====================================================

    function createBench(x, z, rotation) {

        const bench = new THREE.Group();

        bench.position.set(x, 0, z);
        bench.rotation.y = rotation;

        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.32, 1),
            darkMetal
        );

        seat.position.y = 0.85;
        bench.add(seat);

        const back = new THREE.Mesh(
            new THREE.BoxGeometry(4, 1.0, 0.2),
            darkMetal
        );

        back.position.set(0, 1.35, -0.45);
        bench.add(back);

        // Illuminated underside.

        const light = new THREE.Mesh(
            new THREE.BoxGeometry(3.8, 0.1, 0.85),
            cyan
        );

        light.position.y = 0.62;
        bench.add(light);

        // Bench supports.

        for (const side of [-1.5, 1.5]) {

            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.25, 0.75, 0.75),
                darkMetal
            );

            leg.position.set(side, 0.38, 0);
            bench.add(leg);
        }

        plaza.add(bench);
    }

    createBench(-12.5, -5.5, Math.PI / 3);
    createBench(12.5, -5.5, -Math.PI / 3);
    createBench(-12.5, 6, -Math.PI / 3);
    createBench(12.5, 6, Math.PI / 3);

    // =====================================================
    // SECTION 07 // PERFORMANCE AREA
    // =====================================================

    // An illuminated marking, not a raised stage.
    // The dancing couple can stand here later.

    floorRing(5, cyan, 0.1);

    const centerDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(4.7, 4.7, 0.035, 40),
        new THREE.MeshStandardMaterial({
            color: 0x241A37,
            metalness: 0.55,
            roughness: 0.27
        })
    );

    centerDisc.position.y = 0.145;
    plaza.add(centerDisc);

    // =====================================================
    // SECTION 08 // ACCENT LIGHT PILLARS
    // =====================================================

    function lightPillar(x, z, material) {

        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.45, 0.6, 0.55, 8),
            darkMetal
        );

        base.position.y = 0.3;
        group.add(base);

        const light = new THREE.Mesh(
            new THREE.CylinderGeometry(0.13, 0.13, 3.2, 8),
            material
        );

        light.position.y = 2.1;
        group.add(light);

        const crown = new THREE.Mesh(
            new THREE.ConeGeometry(0.45, 0.8, 6),
            darkMetal
        );

        crown.position.y = 4;
        group.add(crown);

        plaza.add(group);
    }

    lightPillar(-10, -10, purple);
    lightPillar(10, -10, cyan);
    lightPillar(-10, 10, cyan);
    lightPillar(10, 10, purple);

    // =====================================================
    // SECTION 09 // FUTURE ACTIVITY POSITIONS
    // =====================================================

    // These positions will be used for future
    // interactive features.

    window.hexcorePlazaLocations = {

        foodCart: {
            x: -10,
            z: 65
        },

        violinist: {
            x: 10,
            z: 65
        },

        dancingCouple: {
            x: 0,
            z: 65
        },

        fireworksView: {
            x: 0,
            z: 72
        }
    };

    // =====================================================
    // SECTION 10 // ANIMATION
    // =====================================================

    function animateCityPlaza() {

        // Reserved for later plaza effects.
    }

    return animateCityPlaza;
}
