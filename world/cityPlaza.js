
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // CITY SOCIAL PLAZA
// =====================================================

export function createCityPlaza(scene) {

    // =====================================================
    // SECTION 01 // PLAZA POSITION
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

    const cartMetal = new THREE.MeshStandardMaterial({
        color: 0x25233B,
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

    const gold = new THREE.MeshBasicMaterial({
        color: 0xE5AF69
    });

    const glass = new THREE.MeshStandardMaterial({
        color: 0x254A70,
        metalness: 0.25,
        roughness: 0.18,
        transparent: true,
        opacity: 0.8
    });

    // =====================================================
    // SECTION 03 // GEOMETRY HELPERS
    // =====================================================

    function makeBox(
        parent,
        width,
        height,
        depth,
        x,
        y,
        z,
        material
    ) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function makeCylinder(
        parent,
        top,
        bottom,
        height,
        x,
        y,
        z,
        material,
        sides = 12
    ) {

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                top,
                bottom,
                height,
                sides
            ),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    // =====================================================
    // SECTION 04 // CIRCULAR BLACK MARBLE PLAZA
    // =====================================================

    makeCylinder(
        plaza,
        17,
        17,
        0.15,
        0,
        0.04,
        0,
        marble,
        48
    );

    // =====================================================
    // SECTION 05 // ILLUMINATED FLOOR RINGS
    // =====================================================

    function floorRing(
        radius,
        material,
        thickness = 0.08
    ) {

        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(
                radius,
                thickness,
                6,
                64
            ),
            material
        );

        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = 0.14;

        plaza.add(mesh);

        return mesh;
    }

    floorRing(16.5, purple, 0.13);
    floorRing(14.7, cyan, 0.055);
    floorRing(8.5, magenta, 0.07);
    floorRing(5, cyan, 0.1);

    // =====================================================
    // SECTION 06 // MARBLE FLOOR PATTERNS
    // =====================================================

    for (let i = 0; i < 12; i++) {

        const angle = i * Math.PI / 6;

        const line = makeBox(
            plaza,
            0.06,
            0.025,
            6,
            Math.sin(angle) * 11.6,
            0.14,
            Math.cos(angle) * 11.6,
            i % 2 === 0 ? purple : cyan
        );

        line.rotation.y = angle;
    }

    // =====================================================
    // SECTION 07 // CENTRAL PERFORMANCE AREA
    // =====================================================

    const centerDisc = makeCylinder(
        plaza,
        4.7,
        4.7,
        0.035,
        0,
        0.145,
        0,
        new THREE.MeshStandardMaterial({
            color: 0x241A37,
            metalness: 0.55,
            roughness: 0.27
        }),
        40
    );

    centerDisc.name = "FUTURE_FOUNTAIN_AND_DANCE_AREA";

    // =====================================================
    // SECTION 08 // FUTURISTIC BENCHES
    // =====================================================

    function createBench(x, z, rotation) {

        const bench = new THREE.Group();

        bench.position.set(x, 0, z);
        bench.rotation.y = rotation;

        makeBox(
            bench,
            4, 0.32, 1,
            0, 0.85, 0,
            darkMetal
        );

        makeBox(
            bench,
            4, 1, 0.2,
            0, 1.35, -0.45,
            darkMetal
        );

        makeBox(
            bench,
            3.8, 0.1, 0.85,
            0, 0.62, 0,
            cyan
        );

        for (const side of [-1.5, 1.5]) {

            makeBox(
                bench,
                0.25, 0.75, 0.75,
                side, 0.38, 0,
                darkMetal
            );
        }

        plaza.add(bench);
    }

    createBench(-12.5, -5.5, Math.PI / 3);
    createBench(12.5, -5.5, -Math.PI / 3);
    createBench(-12.5, 6, -Math.PI / 3);
    createBench(12.5, 6, Math.PI / 3);

    // =====================================================
    // SECTION 09 // ACCENT LIGHT PILLARS
    // =====================================================

    function createLightPillar(x, z, glow) {

        const group = new THREE.Group();
        group.position.set(x, 0, z);

        makeCylinder(
            group,
            0.45, 0.6, 0.55,
            0, 0.3, 0,
            darkMetal, 8
        );

        makeCylinder(
            group,
            0.13, 0.13, 3.2,
            0, 2.1, 0,
            glow, 8
        );

        const crown = new THREE.Mesh(
            new THREE.ConeGeometry(
                0.45, 0.8, 6
            ),
            darkMetal
        );

        crown.position.y = 4;
        group.add(crown);

        plaza.add(group);
    }

    createLightPillar(-10, -10, purple);
    createLightPillar(10, -10, cyan);
    createLightPillar(-10, 10, cyan);
    createLightPillar(10, 10, purple);

    // =====================================================
    // SECTION 10 // FUTURE PLAZA ACTIVITIES
    // =====================================================

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

        fountain: {
            x: 0,
            z: 65
        },

        fireworksView: {
            x: 0,
            z: 72
        }
    };

    // =====================================================
    // SECTION 11 // HEXCORE BITES FOOD CART
    // =====================================================

    const foodCart = new THREE.Group();

    foodCart.name = "HEXCORE_BITES_CART";
    foodCart.position.set(-10, 0, 0);

    // Face the cart toward the plaza entrance.
    foodCart.rotation.y = Math.PI / 2;

    plaza.add(foodCart);

    // =====================================================
    // SECTION 11A // CART BODY AND COUNTER
    // =====================================================

    makeBox(
        foodCart,
        4.5, 1.35, 2.4,
        0, 0.85, 0,
        cartMetal
    );

    makeBox(
        foodCart,
        4.9, 0.18, 2.7,
        0, 1.65, 0,
        darkMetal
    );

    makeBox(
        foodCart,
        4.3, 0.12, 0.16,
        0, 1.15, 1.27,
        cyan
    );

    // =====================================================
    // SECTION 11B // CANOPY AND SUPPORTS
    // =====================================================

    for (const x of [-2, 2]) {

        makeBox(
            foodCart,
            0.15, 3.2, 0.15,
            x, 3.2, -0.85,
            darkMetal
        );
    }

    makeBox(
        foodCart,
        5.5, 0.35, 3.3,
        0, 4.75, -0.2,
        cartMetal
    );

    makeBox(
        foodCart,
        5.2, 0.12, 0.2,
        0, 4.55, 1.38,
        magenta
    );

    // =====================================================
    // SECTION 11C // ILLUMINATED SIGN
    // =====================================================

    const signCanvas = document.createElement("canvas");

    signCanvas.width = 1024;
    signCanvas.height = 256;

    const ctx = signCanvas.getContext("2d");

    ctx.fillStyle = "#0D0B1D";
    ctx.fillRect(0, 0, 1024, 256);

    ctx.strokeStyle = "#8CD6FD";
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, 1008, 240);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#E8D9FF";
    ctx.font = "bold 76px Arial";

    ctx.fillText(
        "HEXCORE BITES",
        512,
        92
    );

    ctx.fillStyle = "#8CD6FD";
    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "FREE FOOD + DRINKS",
        512,
        184
    );

    const signTexture = new THREE.CanvasTexture(
        signCanvas
    );

    signTexture.colorSpace = THREE.SRGBColorSpace;

    const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 1.3),
        new THREE.MeshBasicMaterial({
            map: signTexture,
            side: THREE.DoubleSide,
            depthTest: true,
            depthWrite: true
        })
    );

    signMesh.position.set(0, 3.85, 1.48);

    foodCart.add(signMesh);

    // =====================================================
    // SECTION 11D // DISPLAYED FREE MEALS
    // =====================================================

    for (const x of [-1.3, 0, 1.3]) {

        makeBox(
            foodCart,
            0.75, 0.24, 0.65,
            x, 1.88, 0.55,
            gold
        );
    }

    // =====================================================
    // SECTION 11E // DISPLAYED DRINKS
    // =====================================================

    for (const x of [-0.65, 0.65]) {

        makeCylinder(
            foodCart,
            0.22, 0.18, 0.7,
            x, 2.08, -0.35,
            purple
        );
    }

    // =====================================================
    // SECTION 12 // FOOD VENDOR NPC
    // =====================================================

    const vendor = new THREE.Group();

    vendor.name = "HEXCORE_BITES_VENDOR";
    vendor.position.set(0, 0, -2.1);

    foodCart.add(vendor);

    const vendorClothing =
        new THREE.MeshStandardMaterial({
            color: 0x38236B,
            roughness: 0.65
        });

    const vendorSkin =
        new THREE.MeshStandardMaterial({
            color: 0xB9876D,
            roughness: 0.85
        });

    const vendorHair =
        new THREE.MeshStandardMaterial({
            color: 0x15111E,
            roughness: 0.8
        });

    // Legs

    for (const x of [-0.22, 0.22]) {

        makeCylinder(
            vendor,
            0.13, 0.16, 1,
            x, 0.55, 0,
            darkMetal, 8
        );
    }

    // Torso

    makeCylinder(
        vendor,
        0.36, 0.28, 0.95,
        0, 1.5, 0,
        vendorClothing
    );

    // Head

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.32, 16, 12
        ),
        vendorSkin
    );

    head.position.y = 2.3;
    vendor.add(head);

    // Hair

    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.33, 16, 12
        ),
        vendorHair
    );

    hair.scale.y = 0.42;
    hair.position.y = 2.52;

    vendor.add(hair);

    // Arms

    for (const x of [-0.47, 0.47]) {

        const arm = makeCylinder(
            vendor,
            0.12, 0.11, 0.8,
            x, 1.52, 0.1,
            vendorClothing, 8
        );

        arm.rotation.z = x < 0 ? -0.3 : 0.3;
    }

    // =====================================================
    // SECTION 13 // FOOD CART INTERACTION UI
    // =====================================================

    let foodCartNearby = false;
    let messageTimer = null;

    const cartWorldPosition = new THREE.Vector3();

    const foodPrompt = document.createElement("button");

    foodPrompt.type = "button";

    Object.assign(foodPrompt.style, {
        position: "fixed",
        bottom: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(8,7,23,0.94)",
        color: "#8CD6FD",
        border: "1px solid #8650E8",
        padding: "12px 18px",
        fontFamily: "Consolas, monospace",
        fontSize: "13px",
        zIndex: "150",
        display: "none",
        textAlign: "center",
        cursor: "pointer",
        touchAction: "manipulation",
        maxWidth: "90vw"
    });

    document.body.appendChild(foodPrompt);

    const foodMessage = document.createElement("div");

    Object.assign(foodMessage.style, {
        position: "fixed",
        top: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(8,7,23,0.95)",
        color: "#E8D9FF",
        border: "1px solid #8CD6FD",
        padding: "20px",
        fontFamily: "Consolas, monospace",
        fontSize: "14px",
        textAlign: "center",
        zIndex: "200",
        display: "none",
        width: "min(330px, 85vw)",
        pointerEvents: "none"
    });

    document.body.appendChild(foodMessage);

    // =====================================================
    // SECTION 14 // RECEIVE COMPLIMENTARY FOOD
    // =====================================================

    function receiveComplimentaryMeal() {

        if (!foodCartNearby) {
            return;
        }

        if (window.hexcoreDialogueOpen === true) {
            return;
        }

        foodMessage.textContent =
            "HEXCORE BITES // ENJOY YOUR FREE MEAL AND DRINK!";

        foodMessage.style.display = "block";

        if (messageTimer !== null) {
            clearTimeout(messageTimer);
        }

        messageTimer = setTimeout(() => {
            foodMessage.style.display = "none";
            messageTimer = null;
        }, 3500);
    }

    // Desktop keyboard interaction.

    window.addEventListener(
        "keydown",
        event => {

            if (
                event.code === "KeyE" &&
                !event.repeat
            ) {
                receiveComplimentaryMeal();
            }
        }
    );

    // Mobile button interaction.

    foodPrompt.addEventListener(
        "pointerdown",
        event => {
            event.stopPropagation();
        }
    );

    foodPrompt.addEventListener(
        "click",
        event => {

            event.stopPropagation();
            receiveComplimentaryMeal();
        }
    );

    // =====================================================
    // SECTION 15 // PLAYER PROXIMITY DETECTION
    // =====================================================

    window.addEventListener(
        "hexcore-player-position",
        event => {

            foodCart.getWorldPosition(
                cartWorldPosition
            );

            const dx =
                event.detail.x - cartWorldPosition.x;

            const dz =
                event.detail.z - cartWorldPosition.z;

            const distance = Math.hypot(dx, dz);

            foodCartNearby = distance < 5.5;

            const mobile = window.matchMedia(
                "(pointer: coarse)"
            ).matches;

            foodPrompt.textContent = mobile
                ? "TAP // FREE MEAL + DRINK"
                : "E // GET FREE MEAL + DRINK";

            foodPrompt.style.display =
                foodCartNearby &&
                window.hexcoreDialogueOpen !== true
                    ? "block"
                    : "none";
        }
    );

    // =====================================================
    // SECTION 16 // PLAZA ANIMATION
    // =====================================================

    function animateCityPlaza() {

        // Future additions:
        // Violinist animations
        // Dancing couple
        // Fountain water
        // Fireworks
    }

    // =====================================================
    // SECTION 17 // OUTPUT
    // =====================================================

    return animateCityPlaza;
}
