
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // PLAYER CHARACTER SYSTEM
// =====================================================

// =====================================================
// SECTION 01 // CHARACTER CONTROLS
// =====================================================

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

    // =====================================================
    // SECTION 02 // FIRST-PERSON CAMERA
    // =====================================================

    camera.rotation.order = "YXZ";

    camera.position.set(
        player.position.x,
        player.height,
        player.position.z
    );

    // =====================================================
    // SECTION 03 // KEYBOARD INPUT
    // =====================================================

    window.addEventListener("keydown", (event) => {
        keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.code] = false;
    });

    // =====================================================
    // SECTION 04 // MOUSE LOOK
    // =====================================================

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

            if (
                dx * dx + dz * dz <
                playerRadius * playerRadius
            ) {
                return true;
            }
        }

        return false;
    }

    // =====================================================
    // SECTION 04C // CENTRAL PLATFORM COLLISION
    // =====================================================

    const platformRadius = 5;

    function collidesWithPlatform(x, z) {

        const distanceSquared = x * x + z * z;

        const collisionDistance =
            platformRadius + playerRadius;

        return distanceSquared <
            collisionDistance * collisionDistance;
    }

    // =====================================================
    // SECTION 04D // RECEPTION DESK COLLISION
    // =====================================================

    // Matches the reception desk and wider desktop
    // located at X = 0, Z = -24.

    function collidesWithReception(x, z) {

        const deskMinX = -6.25;
        const deskMaxX = 6.25;

        const deskMinZ = -25.5;
        const deskMaxZ = -22.5;

        const closestX = THREE.MathUtils.clamp(
            x,
            deskMinX,
            deskMaxX
        );

        const closestZ = THREE.MathUtils.clamp(
            z,
            deskMinZ,
            deskMaxZ
        );

        const dx = x - closestX;
        const dz = z - closestZ;

        return (
            dx * dx + dz * dz <
            playerRadius * playerRadius
        );
    }

    // =====================================================
    // SECTION 05 // MOVEMENT AND CAMERA UPDATE
    // =====================================================

    const clock = new THREE.Clock();

    function updatePlayer() {

        const delta = Math.min(clock.getDelta(), 0.05);

        // SECTION 05A // PAUSE MOVEMENT DURING DIALOGUE

        if (window.hexcoreDialogueOpen === true) {

            for (const key in keys) {
                keys[key] = false;
            }

            return;
        }

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

            const stepX = movement.x * speed * delta;
            const stepZ = movement.z * speed * delta;

            // =====================================================
            // SECTION 05A // COLLISION-AWARE MOVEMENT
            // =====================================================

            // X-axis movement

            const nextX = player.position.x + stepX;

            if (
                !collidesWithPillar(nextX, player.position.z) &&
                !collidesWithPlatform(nextX, player.position.z) &&
                !collidesWithReception(nextX, player.position.z)
            ) {
                player.position.x = nextX;
            }

           
            // Z-axis movement

            const nextZ = player.position.z + stepZ;

            // Check if the reception key has been granted
            // and the exit doors have finished opening.

            const cityDoorReady =
                window.hexcoreHasCityKey === true &&
                (window.hexcoreExitOpenProgress || 0) > 0.95;

            // Stop players crossing the front wall anywhere
            // except through the central doorway.

            const insideDoorway =
                Math.abs(player.position.x) < 4.0;

            const insideFrontWall =
                nextZ > 27.7 &&
                nextZ < 30.3;

            const blockedByFrontExit =
                insideFrontWall &&
                (!insideDoorway || !cityDoorReady);

            if (
                !collidesWithPillar(player.position.x, nextZ) &&
                !collidesWithPlatform(player.position.x, nextZ) &&
                !collidesWithReception(player.position.x, nextZ) &&
                !blockedByFrontExit
            ) {
                player.position.z = nextZ;
            }


        // =====================================================
        // SECTION 05B // ROOM BOUNDARIES
        // =====================================================

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

        // SECTION 05B // HEADQUARTERS AND CITY BOUNDARIES

        const cityAccessEnabled =
            window.hexcoreHasCityKey === true &&
            (window.hexcoreExitOpenProgress || 0) > 0.95;

        // Visitors without a key remain inside HQ.
        // Authorized visitors can explore the exterior.

        const maximumZ =
            cityAccessEnabled ? 205 : 28;

        player.position.z = THREE.MathUtils.clamp(
            player.position.z,
            -28,
            maximumZ
        );

        // =====================================================
        // SECTION 05C // CAMERA UPDATE
        // =====================================================

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
        
        // =====================================================
        // SECTION 05D // PLAYER POSITION NOTIFICATION
        // =====================================================

        // Tell the interface where the player is standing.
        // Used by the headquarters exit access system.

        window.dispatchEvent(
            new CustomEvent("hexcore-player-position", {
                detail: {
                    x: player.position.x,
                    z: player.position.z
                }
            })
        );

    }

    // =====================================================
    // SECTION 06 // PLAYER SYSTEM OUTPUT
    // =====================================================

    return updatePlayer;
}
