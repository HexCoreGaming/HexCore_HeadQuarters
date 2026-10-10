
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

        if (window.hexcoreDialogueOpen === true) {
            return;
        }

        keys[event.code] = true;
    });

    window.addEventListener("keyup", (event) => {
        keys[event.code] = false;
    });

    // =====================================================
    // SECTION 04 // MOUSE LOOK
    // =====================================================

   
    renderer.domElement.addEventListener("click", (event) => {

        if (window.hexcoreDialogueOpen === true) {
            return;
        }

        // Mouse lock is desktop-only.
        // Touchscreen users use the look joystick.

        if (event.pointerType === "touch") {
            return;
        }

        if (window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        renderer.domElement.requestPointerLock();
    });


   
    // =====================================================
    // SECTION 04 // DESKTOP MOUSE CAMERA ONLY
    // =====================================================

    document.addEventListener("mousemove", (event) => {

        // Mobile devices use the dedicated look joystick.
        // Ignore touchscreen-generated mouse events.

        if (window.matchMedia("(pointer: coarse)").matches) {
            return;
        }

        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {
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
    // SECTION 04A // DISABLE CANVAS TOUCH CAMERA
    // =====================================================

    // Only the dedicated mobile look joystick
    // should control the camera on touchscreen devices.

    renderer.domElement.style.touchAction = "none";

    renderer.domElement.addEventListener(
        "pointerdown",
        (event) => {

            if (event.pointerType === "touch") {
                event.preventDefault();
            }
        }
    );

    renderer.domElement.addEventListener(
        "pointermove",
        (event) => {

            if (event.pointerType === "touch") {
                event.preventDefault();
            }
        }
    );

   
    // =====================================================
    // SECTION 04B // PLAYER COLLISION
    // =====================================================

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
    
        // =====================================================
        // SECTION 05A-1 // MOBILE LOOK JOYSTICK CAMERA
        // =====================================================

        if (
            window.hexcoreDialogueOpen !== true &&
            window.hexcoreMobileLook
        ) {

            // Camera sensitivity.
            // Lower these numbers for slower movement.

            
            const horizontalSensitivity = 1.4;
            const verticalSensitivity = 0.85;


            // Small movements near joystick center
            // should not rotate the camera.

            const deadzone = 0.12;

            const lookX = window.hexcoreMobileLook.x;
            const lookY = window.hexcoreMobileLook.y;

            const adjustedX =
                Math.abs(lookX) > deadzone ? lookX : 0;

            const adjustedY =
                Math.abs(lookY) > deadzone ? lookY : 0;

            // Frame-rate-independent camera movement.

            player.yaw -=
                adjustedX * horizontalSensitivity * delta;

            player.pitch -=
                adjustedY * verticalSensitivity * delta;

            player.pitch = THREE.MathUtils.clamp(
                player.pitch,
                -Math.PI / 2 + 0.1,
                Math.PI / 2 - 0.1
            );
        }

              // SECTION 05A // PAUSE DURING DIALOGUE

        if (window.hexcoreDialogueOpen === true) {

            for (const key in keys) {
                keys[key] = false;
            }

            if (window.hexcoreMobileInput) {
                window.hexcoreMobileInput.x = 0;
                window.hexcoreMobileInput.z = 0;
                window.hexcoreMobileInput.sprint = false;
            }

            if (window.hexcoreMobileLook) {
                window.hexcoreMobileLook.x = 0;
                window.hexcoreMobileLook.y = 0;
            }

            return;
        }


      
        // =====================================================
        // SECTION 05B // DESKTOP AND MOBILE MOVEMENT INPUT
        // =====================================================

        const movement = new THREE.Vector3();

        // Desktop keyboard controls

        if (keys["KeyW"]) movement.z -= 1;
        if (keys["KeyS"]) movement.z += 1;
        if (keys["KeyA"]) movement.x -= 1;
        if (keys["KeyD"]) movement.x += 1;

        // Mobile joystick controls

        const mobileInput = window.hexcoreMobileInput;

        if (mobileInput) {
            movement.x += mobileInput.x;
            movement.z += mobileInput.z;
        }

        // SECTION 05C // COLLISION-AWARE MOVEMENT

        if (movement.lengthSq() > 0) {

            movement.normalize();

            movement.applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                player.yaw
            );

           
            // SECTION 05C-0 // DESKTOP AND MOBILE SPRINT

            const sprinting =
                keys["ShiftLeft"] ||
                keys["ShiftRight"] ||
                window.hexcoreMobileInput?.sprint === true;

            const speed =
                sprinting
                    ? player.sprintSpeed
                    : player.speed;


            const stepX = movement.x * speed * delta;
            const stepZ = movement.z * speed * delta;

            // SECTION 05C-1 // X-AXIS MOVEMENT

            const nextX = player.position.x + stepX;

            if (
                !collidesWithPillar(nextX, player.position.z) &&
                !collidesWithPlatform(nextX, player.position.z) &&
                !collidesWithReception(nextX, player.position.z)
            ) {
                player.position.x = nextX;
            }

            // SECTION 05C-2 // Z-AXIS MOVEMENT

            const nextZ = player.position.z + stepZ;

            const cityDoorReady =
                window.hexcoreDoorUnlocked === true &&
                (window.hexcoreExitOpenProgress || 0) > 0.95;

            // The entrance is centered at X = 0.
            // Only an opened door allows crossing.

            const insideDoorway =
                Math.abs(player.position.x) < 4.0;

            const crossingFrontWall =
                (
                    player.position.z <= 30.3 &&
                    nextZ >= 27.7
                ) ||
                (
                    player.position.z >= 27.7 &&
                    nextZ <= 30.3
                );

            const blockedByFrontExit =
                crossingFrontWall &&
                (!insideDoorway || !cityDoorReady);

            if (
                !collidesWithPillar(player.position.x, nextZ) &&
                !collidesWithPlatform(player.position.x, nextZ) &&
                !collidesWithReception(player.position.x, nextZ) &&
                !blockedByFrontExit
            ) {
                player.position.z = nextZ;
            }
        }

        // =====================================================
        // SECTION 05D // HEADQUARTERS AND CITY BOUNDARIES
        // =====================================================

        player.position.x = THREE.MathUtils.clamp(
            player.position.x,
            -28,
            28
        );

        const cityAccessEnabled =
            window.hexcoreDoorUnlocked === true &&
            (window.hexcoreExitOpenProgress || 0) > 0.95;

        const maximumZ =
            cityAccessEnabled ? 205 : 28;

        player.position.z = THREE.MathUtils.clamp(
            player.position.z,
            -28,
            maximumZ
        );

        // =====================================================
        // SECTION 05E // CAMERA UPDATE
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
        // SECTION 05F // PLAYER POSITION NOTIFICATION
        // =====================================================

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
