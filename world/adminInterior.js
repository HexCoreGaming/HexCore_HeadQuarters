
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import {
    adminStaffDialogue
} from "../npcs/adminDialogue.js";

// =====================================================
// HEXCORE // ADMINISTRATION & LEGAL INTERIOR
// =====================================================

export function createAdminInterior(scene, renderer) {

    // =====================================================
    // SECTION 01 // DIMENSIONS AND WORLD POSITION
    // =====================================================

    const CENTER_X = 500;
    const CENTER_Z = 500;

    const WIDTH = 76;
    const DEPTH = 70;
    const HEIGHT = 16;

    const interior = new THREE.Group();

    interior.name = "HEXCORE_ADMINISTRATION_INTERIOR";
    interior.position.set(CENTER_X, 0, CENTER_Z);

    scene.add(interior);

    // =====================================================
    // SECTION 02 // MATERIALS
    // =====================================================

    const marble = new THREE.MeshStandardMaterial({
        color: 0x13111E,
        metalness: 0.5,
        roughness: 0.24
    });

    const wall = new THREE.MeshStandardMaterial({
        color: 0x202035,
        metalness: 0.5,
        roughness: 0.45,
        side: THREE.DoubleSide
    });

    const metal = new THREE.MeshStandardMaterial({
        color: 0x353A51,
        metalness: 0.8,
        roughness: 0.3
    });

    const purple = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    const gold = new THREE.MeshBasicMaterial({
        color: 0xE5AF69
    });

    const skin = new THREE.MeshStandardMaterial({
        color: 0xC99578,
        roughness: 0.85
    });

    function box(parent, w, h, d, x, y, z, material) {
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    function cylinder(parent, a, b, h, x, y, z, material) {
        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(a, b, h, 12),
            material
        );
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
    }

    // =====================================================
    // SECTION 03 // GRAND INTERIOR SHELL
    // =====================================================

    box(interior, WIDTH, 0.3, DEPTH, 0, -0.12, 0, marble);
    box(interior, WIDTH, 0.5, DEPTH, 0, HEIGHT, 0, wall);

    box(interior, 0.5, HEIGHT, DEPTH, -WIDTH / 2, HEIGHT / 2, 0, wall);
    box(interior, 0.5, HEIGHT, DEPTH, WIDTH / 2, HEIGHT / 2, 0, wall);

    box(interior, WIDTH, HEIGHT, 0.5, 0, HEIGHT / 2, -DEPTH / 2, wall);

    // Front wall has a wide entrance opening.

    box(interior, 32, HEIGHT, 0.5, -22, HEIGHT / 2, DEPTH / 2, wall);
    box(interior, 32, HEIGHT, 0.5, 22, HEIGHT / 2, DEPTH / 2, wall);
    box(interior, 12, HEIGHT - 6, 0.5, 0, 6 + (HEIGHT - 6) / 2, DEPTH / 2, wall);

    // =====================================================
    // SECTION 04 // GRAND MARBLE FLOOR
    // =====================================================

    for (let x = -32; x <= 32; x += 8) {
        box(interior, 0.065, 0.025, 60, x, 0.06, 0, purple);
    }

    for (let z = -28; z <= 28; z += 8) {
        box(interior, 68, 0.025, 0.065, 0, 0.06, z, cyan);
    }

    // Central aisle.

    box(interior, 7, 0.035, 60, 0, 0.07, 0, metal);
    box(interior, 0.1, 0.045, 60, -3.5, 0.1, 0, purple);
    box(interior, 0.1, 0.045, 60, 3.5, 0.1, 0, cyan);

    // =====================================================
    // SECTION 05 // CEILING LIGHTS AND COLUMNS
    // =====================================================

    for (const x of [-33, 33]) {
        for (const z of [-27, -13, 1, 15, 29]) {
            cylinder(interior, 0.7, 0.9, HEIGHT, x, HEIGHT / 2, z, metal);
            cylinder(interior, 0.18, 0.18, 8, x, 9, z, purple);
        }
    }

    for (const z of [-25, -10, 5, 20]) {
        box(interior, 52, 0.12, 0.2, 0, HEIGHT - 0.45, z, cyan);
    }

    const ambient = new THREE.HemisphereLight(
        0xC8B6FF,
        0x303040,
        2.2
    );

    interior.add(ambient);

    for (const [x, z, color] of [
        [-25, -15, 0x8650E8],
        [25, -15, 0x8CD6FD],
        [-25, 15, 0x8CD6FD],
        [25, 15, 0x8650E8]
    ]) {
        const light = new THREE.PointLight(color, 25, 35);
        light.position.set(x, 8, z);
        interior.add(light);
    }

    // =====================================================
    // SECTION 06 // LARGE CORPORATE OFFICE FURNITURE
    // =====================================================

    const staffPositions = [
        { x: -20, z: -12 },
        { x: 20, z: -12 },
        { x: -20, z: 12 },
        { x: 20, z: 12 }
    ];

    function createDesk(x, z) {

        const office = new THREE.Group();
        office.position.set(x, 0, z);
        interior.add(office);

        box(office, 8, 0.3, 2.2, 0, 1.15, -2, metal);
        box(office, 0.35, 1.2, 2, -3.5, 0.55, -2, marble);
        box(office, 0.35, 1.2, 2, 3.5, 0.55, -2, marble);

        box(office, 2.2, 1.25, 0.12, 0, 2.05, -2.5, wall);
        box(office, 2, 1.05, 0.14, 0, 2.05, -2.39, cyan);

        box(office, 7.5, 0.07, 0.16, 0, 1.38, -0.95, purple);

        // Visitor seating.

        for (const dx of [-2, 2]) {
            box(office, 1.1, 0.3, 1, dx, 0.55, 4.3, metal);
            box(office, 1.1, 1.05, 0.2, dx, 0.9, 4.75, wall);
        }
    }

    for (const position of staffPositions) {
        createDesk(position.x, position.z);
    }

    // =====================================================
    // SECTION 07 // ROOM SIGNAGE
    // =====================================================

    function createTextSign(text, width, height, color) {

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#10101D";
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        ctx.strokeRect(8, 8, 1008, 240);

        let fontSize = 76;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#F2EDFF";

        while (fontSize > 24) {
            ctx.font = `bold ${fontSize}px Arial`;
            if (ctx.measureText(text).width < 950) break;
            fontSize -= 4;
        }

        ctx.fillText(text, 512, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        return new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                depthTest: true
            })
        );
    }

    const mainSign = createTextSign(
        "ADMINISTRATION & LEGAL",
        24, 5,
        "#8650E8"
    );

    mainSign.position.set(0, 10, -34.5);
    interior.add(mainSign);

    // =====================================================
    // SECTION 08 // CREATE FOUR NAMED STAFF NPCS
    // =====================================================

    const staffModels = [];

    function createStaff(data, position, index) {

        const npc = new THREE.Group();
        npc.position.set(position.x, 0, position.z);
        interior.add(npc);

        const clothes = new THREE.MeshStandardMaterial({
            color: [0x30224E, 0x272F48, 0x203F50, 0x452449][index],
            roughness: 0.65
        });

        const hair = new THREE.MeshStandardMaterial({
            color: [0x23151B, 0x38251F, 0x1B1923, 0x36221B][index],
            roughness: 0.8
        });

        for (const x of [-0.18, 0.18]) {
            cylinder(npc, 0.13, 0.15, 0.9, x, 0.55, 0, metal);
        }

        cylinder(npc, 0.32, 0.27, 0.9, 0, 1.45, 0, clothes);
        cylinder(npc, 0.11, 0.11, 0.18, 0, 1.98, 0, skin);

        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 14, 12),
            skin
        );
        head.position.y = 2.27;
        npc.add(head);

        const hairCap = new THREE.Mesh(
            new THREE.SphereGeometry(0.29, 12, 10),
            hair
        );
        hairCap.scale.y = 0.4;
        hairCap.position.y = 2.48;
        npc.add(hairCap);

        for (const x of [-0.42, 0.42]) {
            const arm = cylinder(
                npc, 0.11, 0.1, 0.72,
                x, 1.43, 0, clothes
            );
            arm.rotation.z = x < 0 ? -0.17 : 0.17;
        }

        const label = createTextSign(
            `${data.name.toUpperCase()} // ${data.title}`,
            5.8, 1.1,
            "#8CD6FD"
        );

        label.position.y = 3.55;
        npc.add(label);

        staffModels.push({
            data,
            npc,
            position,
            phase: index * 1.5
        });
    }

    adminStaffDialogue.forEach((data, i) => {
        createStaff(data, staffPositions[i], i);
    });

    // =====================================================
    // SECTION 09 // INTERIOR ENTRY AND EXIT
    // =====================================================

    const exitFrame = new THREE.Group();
    exitFrame.position.set(0, 0, 34.65);
    interior.add(exitFrame);

    box(exitFrame, 7.2, 0.3, 0.4, 0, 6, 0, cyan);
    box(exitFrame, 0.3, 6, 0.4, -3.5, 3, 0, purple);
    box(exitFrame, 0.3, 6, 0.4, 3.5, 3, 0, purple);

    const exitSign = createTextSign(
        "EXIT TO HEXCORE CITY", 7, 1.25, "#8CD6FD"
    );

    exitSign.position.set(0, 7, 0);
    exitFrame.add(exitSign);

    // This is the real city building.
    const building = {
        x: -37,
        z: 171,
        rotation: 155,
        radius: 13
    };

    let playerX = 0;
    let playerZ = 15;

    let inside = false;
    let transitionCooldown = 0;

    window.addEventListener(
        "hexcore-player-position",
        event => {
            playerX = event.detail.x;
            playerZ = event.detail.z;
        }
    );

    const angle = THREE.MathUtils.degToRad(building.rotation);
    const front = building.radius * Math.cos(Math.PI / 12);

    function goInside() {

        if (typeof window.hexcoreTeleportPlayer !== "function") return;

        inside = true;
        window.hexcoreInteriorActive = true;
        window.hexcoreInteriorBounds = {
            minX: CENTER_X - 37.3, maxX: CENTER_X + 37.3,
            minZ: CENTER_Z - 34.3, maxZ: CENTER_Z + 34.3
        };

        // Facing into the hall, toward negative Z.
        window.hexcoreTeleportPlayer(
            CENTER_X,
            CENTER_Z + 30,
            0
        );

        transitionCooldown = 1;
    }

    function goOutside() {
        if (typeof window.hexcoreTeleportPlayer !== "function") return;
        inside = false;
        window.hexcoreInteriorActive = true;
        // Tower sets the return destination when this room is entered.
        const back = window.hexcoreAdminReturn || {
            x: 900, z: 908, yaw: Math.PI
        };
        window.hexcoreInteriorBounds = {
            minX: 875, maxX: 925, minZ: 875, maxZ: 925
        };
        window.hexcoreTeleportPlayer(back.x, back.z, back.yaw);
        window.dispatchEvent(new CustomEvent("hexcore-admin-exited"));
        transitionCooldown = 1;
    }

    // SECTION 09A // ADMIN INTERIOR PUBLIC ENTRY API
    window.hexcoreEnterAdminRoom = function() {
        if (inside || typeof window.hexcoreTeleportPlayer !== "function") return;
        goInside();
    };

    // =====================================================
    // SECTION 10 // DIALOGUE USER INTERFACE
    // =====================================================

    const ui = document.createElement("div");

    Object.assign(ui.style, {
        position: "fixed",
        inset: "0",
        display: "none",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5,5,15,0.75)",
        zIndex: "300",
        fontFamily: "Consolas, monospace",
        padding: "12px",
        boxSizing: "border-box"
    });

    const panel = document.createElement("div");

    Object.assign(panel.style, {
        background: "#100D1E",
        border: "1px solid #8650E8",
        boxShadow: "0 0 30px #48257A",
        color: "#EAE5FA",
        padding: "20px",
        width: "min(720px, 94vw)",
        maxHeight: "86dvh",
        overflowY: "auto",
        boxSizing: "border-box"
    });

    ui.appendChild(panel);
    document.body.appendChild(ui);

    const prompt = document.createElement("button");

    prompt.type = "button";

    Object.assign(prompt.style, {
        position: "fixed",
        left: "50%",
        bottom: "110px",
        transform: "translateX(-50%)",
        background: "#100D1E",
        color: "#8CD6FD",
        border: "1px solid #8650E8",
        padding: "12px",
        fontFamily: "Consolas, monospace",
        zIndex: "160",
        display: "none",
        cursor: "pointer",
        maxWidth: "85vw"
    });

    document.body.appendChild(prompt);

    let nearest = null;
    let activeStaff = null;

    function makeButton(label, callback) {

        const button = document.createElement("button");
        button.textContent = label;

        Object.assign(button.style, {
            display: "block",
            width: "100%",
            padding: "12px",
            margin: "8px 0",
            background: "#24183B",
            border: "1px solid #60419A",
            color: "#EAE5FA",
            textAlign: "left",
            fontFamily: "Consolas, monospace",
            fontSize: "13px",
            cursor: "pointer",
            whiteSpace: "normal",
            touchAction: "manipulation"
        });

        button.addEventListener("click", callback);
        return button;
    }

    function makeHeading(text) {
        const el = document.createElement("h3");
        el.textContent = text;
        el.style.color = "#8CD6FD";
        el.style.marginTop = "0";
        return el;
    }

    function showQuestions() {

        panel.replaceChildren();

        panel.appendChild(
            makeHeading(
                `${activeStaff.data.name} // ${activeStaff.data.title}`
            )
        );

        for (const entry of activeStaff.data.questions) {
            panel.appendChild(
                makeButton(
                    entry.question,
                    () => showAnswer(entry)
                )
            );
        }

        panel.appendChild(
            makeButton("END CONVERSATION", closeDialogue)
        );
    }

    function showAnswer(entry) {

        panel.replaceChildren();
        panel.appendChild(makeHeading(entry.question));

        const answer = document.createElement("p");
        answer.textContent = entry.answer;

        Object.assign(answer.style, {
            whiteSpace: "pre-line",
            lineHeight: "1.75",
            color: "#E7E1F3",
            fontSize: "14px"
        });

        panel.appendChild(answer);

        panel.appendChild(
            makeButton("BACK TO QUESTIONS", showQuestions)
        );

        panel.appendChild(
            makeButton("END CONVERSATION", closeDialogue)
        );
    }

    function openDialogue(staff) {

        activeStaff = staff;
        window.hexcoreDialogueOpen = true;

        ui.style.display = "flex";
        prompt.style.display = "none";

        showQuestions();

        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    function closeDialogue() {

        ui.style.display = "none";
        activeStaff = null;
        window.hexcoreDialogueOpen = false;

        if (
            !window.matchMedia("(pointer: coarse)").matches &&
            renderer?.domElement
        ) {
            renderer.domElement.requestPointerLock().catch(() => {});
        }
    }

    // =====================================================
    // SECTION 11 // INTERACTION CONTROLS
    // =====================================================

    // Preserve the existing mobile receptionist interaction.

    const previousInteract = window.hexcoreInteract;

    function interactWithAdmin() {

        if (!inside || window.hexcoreDialogueOpen === true) {
            return false;
        }

        if (nearest) {
            openDialogue(nearest);
            return true;
        }

        return false;
    }

    window.hexcoreInteract = function() {

        if (inside) {
            interactWithAdmin();
        } else if (typeof previousInteract === "function") {
            previousInteract();
        }
    };

    window.addEventListener("keydown", event => {

        if (
            event.code === "KeyE" &&
            !event.repeat &&
            window.hexcoreDialogueOpen !== true
        ) {
            interactWithAdmin();
        }

        if (
            event.code === "Escape" &&
            activeStaff !== null
        ) {
            closeDialogue();
        }
    });

    prompt.addEventListener("pointerdown", event => {
        event.stopPropagation();
    });

    prompt.addEventListener("click", () => {
        interactWithAdmin();
    });

    // =====================================================
    // SECTION 12 // UPDATE INTERIOR
    // =====================================================

    const clock = new THREE.Clock();
    let elapsed = 0;

    function animateAdminInterior() {

        const delta = Math.min(clock.getDelta(), 0.05);
        elapsed += delta;

        transitionCooldown = Math.max(
            0,
            transitionCooldown - delta
        );

        // SECTION 12A // DOORWAY ENTRY IS CONTROLLED BY HEXCORE TOWER
        // Existing city building stays intact for future repurposing.

        if (!inside) {
            prompt.style.display = "none";
            return;
        }

        // Exit by walking through the hall's main doorway.

        if (
            transitionCooldown <= 0 &&
            Math.abs(playerX - CENTER_X) < 3 &&
            playerZ > CENTER_Z + 33
        ) {
            closeDialogueIfNeeded();
            goOutside();
            return;
        }

        nearest = null;
        let closestDistance = 3.5;

        for (const staff of staffModels) {

            const dx = playerX - (CENTER_X + staff.position.x);
            const dz = playerZ - (CENTER_Z + staff.position.z);
            const distance = Math.hypot(dx, dz);

            if (distance < closestDistance) {
                nearest = staff;
                closestDistance = distance;
            }

            staff.npc.rotation.z =
                Math.sin(elapsed + staff.phase) * 0.008;
        }

        if (nearest && window.hexcoreDialogueOpen !== true) {

            const mobile = window.matchMedia(
                "(pointer: coarse)"
            ).matches;

            prompt.textContent = mobile
                ? `TAP // TALK TO ${nearest.data.name.toUpperCase()}`
                : `E // TALK TO ${nearest.data.name.toUpperCase()}`;

            prompt.style.display = "block";

        } else {
            prompt.style.display = "none";
        }
    }

    function closeDialogueIfNeeded() {
        if (activeStaff) closeDialogue();
    }

    return animateAdminInterior;
}
