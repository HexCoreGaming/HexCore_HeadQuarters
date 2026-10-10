
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // NPC CHARACTER SYSTEM
// =====================================================

// =====================================================
// SECTION 01 // CREATE HEADQUARTERS NPCS
// =====================================================

export function createNPCs(scene) {

    // =====================================================
    // SECTION 02 // CHARACTER MATERIALS
    // =====================================================

    const uniformMaterial = new THREE.MeshStandardMaterial({
        color: 0x191528,
        metalness: 0.45,
        roughness: 0.45
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xBA8F7D,
        roughness: 0.75
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
        color: 0x17111F,
        roughness: 0.65
    });

    const purpleTrim = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyanTrim = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // =====================================================
    // SECTION 03 // RECEPTION REPRESENTATIVE
    // =====================================================

    const receptionist = new THREE.Group();

    // Desk is centered at Z = -24.
    // Receptionist stands behind the desk.

    receptionist.position.set(0, 0, -26.2);

    // SECTION 03A // LOWER BODY

    const legs = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.38, 1.0, 10),
        uniformMaterial
    );

    legs.position.y = 0.5;
    receptionist.add(legs);

    // SECTION 03B // UPPER BODY

    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.25, 0.85, 10),
        uniformMaterial
    );

    torso.position.y = 1.38;
    receptionist.add(torso);

    // SECTION 03C // HEAD

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 16, 12),
        skinMaterial
    );

    head.position.y = 2.04;
    receptionist.add(head);

    // SECTION 03D // HAIR

    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.28,
            16,
            12,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        ),
        hairMaterial
    );

    hair.position.y = 2.11;
    receptionist.add(hair);

    // SECTION 03E // ARMS

    for (const x of [-0.42, 0.42]) {

        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.09, 0.68, 8),
            uniformMaterial
        );

        arm.position.set(x, 1.38, 0);
        arm.rotation.z = x < 0 ? -0.14 : 0.14;

        receptionist.add(arm);
    }

    // SECTION 03F // UNIFORM LIGHTING

    const chestTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.05, 0.06),
        purpleTrim
    );

    chestTrim.position.set(0, 1.58, 0.28);
    receptionist.add(chestTrim);

    const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.14, 0.05),
        cyanTrim
    );

    badge.position.set(-0.15, 1.68, 0.25);
    receptionist.add(badge);

    // =====================================================
    // SECTION 04 // RECEPTIONIST NAME DISPLAY
    // =====================================================

    const nameCanvas = document.createElement("canvas");
    nameCanvas.width = 1024;
    nameCanvas.height = 256;

    const nameContext = nameCanvas.getContext("2d");

    nameContext.clearRect(0, 0, 1024, 256);

    nameContext.textAlign = "center";
    nameContext.textBaseline = "middle";

    nameContext.fillStyle = "#8CD6FD";
    nameContext.font = "bold 70px Consolas";

    nameContext.fillText(
        "RECEPTION REPRESENTATIVE",
        512,
        128
    );

    const nameTexture = new THREE.CanvasTexture(nameCanvas);
    nameTexture.colorSpace = THREE.SRGBColorSpace;

    const nameDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 0.95),
        new THREE.MeshBasicMaterial({
            map: nameTexture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );

    nameDisplay.position.set(0, 2.95, 0);
    receptionist.add(nameDisplay);

    // Face toward the visitor side of the desk.
    scene.add(receptionist);

    // =====================================================
    // SECTION 05 // NPC ANIMATION
    // =====================================================

    const clock = new THREE.Clock();

    function updateNPCs() {

        const time = clock.getElapsedTime();

        // Gentle idle movement

        torso.rotation.z = Math.sin(time * 1.3) * 0.025;
        head.rotation.y = Math.sin(time * 0.7) * 0.12;

        // Subtle uniform accent pulse

        const pulse = 0.85 + Math.sin(time * 1.7) * 0.15;
        chestTrim.scale.x = pulse;
    }

    // =====================================================
    // SECTION 06 // NPC SYSTEM OUTPUT
    // =====================================================

    return updateNPCs;
}
