
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
    // SECTION 09A // HEXCORE COMPLIMENTARY FOOD CART
    // =====================================================

    const foodCart = new THREE.Group();

    // Left side of the plaza.
    // Coordinates are relative to the plaza center.

    foodCart.position.set(-10, 0, 0);
    foodCart.rotation.y = Math.PI / 2;

    plaza.add(foodCart);

    // SECTION 09B // FOOD CART MATERIALS

    const cartMetal = new THREE.MeshStandardMaterial({
        color: 0x25233B,
        metalness: 0.8,
        roughness: 0.3
    });

    const cartGlass = new THREE.MeshStandardMaterial({
        color: 0x263E60,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7
    });

    function cartBox(w, h, d, x, y, z, mat) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );

        mesh.position.set(x, y, z);
        foodCart.add(mesh);

        return mesh;
    }

    // SECTION 09C // CART COUNTER

    cartBox(
        4.5, 1.35, 2.4,
        0, 0.85, 0,
        cartMetal
    );

    cartBox(
        4.9, 0.18, 2.7,
        0, 1.65, 0,
        darkMetal
    );

    cartBox(
        4.3, 0.12, 0.16,
        0, 1.15, 1.27,
        cyan
    );

    // SECTION 09D // UPPER CANOPY

    for (const x of [-2, 2]) {

        cartBox(
            0.15, 3.2, 0.15,
            x, 3.2, -0.85,
            darkMetal
        );
    }

    cartBox(
        5.5, 0.35, 3.3,
        0, 4.75, -0.2,
        cartMetal
    );

    cartBox(
        5.2, 0.12, 0.2,
        0, 4.55, 1.38,
        magenta
    );

    // SECTION 09E // ILLUMINATED FOOD CART SIGN

    const foodSignCanvas = document.createElement("canvas");

    foodSignCanvas.width = 1024;
    foodSignCanvas.height = 256;

    const foodCtx = foodSignCanvas.getContext("2d");

    foodCtx.fillStyle = "#0D0B1D";
    foodCtx.fillRect(0, 0, 1024, 256);

    foodCtx.strokeStyle = "#8CD6FD";
    foodCtx.lineWidth = 12;
    foodCtx.strokeRect(8, 8, 1008, 240);

    foodCtx.textAlign = "center";
    foodCtx.textBaseline = "middle";

    foodCtx.fillStyle = "#E8D9FF";
    foodCtx.font = "bold 76px Arial";

    foodCtx.fillText(
        "HEXCORE BITES",
        512, 92
    );

    foodCtx.fillStyle = "#8CD6FD";
    foodCtx.font = "bold 42px Arial";

    foodCtx.fillText(
        "FREE FOOD + DRINKS",
        512, 184
    );

    const foodTexture = new THREE.CanvasTexture(
        foodSignCanvas
    );

    foodTexture.colorSpace = THREE.SRGBColorSpace;

    const foodSign = new THREE.Mesh(
        new THREE.PlaneGeometry(5.2, 1.3),
        new THREE.MeshBasicMaterial({
            map: foodTexture,
            side: THREE.DoubleSide,
            depthTest: true
        })
    );

    foodSign.position.set(0, 3.85, 1.48);

    foodCart.add(foodSign);

    // SECTION 09F // FOOD AND DRINK DISPLAY

    for (const x of [-1.3, 0, 1.3]) {

        const meal = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.24, 0.65),
            gold
        );

        meal.position.set(
            x, 1.88, 0.55
        );

        foodCart.add(meal);
    }

    for (const x of [-0.65, 0.65]) {

        const drink = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.22, 0.18, 0.7, 12
            ),
            purple
        );

        drink.position.set(
            x, 2.08, -0.35
        );

        foodCart.add(drink);
    }

    // =====================================================
    // SECTION 09G // FOOD VENDOR NPC
    // =====================================================

    const vendor = new THREE.Group();

    // Vendor stands behind the serving counter.

    vendor.position.set(0, 0, -2.1);

    foodCart.add(vendor);

    const vendorClothing = new THREE.MeshStandardMaterial({
        color: 0x38236B,
        metalness: 0.25,
        roughness: 0.65
    });

    const vendorSkin = new THREE.MeshStandardMaterial({
        color: 0xB9876D,
        roughness: 0.85
    });

    const vendorHair = new THREE.MeshStandardMaterial({
        color: 0x15111E,
        roughness: 0.8
    });

    // Legs

    for (const x of [-0.22, 0.22]) {

        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.13, 0.16, 1.0, 8
            ),
            darkMetal
        );

        leg.position.set(x, 0.55, 0);

        vendor.add(leg);
    }

    // Torso

    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.36, 0.28, 0.95, 12
        ),
        vendorClothing
    );

    torso.position.y = 1.5;

    vendor.add(torso);

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

        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.12, 0.11, 0.8, 8
            ),
            vendorClothing
        );

        arm.position.set(x, 1.52, 0.1);

        arm.rotation.z = x < 0 ? -0.3 : 0.3;

        vendor.add(arm);
    }

    // =====================================================
    // SECTION 09H // FOOD CART INTERACTION
    // =====================================================

    let foodCartNearby = false;

    const foodCartWorldPosition = new THREE.Vector3();

    const foodPrompt = document.createElement("div");

    foodPrompt.textContent = "E // GET FREE MEAL + DRINK";

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
        touchAction: "manipulation"
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

    let foodMessageTimer;

    function receiveComplimentaryMeal() {

        if (!foodCartNearby) {
            return;
        }

        foodMessage.textContent =
            "HEXCORE BITES // ENJOY YOUR FREE MEAL AND DRINK!";

        foodMessage.style.display = "block";

        clearTimeout(foodMessageTimer);

        foodMessageTimer = setTimeout(() => {
            foodMessage.style.display = "none";
        }, 3500);
    }

    window.addEventListener("keydown", event => {

        if (
            event.code === "KeyE" &&
            !event.repeat &&
            window.hexcoreDialogueOpen !== true
        ) {
            receiveComplimentaryMeal();
        }
    });

    // Mobile players can tap the prompt.

    foodPrompt.addEventListener(
        "pointerdown",
        event => {
            event.stopPropagation();
        }
    );

    foodPrompt.addEventListener(
        "click",
        receiveComplimentaryMeal
    );

    // =====================================================
    // SECTION 09I // FOOD CART PROXIMITY DETECTION
    // =====================================================

    window.addEventListener(
        "hexcore-player-position",
        event => {

            foodCart.getWorldPosition(
                foodCartWorldPosition
            );

            const distance = Math.hypot(
                event.detail.x - foodCartWorldPosition.x,
                event.detail.z - foodCartWorldPosition.z
            );

            foodCartNearby = distance < 5.5;

            foodPrompt.style.display =
                foodCartNearby ? "block" : "none";

            const isMobile = window.matchMedia(
                "(pointer: coarse)"
            ).matches;

            foodPrompt.textContent = isMobile
                ? "TAP // FREE MEAL + DRINK"
                : "E // GET FREE MEAL + DRINK";
        }
    );

    // =====================================================
    // SECTION 10 // ANIMATION
    // =====================================================

    function animateCityPlaza() {

        // Reserved for later plaza effects.
    }

    return animateCityPlaza;
}
