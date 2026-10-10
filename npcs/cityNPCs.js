
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // CITYWIDE NPC SYSTEM
// =====================================================

export function createCityNPCs(scene) {

    // =====================================================
    // SECTION 01 // NPC POPULATION SETTINGS
    // =====================================================

    const mobile = window.matchMedia(
        "(pointer: coarse)"
    ).matches;

    const maxNPCs = mobile ? 10 : 20;

    const cityNPCGroup = new THREE.Group();
    cityNPCGroup.name = "HEXCORE_CITY_PEDESTRIANS";
    scene.add(cityNPCGroup);

    const clock = new THREE.Clock();

    const pedestrians = [];
    const socialNPCs = [];

    let elapsed = 0;
    let playerX = 0;
    let playerZ = 15;

    window.addEventListener(
        "hexcore-player-position",
        event => {
            playerX = event.detail.x;
            playerZ = event.detail.z;
        }
    );

    // =====================================================
    // SECTION 02 // CHARACTER MATERIALS
    // =====================================================

    const outfitColors = [
        0x272344,
        0x482565,
        0x213F60,
        0x502C55,
        0x263F43,
        0x653852,
        0x34364F,
        0x624729
    ];

    const skinColors = [
        0xE1B795,
        0xC99071,
        0xA46D50,
        0x754A39,
        0xD9A783
    ];

    const hairColors = [
        0x14111C,
        0x32201B,
        0x68472C,
        0xB9A18E,
        0x4C316A
    ];

    const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x171827,
        roughness: 0.8
    });

    const shoeMaterial = new THREE.MeshStandardMaterial({
        color: 0x10121D,
        roughness: 0.85
    });

    const accentMaterial = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    function randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // =====================================================
    // SECTION 03 // SIMPLE CHARACTER BUILDING HELPERS
    // =====================================================

    function addBox(parent, w, h, d, x, y, z, material) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function addCylinder(
        parent, top, bottom, h,
        x, y, z, material
    ) {

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                top, bottom, h, 9
            ),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function addSphere(parent, r, x, y, z, material) {

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(r, 10, 8),
            material
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    // =====================================================
    // SECTION 04 // MALE AND FEMALE VISITOR MODELS
    // =====================================================

    function createVisitor() {

        const root = new THREE.Group();

        const body = new THREE.Group();
        root.add(body);

        const female = Math.random() < 0.5;

        const clothes = new THREE.MeshStandardMaterial({
            color: randomItem(outfitColors),
            roughness: 0.7,
            metalness: 0.15
        });

        const skin = new THREE.MeshStandardMaterial({
            color: randomItem(skinColors),
            roughness: 0.85
        });

        const hair = new THREE.MeshStandardMaterial({
            color: randomItem(hairColors),
            roughness: 0.9
        });

        // Separate leg pivots for walking.

        const leftLeg = new THREE.Group();
        const rightLeg = new THREE.Group();

        leftLeg.position.set(-0.15, 0.94, 0);
        rightLeg.position.set(0.15, 0.94, 0);

        addCylinder(
            leftLeg, 0.11, 0.12, 0.76,
            0, -0.38, 0, pantsMaterial
        );

        addCylinder(
            rightLeg, 0.11, 0.12, 0.76,
            0, -0.38, 0, pantsMaterial
        );

        addBox(
            leftLeg, 0.24, 0.15, 0.38,
            0, -0.83, 0.09, shoeMaterial
        );

        addBox(
            rightLeg, 0.24, 0.15, 0.38,
            0, -0.83, 0.09, shoeMaterial
        );

        body.add(leftLeg, rightLeg);

        // Torso.

        addCylinder(
            body,
            female ? 0.25 : 0.31,
            0.27,
            0.85,
            0, 1.38, 0,
            clothes
        );

        // Dress variation.

        if (female) {

            addCylinder(
                body, 0.26, 0.47, 0.56,
                0, 0.87, 0, clothes
            );
        }

        // Neck and head.

        addCylinder(
            body, 0.105, 0.105, 0.2,
            0, 1.91, 0, skin
        );

        addSphere(
            body, 0.27,
            0, 2.21, 0, skin
        );

        // Hair.

        const hairCap = addSphere(
            body, 0.28,
            0, 2.36, -0.04, hair
        );

        hairCap.scale.y = 0.58;

        if (female) {

            const longHair = addSphere(
                body, 0.27,
                0, 2.10, -0.18, hair
            );

            longHair.scale.set(1, 1.65, 0.7);
        }

        // Independent arm pivots.

        const leftArm = new THREE.Group();
        const rightArm = new THREE.Group();

        leftArm.position.set(-0.34, 1.72, 0);
        rightArm.position.set(0.34, 1.72, 0);

        addCylinder(
            leftArm, 0.095, 0.09, 0.65,
            0, -0.33, 0, clothes
        );

        addCylinder(
            rightArm, 0.095, 0.09, 0.65,
            0, -0.33, 0, clothes
        );

        addSphere(
            leftArm, 0.095,
            0, -0.67, 0, skin
        );

        addSphere(
            rightArm, 0.095,
            0, -0.67, 0, skin
        );

        body.add(leftArm, rightArm);

        // Small cyberpunk clothing accent.

        addBox(
            body,
            0.15, 0.035, 0.035,
            0, 1.55, 0.3,
            accentMaterial
        );

        root.scale.setScalar(
            0.92 + Math.random() * 0.16
        );

        cityNPCGroup.add(root);

        return {
            root,
            body,
            leftLeg,
            rightLeg,
            leftArm,
            rightArm,
            phase: Math.random() * Math.PI * 2
        };
    }

    // =====================================================
    // SECTION 05 // BUILDING AND LANDMARK AVOIDANCE
    // =====================================================

    const buildingDirectory =
        window.hexcoreCityBuildingDirectory || [];

    const obstacles = buildingDirectory.map(building => ({
        x: building.x,
        z: building.z,
        radius: building.radius + 3
    }));

    // Prevent pedestrians walking into the fountain,
    // food cart, and central energy structure.

    obstacles.push(
        { x: 0, z: 65, radius: 5.8 },
        { x: -10, z: 65, radius: 4.2 },
        { x: 0, z: 88, radius: 6 }
    );

    function safePoint(x, z) {

        if (
            x < -95 || x > 95 ||
            z < 40 || z > 243
        ) {
            return false;
        }

        for (const obstacle of obstacles) {

            if (
                Math.hypot(
                    x - obstacle.x,
                    z - obstacle.z
                ) < obstacle.radius
            ) {
                return false;
            }
        }

        return true;
    }

    function safeSegment(a, b) {

        const dx = b.x - a.x;
        const dz = b.z - a.z;

        const lengthSquared = dx * dx + dz * dz;

        for (const obstacle of obstacles) {

            let t = 0;

            if (lengthSquared > 0) {

                t = (
                    (obstacle.x - a.x) * dx +
                    (obstacle.z - a.z) * dz
                ) / lengthSquared;

                t = THREE.MathUtils.clamp(t, 0, 1);
            }

            const nearestX = a.x + t * dx;
            const nearestZ = a.z + t * dz;

            if (
                Math.hypot(
                    nearestX - obstacle.x,
                    nearestZ - obstacle.z
                ) < obstacle.radius
            ) {
                return false;
            }
        }

        return true;
    }

    // =====================================================
    // SECTION 06 // GENERATE SAFE WALKING ROUTES
    // =====================================================

    const routeX = [
        -92, -69, -46, -23, 0,
        23, 46, 69, 92
    ];

    const routeZ = [
        42, 65, 88, 111, 134,
        157, 180, 203, 226, 242
    ];

    const nodes = [];
    const nodeLookup = new Map();

    function routeKey(ix, iz) {
        return `${ix}:${iz}`;
    }

    // Place route nodes only where walking is safe.

    for (let iz = 0; iz < routeZ.length; iz++) {

        for (let ix = 0; ix < routeX.length; ix++) {

            const x = routeX[ix];
            const z = routeZ[iz];

            if (!safePoint(x, z)) {
                continue;
            }

            const node = {
                x,
                z,
                ix,
                iz,
                links: []
            };

            nodes.push(node);
            nodeLookup.set(routeKey(ix, iz), node);
        }
    }

    // Connect neighboring nodes if the entire
    // stretch between them is unobstructed.

    for (const node of nodes) {

        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        for (const [dx, dz] of directions) {

            const neighbor = nodeLookup.get(
                routeKey(node.ix + dx, node.iz + dz)
            );

            if (
                neighbor &&
                safeSegment(node, neighbor)
            ) {
                node.links.push(neighbor);
            }
        }
    }

    const walkableNodes = nodes.filter(
        node => node.links.length > 0
    );

    // =====================================================
    // SECTION 07 // WANDERING PEDESTRIANS
    // =====================================================

    function chooseDestination(npc) {

        const current = npc.currentNode;

        if (!current || current.links.length === 0) {
            return;
        }

        const options = current.links.filter(
            node => node !== npc.previousNode
        );

        const choices = options.length > 0
            ? options
            : current.links;

        const next = randomItem(choices);

        npc.previousNode = current;
        npc.targetNode = next;
    }

    function createPedestrian(index) {

        if (walkableNodes.length === 0) {
            return;
        }

        const model = createVisitor();

        const node = walkableNodes[
            index % walkableNodes.length
        ];

        model.root.position.set(
            node.x,
            0.15,
            node.z
        );

        const npc = {
            ...model,
            currentNode: node,
            previousNode: null,
            targetNode: null,
            speed: 1.1 + Math.random() * 0.9,
            pause: Math.random() * 3,
            walkPhase: Math.random() * 10,
            active: true
        };

        chooseDestination(npc);
        pedestrians.push(npc);
    }

    // =====================================================
    // SECTION 08 // SOCIAL GROUPS AND PLAZA WATCHERS
    // =====================================================

    function createStandingVisitor(x, z, rotation, behavior) {

        if (!safePoint(x, z)) {
            return;
        }

        const model = createVisitor();

        model.root.position.set(x, 0.15, z);
        model.root.rotation.y = rotation;

        socialNPCs.push({
            ...model,
            behavior
        });
    }

    // Plaza spectators.

    createStandingVisitor(
        -21, 64, Math.PI / 2, "watching"
    );

    createStandingVisitor(
        21, 65, -Math.PI / 2, "watching"
    );

    // Community-area conversation pair.

    createStandingVisitor(
        -22, 112, 0.5, "talking"
    );

    createStandingVisitor(
        -20.8, 113.5, 3.4, "talking"
    );

    // Commercial-district conversation pair.

    createStandingVisitor(
        25, 205, 0.5, "talking"
    );

    createStandingVisitor(
        26.5, 206, 3.6, "talking"
    );

    // =====================================================
    // SECTION 09 // SPAWN THE REST OF THE POPULATION
    // =====================================================

    const walkingPopulation = Math.max(
        0,
        maxNPCs - socialNPCs.length
    );

    for (let i = 0; i < walkingPopulation; i++) {
        createPedestrian(i * 5 + 3);
    }

    // =====================================================
    // SECTION 10 // ANIMATE WALKING
    // =====================================================

    function animatePedestrian(npc, delta) {

        const distanceToPlayer = Math.hypot(
            npc.root.position.x - playerX,
            npc.root.position.z - playerZ
        );

        // Reduce skeletal animation work at long range.
        const animateBody = distanceToPlayer < 95;

        if (npc.pause > 0) {

            npc.pause -= delta;

            if (animateBody) {
                npc.body.rotation.z =
                    Math.sin(elapsed + npc.phase) * 0.008;
            }

            return;
        }

        if (!npc.targetNode) {
            chooseDestination(npc);
            return;
        }

        const dx =
            npc.targetNode.x - npc.root.position.x;

        const dz =
            npc.targetNode.z - npc.root.position.z;

        const distance = Math.hypot(dx, dz);

        if (distance < 0.3) {

            npc.root.position.x = npc.targetNode.x;
            npc.root.position.z = npc.targetNode.z;

            npc.currentNode = npc.targetNode;

            npc.pause = Math.random() < 0.35
                ? 1 + Math.random() * 4
                : 0;

            chooseDestination(npc);
            return;
        }

        const step = Math.min(
            npc.speed * delta,
            distance
        );

        npc.root.position.x += dx / distance * step;
        npc.root.position.z += dz / distance * step;

        // Face walking direction.

        npc.root.rotation.y = Math.atan2(dx, dz);

        // Procedural walking animation.

        if (animateBody) {

            npc.walkPhase += delta * npc.speed * 7;

            const swing = Math.sin(npc.walkPhase);

            npc.leftLeg.rotation.x = swing * 0.36;
            npc.rightLeg.rotation.x = -swing * 0.36;

            npc.leftArm.rotation.x = -swing * 0.25;
            npc.rightArm.rotation.x = swing * 0.25;

            npc.body.position.y =
                Math.abs(swing) * 0.025;

        } else {

            npc.leftLeg.rotation.x = 0;
            npc.rightLeg.rotation.x = 0;

            npc.leftArm.rotation.x = 0;
            npc.rightArm.rotation.x = 0;

            npc.body.position.y = 0;
        }
    }

    // =====================================================
    // SECTION 11 // ANIMATE SOCIAL NPCS
    // =====================================================

    function animateSocialNPC(npc) {

        const t = elapsed + npc.phase;

        npc.body.rotation.z =
            Math.sin(t * 0.8) * 0.012;

        if (npc.behavior === "talking") {

            npc.rightArm.rotation.x =
                -0.15 + Math.sin(t * 1.6) * 0.25;

            npc.leftArm.rotation.x =
                Math.sin(t) * 0.08;

        } else if (npc.behavior === "watching") {

            npc.rightArm.rotation.x =
                -0.1 + Math.sin(t * 0.6) * 0.05;
        }
    }

    // =====================================================
    // SECTION 12 // MAIN CITY NPC ANIMATION
    // =====================================================

    function updateCityNPCs() {

        const delta = Math.min(
            clock.getDelta(),
            0.05
        );

        elapsed += delta;

        for (const npc of pedestrians) {
            animatePedestrian(npc, delta);
        }

        for (const npc of socialNPCs) {
            animateSocialNPC(npc);
        }
    }

    // =====================================================
    // SECTION 13 // OUTPUT
    // =====================================================

    return updateCityNPCs;
}
