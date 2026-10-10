
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE CITY // PLAZA ENTERTAINMENT
// Fountain + dancing couple + fireworks
// =====================================================

export function createPlazaExtras(scene) {

    const plazaExtras = new THREE.Group();
    plazaExtras.position.set(0, 0, 65);
    scene.add(plazaExtras);

    // =====================================================
    // SECTION 01 // MATERIALS
    // =====================================================

    const dark = new THREE.MeshStandardMaterial({
        color: 0x151321,
        metalness: 0.7,
        roughness: 0.3
    });

    const silver = new THREE.MeshStandardMaterial({
        color: 0x566178,
        metalness: 0.85,
        roughness: 0.2
    });

    const purple = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    const waterMaterial = new THREE.MeshBasicMaterial({
        color: 0x43C9FF,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    function cylinder(parent, r1, r2, h, x, y, z, mat) {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(r1, r2, h, 32),
            mat
        );
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    function sphere(parent, r, x, y, z, mat) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(r, 12, 10),
            mat
        );
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    function box(parent, w, h, d, x, y, z, mat) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    // =====================================================
    // SECTION 02 // FUTURISTIC CENTRAL FOUNTAIN
    // =====================================================

    const fountain = new THREE.Group();
    fountain.name = "HEXCORE_CRYSTAL_FOUNTAIN";
    plazaExtras.add(fountain);

    // Outer black-marble basin.

    cylinder(fountain, 3.5, 3.7, 0.6, 0, 0.45, 0, dark);

    // Visible water surface.

    const waterSurface = cylinder(
        fountain, 3.05, 3.05, 0.05,
        0, 0.79, 0, waterMaterial
    );

    // Central pedestal.

    cylinder(fountain, 0.8, 1.1, 1.5, 0, 1.55, 0, silver);

    // Floating crystal.

    const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.MeshStandardMaterial({
            color: 0xB77BFF,
            emissive: 0x7020CC,
            emissiveIntensity: 1.5,
            metalness: 0.2,
            roughness: 0.15
        })
    );

    crystal.position.y = 3.5;
    fountain.add(crystal);

    // Glowing fountain rings.

    for (const [radius, height, mat] of [
        [3.5, 0.8, purple],
        [2.3, 0.9, cyan],
        [1.1, 2.5, purple]
    ]) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(radius, 0.07, 6, 48),
            mat
        );

        ring.rotation.x = Math.PI / 2;
        ring.position.y = height;
        fountain.add(ring);
    }

    // Animated water streams.
    // Lightweight water arcs made from curved tubes.

    const waterStreams = [];

    for (let i = 0; i < 8; i++) {

        const angle = (i / 8) * Math.PI * 2;

        const start = new THREE.Vector3(
            Math.sin(angle) * 0.9, 2.6,
            Math.cos(angle) * 0.9
        );

        const middle = new THREE.Vector3(
            Math.sin(angle) * 2.2, 3.6,
            Math.cos(angle) * 2.2
        );

        const end = new THREE.Vector3(
            Math.sin(angle) * 2.9, 0.9,
            Math.cos(angle) * 2.9
        );

        const curve = new THREE.QuadraticBezierCurve3(
            start, middle, end
        );

        const stream = new THREE.Mesh(
            new THREE.TubeGeometry(curve, 20, 0.045, 5, false),
            waterMaterial
        );

        fountain.add(stream);
        waterStreams.push(stream);
    }

    // =====================================================
    // SECTION 03 // DANCING COUPLE
    // =====================================================

    function createDancer(clothesColor, skinColor) {

        const dancer = new THREE.Group();

        const clothes = new THREE.MeshStandardMaterial({
            color: clothesColor,
            metalness: 0.25,
            roughness: 0.6
        });

        const skin = new THREE.MeshStandardMaterial({
            color: skinColor,
            roughness: 0.85
        });

        const hair = new THREE.MeshStandardMaterial({
            color: 0x211626,
            roughness: 0.8
        });

        // Legs.

        const leftLeg = new THREE.Group();
        const rightLeg = new THREE.Group();

        leftLeg.position.set(-0.17, 0.95, 0);
        rightLeg.position.set(0.17, 0.95, 0);

        cylinder(leftLeg, 0.11, 0.13, 0.85,
            0, -0.42, 0, dark);

        cylinder(rightLeg, 0.11, 0.13, 0.85,
            0, -0.42, 0, dark);

        dancer.add(leftLeg, rightLeg);

        // Torso and head.

        cylinder(dancer, 0.3, 0.26, 0.85,
            0, 1.42, 0, clothes);

        cylinder(dancer, 0.11, 0.11, 0.2,
            0, 1.96, 0, skin);

        sphere(dancer, 0.28, 0, 2.24, 0, skin);
        sphere(dancer, 0.28, 0, 2.39, -0.07, hair);

        // Animated arms.

        const leftArm = new THREE.Group();
        const rightArm = new THREE.Group();

        leftArm.position.set(-0.32, 1.77, 0);
        rightArm.position.set(0.32, 1.77, 0);

        cylinder(leftArm, 0.1, 0.09, 0.7,
            -0.15, -0.3, 0, clothes);

        cylinder(rightArm, 0.1, 0.09, 0.7,
            0.15, -0.3, 0, clothes);

        dancer.add(leftArm, rightArm);

        return {
            dancer, leftArm, rightArm,
            leftLeg, rightLeg
        };
    }

   
    // Male dancer wearing a formal blue suit.

    const dancerA = createDancer(
        0x294C79,
        0xB9856A
    );

    // Female dancer wearing a purple evening dress.

    const dancerB = createDancer(
        0x7529B8,
        0xD1A287
    );

    // Flowing dress skirt.

    const dressMaterial = new THREE.MeshStandardMaterial({
        color: 0x7529B8,
        metalness: 0.25,
        roughness: 0.5,
        side: THREE.DoubleSide
    });

    const dressSkirt = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.26,
            0.75,
            1.05,
            24
        ),
        dressMaterial
    );

    dressSkirt.position.set(0, 0.85, 0);

    dancerB.dancer.add(dressSkirt);

    // Longer hair framing the back of her head.

    const longHair = new THREE.Mesh(
        new THREE.SphereGeometry(0.31, 16, 12),
        new THREE.MeshStandardMaterial({
            color: 0x211626,
            roughness: 0.85
        })
    );

    longHair.scale.set(1, 1.45, 0.75);
    longHair.position.set(0, 2.12, -0.16);

    dancerB.dancer.add(longHair);


    // Dance just outside the central fountain basin.

    dancerA.dancer.position.set(5.5, 0.1, 2.0);
    dancerB.dancer.position.set(7.0, 0.1, 2.0);

    plazaExtras.add(
        dancerA.dancer,
        dancerB.dancer
    );

    // =====================================================
    // SECTION 04 // FIREWORK PARTICLE SYSTEM
    // =====================================================

    const fireworkColors = [
        0x8650E8,
        0x8CD6FD,
        0xE34BC9,
        0xE5AF69
    ];

    const fireworks = [];

    // Small reusable particle geometry.

    const particleGeometry =
        new THREE.SphereGeometry(0.13, 5, 4);

    function launchFirework() {

        // Keep the fireworks above the city,
        // away from the player's eye level.

        const x = (Math.random() - 0.5) * 100;
        const y = 42 + Math.random() * 32;
        const z = 90 + Math.random() * 120;

        const color = fireworkColors[
            Math.floor(Math.random() * fireworkColors.length)
        ];

        const particles = [];

        const particleMaterial =
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 1,
                depthWrite: false
            });

        for (let i = 0; i < 32; i++) {

            const particle = new THREE.Mesh(
                particleGeometry,
                particleMaterial
            );

            particle.position.set(x, y, z);
            scene.add(particle);

            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI;
            const speed = 5 + Math.random() * 7;

            particles.push({
                mesh: particle,
                velocity: new THREE.Vector3(
                    Math.cos(angle) * Math.cos(elevation) * speed,
                    Math.sin(elevation) * speed,
                    Math.sin(angle) * Math.cos(elevation) * speed
                )
            });
        }

        fireworks.push({
            particles,
            material: particleMaterial,
            age: 0,
            duration: 2.4
        });
    }

    // =====================================================
    // SECTION 05 // ANIMATION
    // =====================================================

    const clock = new THREE.Clock();

    let elapsed = 0;
    let nextFirework = 2;

    function animatePlazaExtras() {

        const delta = Math.min(clock.getDelta(), 0.05);
        elapsed += delta;

        // Fountain crystal movement.

        crystal.rotation.y += delta * 0.7;
        crystal.position.y = 3.5 + Math.sin(elapsed * 1.5) * 0.16;

        waterSurface.material.opacity =
            0.52 + Math.sin(elapsed * 2) * 0.07;

        for (let i = 0; i < waterStreams.length; i++) {
            waterStreams[i].material = waterMaterial;
        }

        // Paired dance motion.

        dancerA.dancer.rotation.y =
            elapsed * 0.65;

        dancerB.dancer.rotation.y =
            Math.PI + elapsed * 0.65;

        dancerA.dancer.position.y =
            0.1 + Math.abs(Math.sin(elapsed * 1.8)) * 0.06;

        dancerB.dancer.position.y =
            0.1 + Math.abs(Math.sin(elapsed * 1.8 + Math.PI)) * 0.06;

        for (const [dancer, phase] of [
            [dancerA, 0],
            [dancerB, Math.PI]
        ]) {
            dancer.leftArm.rotation.z =
                -0.5 + Math.sin(elapsed * 1.7 + phase) * 0.4;

            dancer.rightArm.rotation.z =
                0.5 - Math.sin(elapsed * 1.7 + phase) * 0.4;

            dancer.leftLeg.rotation.x =
                Math.sin(elapsed * 1.8 + phase) * 0.2;

            dancer.rightLeg.rotation.x =
                -Math.sin(elapsed * 1.8 + phase) * 0.2;
        }

        // Launch fireworks periodically.

        if (elapsed >= nextFirework) {
            launchFirework();
            nextFirework = elapsed + 4 + Math.random() * 2;
        }

        // Animate and remove completed fireworks.

        for (let i = fireworks.length - 1; i >= 0; i--) {

            const firework = fireworks[i];
            firework.age += delta;

            for (const particle of firework.particles) {

                particle.mesh.position.addScaledVector(
                    particle.velocity,
                    delta
                );

                particle.velocity.y -= delta * 4;
            }

            firework.material.opacity = Math.max(
                0,
                1 - firework.age / firework.duration
            );

            if (firework.age >= firework.duration) {

                for (const particle of firework.particles) {
                    scene.remove(particle.mesh);
                }

                firework.material.dispose();
                fireworks.splice(i, 1);
            }
        }
    }

    return animatePlazaExtras;
}
