
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // PLAYER CHARACTER SYSTEM
// =====================================================

// SECTION 01 // CHARACTER CONTROLS

export function createPlayer(camera, renderer) {

    const keys = {};

    const player = {
        speed: 8,
        sprintSpeed: 14,
        height: 1.8,
        position: new THREE.Vector3(0, 0, 15),
        yaw: 0,
        pitch: 0
    };

    // SECTION 02 // FIRST-PERSON CAMERA

    camera.rotation.order = "YXZ";

    camera.position.set(
        player.position.x,
        player.height,
        player.position.z
    );

    // SECTION 03 // KEYBOARD INPUT

    window.addEventListener("keydown", (event) => {
        keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.code] = false;
    });

    // SECTION 04 // MOUSE LOOK

    renderer.domElement.addEventListener("click", () => {
        renderer.domElement.requestPointerLock();
    });

    document.addEventListener("mousemove", (event) => {

        if (document.pointerLockElement !== renderer.domElement) {
            return;
        }

        player.yaw -= event.movementX * 0.002;
        player.pitch -= event.movementY * 0.002;

        player.pitch = THREE.MathUtils.clamp(
            player.pitch,
            -Math.PI / 2 + 0.1,
            Math.PI / 2 - 0.1
        );
    });
// =====================================================
// SECTION 04B // PLAYER COLLISION
// =====================================================

// Four existing lobby pillar positions
const pillars = [
    { x: -20, z: -18 },
    { x: -20, z: 18 },
    { x: 20, z: -18 },
    { x: 20, z: 18 }
];

const playerRadius = 0.5;
const pillarHalfWidth = 1;

    // =====================================================
// SECTION 04C // CENTRAL PLATFORM COLLISION
// =====================================================

// Central circular platform:
// Radius = 5 units
// Player collision radius = 0.5 units

const platformRadius = 5;

function collidesWithPlatform(x, z) {

    const distanceSquared = x * x + z * z;

    const collisionDistance =
        platformRadius + playerRadius;

    return distanceSquared <
        collisionDistance * collisionDistance;
}

function collidesWithPillar(x, z) {

    for (const pillar of pillars) {

        const closestX = THREE.MathUtils.clamp(
            x,
            pillar.x - pillarHalfWidth,
            pillar.x + pillarHalfWidth
        );

        const closestZ = THREE.MathUtils.clamp(
            z,
            pillar.z - pillarHalfWidth,
            pillar.z + pillarHalfWidth
        );

        const dx = x - closestX;
        const dz = z - closestZ;

        if (dx * dx + dz * dz < playerRadius * playerRadius) {
            return true;
        }
    }

    return false;
}
    // SECTION 05 // MOVEMENT AND CAMERA UPDATE

    const clock = new THREE.Clock();

    function updatePlayer() {

        const delta = Math.min(clock.getDelta(), 0.05);

        const movement = new THREE.Vector3();

        if (keys["KeyW"]) movement.z -= 1;
        if (keys["KeyS"]) movement.z += 1;
        if (keys["KeyA"]) movement.x -= 1;
        if (keys["KeyD"]) movement.x += 1;

        if (movement.lengthSq() > 0) {

            movement.normalize();

            movement.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                player.yaw
            );

            const speed =
                keys["ShiftLeft"] || keys["ShiftRight"]
                    ? player.sprintSpeed
                    : player.speed;

            // Test X and Z separately to allow sliding along pillars

const stepX = movement.x * speed * delta;
const stepZ = movement.z * speed * delta;

// =====================================================
// SECTION 05A // COLLISION-AWARE MOVEMENT
// =====================================================

// Horizontal movement

const nextX = player.position.x + stepX;

if (
    !collidesWithPillar(nextX, player.position.z) &&
    !collidesWithPlatform(nextX, player.position.z)
) {
    player.position.x = nextX;
}

// Forward / backward movement

const nextZ = player.position.z + stepZ;

if (
    !collidesWithPillar(player.position.x, nextZ) &&
    !collidesWithPlatform(player.position.x, nextZ)
) {
    player.position.z = nextZ;
}

        // Temporary room boundaries
        player.position.x = THREE.MathUtils.clamp(
            player.position.x,
            -28,
            28
        );

        player.position.z = THREE.MathUtils.clamp(
            player.position.z,
            -28,
            28
        );

        camera.position.set(
            player.position.x,
            player.height,
            player.position.z
        );

        camera.rotation.set(
            player.pitch,
            player.yaw,
            0
        );
    }

    // SECTION 06 // PLAYER SYSTEM OUTPUT

    return updatePlayer;
}
