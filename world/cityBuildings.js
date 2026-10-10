
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // CITY DEPARTMENT BUILDINGS
// =====================================================

// =====================================================
// SECTION 01 // CREATE CITY BUILDINGS
// =====================================================

export function createCityBuildings(scene) {

    const cityBuildings = new THREE.Group();
    cityBuildings.name = "HEXCORE_CITY_BUILDINGS";

    scene.add(cityBuildings);

    // =====================================================
    // SECTION 02 // ARCHITECTURAL MATERIALS
    // =====================================================

    const metal = new THREE.MeshStandardMaterial({
        color: 0x101321,
        metalness: 0.7,
        roughness: 0.3
    });

    const darkGlass = new THREE.MeshStandardMaterial({
        color: 0x162A40,
        metalness: 0.35,
        roughness: 0.17
    });

    const windowGlass = new THREE.MeshBasicMaterial({
        color: 0x2B6279
    });

    const cyan = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    const purple = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const magenta = new THREE.MeshBasicMaterial({
        color: 0xD64FAE
    });

    const gold = new THREE.MeshBasicMaterial({
        color: 0xD8A45D
    });

    const glowMaterials = {
        cyan,
        purple,
        magenta,
        gold
    };

    // =====================================================
    // SECTION 03 // BUILDING DIRECTORY
    // =====================================================

    // X = left/right side of the main boulevard.
    // Z = distance from headquarters.
    // Dimensions are in approximate world units.

    const buildings = [
        {
            id: "game_gallery",
            name: "GAME GALLERY",
            x: -46, z: 101,
            width: 24, depth: 20, height: 19,
            type: "gallery",
            glow: "purple"
        },
        {
            id: "development",
            name: "DEVELOPMENT STUDIO",
            x: 46, z: 101,
            width: 23, depth: 21, height: 31,
            type: "tower",
            glow: "cyan"
        },
        {
            id: "community",
            name: "COMMUNITY CENTER",
            x: -46, z: 131,
            width: 23, depth: 21, height: 17,
            type: "hall",
            glow: "cyan"
        },
        {
            id: "support",
            name: "SUPPORT CENTER",
            x: 46, z: 131,
            width: 21, depth: 19, height: 16,
            type: "office",
            glow: "purple"
        },
        {
            id: "media",
            name: "MEDIA CENTER",
            x: -46, z: 160,
            width: 23, depth: 21, height: 24,
            type: "tower",
            glow: "magenta"
        },
        {
            id: "business",
            name: "BUSINESS & INVESTMENT",
            x: 46, z: 160,
            width: 23, depth: 21, height: 27,
            type: "tower",
            glow: "gold"
        },
        {
            id: "administration",
            name: "ADMINISTRATION & LEGAL",
            x: -46, z: 190,
            width: 22, depth: 19, height: 23,
            type: "office",
            glow: "purple"
        },
        {
            id: "merchandise",
            name: "MERCHANDISE STORE",
            x: 46, z: 190,
            width: 23, depth: 20, height: 15,
            type: "store",
            glow: "cyan"
        },
        {
            id: "hardware",
            name: "HARDWARE DIVISION",
            x: -46, z: 213,
            width: 22, depth: 18, height: 29,
            type: "laboratory",
            glow: "cyan"
        },
        {
            id: "future_worlds",
            name: "FUTURE WORLDS MUSEUM",
            x: 46, z: 213,
            width: 22, depth: 18, height: 25,
            type: "museum",
            glow: "purple"
        },
        {
            id: "arcade",
            name: "HEXCORE ARCADE",
            x: 76, z: 116,
            width: 27, depth: 20, height: 19,
            type: "arcade",
            glow: "magenta"
        },
        {
            id: "cinema",
            name: "HEXCORE CINEMA",
            x: 76, z: 157,
            width: 30, depth: 22, height: 21,
            type: "cinema",
            glow: "purple"
        },
        {
            id: "stadium",
            name: "PERFORMANCE STADIUM",
            x: -76, z: 155,
            width: 34, depth: 25, height: 23,
            type: "stadium",
            glow: "gold"
        }
    ];

    // =====================================================
    // SECTION 04 // GEOMETRY HELPERS
    // =====================================================

    function addBox(parent, w, h, d, x, y, z, mat) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function addCylinder(
        parent, top, bottom, height, x, y, z, mat, sides = 12
    ) {

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                top, bottom, height, sides
            ),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    // =====================================================
    // SECTION 05 // BUILDING SIGN GENERATOR
    // =====================================================

    function createSign(parent, name, width, z, color) {

        const canvas = document.createElement("canvas");

        canvas.width = 1024;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#070813";
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = color;
        ctx.lineWidth = 12;
        ctx.strokeRect(8, 8, 1008, 240);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = color;
        ctx.shadowBlur = 16;

        let fontSize = 75;
        ctx.font = `bold ${fontSize}px Arial`;

        while (
            ctx.measureText(name).width > 930 &&
            fontSize > 36
        ) {
            fontSize -= 3;
            ctx.font = `bold ${fontSize}px Arial`;
        }

        ctx.fillText(name, 512, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(width, 2.8),
            material
        );

        sign.position.set(0, 5.8, z);

        parent.add(sign);
    }

    // =====================================================
    // SECTION 06 // STANDARD BUILDING STRUCTURE
    // =====================================================

    function createBuilding(def) {

        const group = new THREE.Group();

        group.name = def.id;

        // All entrances face the central boulevard.

        group.position.set(def.x, 0, def.z);

        group.rotation.y =
            def.x < 0 ? Math.PI / 2 : -Math.PI / 2;

        const w = def.width;
        const d = def.depth;
        const h = def.height;

        const glow = glowMaterials[def.glow];

        const glowHex = {
            cyan: "#8CD6FD",
            purple: "#8650E8",
            magenta: "#D64FAE",
            gold: "#D8A45D"
        }[def.glow];

        // SECTION 06A // MAIN SHELL

        addBox(
            group, w, h, d,
            0, h / 2, 0, metal
        );

        // SECTION 06B // FRONT GLASS FACADE

        addBox(
            group, w - 2, h - 2, 0.25,
            0, h / 2, d / 2 + 0.14,
            darkGlass
        );

        // SECTION 06C // VERTICAL ACCENTS

        for (const x of [-w / 2 + 0.35, w / 2 - 0.35]) {

            addBox(
                group, 0.18, h, 0.3,
                x, h / 2, d / 2 + 0.35,
                glow
            );
        }

        // SECTION 06D // FLOOR LEVELS

        const floors = Math.max(
            2,
            Math.floor(h / 5)
        );

        for (let floor = 1; floor < floors; floor++) {

            const y = floor * (h / floors);

            addBox(
                group, w - 1, 0.12, 0.4,
                0, y, d / 2 + 0.4,
                glow
            );

            // Illuminated windows on upper floors.

            for (const x of [-w * 0.24, 0, w * 0.24]) {

                addBox(
                    group,
                    w * 0.17,
                    2.0,
                    0.1,
                    x,
                    y + 1.6,
                    d / 2 + 0.33,
                    windowGlass
                );
            }
        }

        // SECTION 06E // ROOFTOP TRIM

        addBox(
            group, w + 1.1, 0.4, d + 1,
            0, h, 0, glow
        );

        // SECTION 06F // GRAND ENTRY PORTAL

        addBox(
            group, 7.4, 5.2, 1,
            0, 2.6, d / 2 + 0.65,
            metal
        );

        addBox(
            group, 6, 4.4, 0.18,
            0, 2.2, d / 2 + 1.23,
            darkGlass
        );

        for (const x of [-3.1, 3.1]) {

            addBox(
                group, 0.16, 4.7, 0.2,
                x, 2.35, d / 2 + 1.38,
                glow
            );
        }

        addBox(
            group, 6.6, 0.2, 0.3,
            0, 4.8, d / 2 + 1.4,
            glow
        );

        // Divider between future double doors.

        addBox(
            group, 0.12, 4.3, 0.2,
            0, 2.2, d / 2 + 1.39,
            glow
        );

        // SECTION 06G // MAIN ENTRANCE SIGN

        createSign(
            group,
            def.name,
            Math.min(w - 2, 20),
            d / 2 + 0.6,
            glowHex
        );

        // =====================================================
        // SECTION 07 // PURPOSE-SPECIFIC ARCHITECTURE
        // =====================================================

        if (def.type === "tower") {

            // Corporate / development skyscraper style.

            addBox(
                group, w * 0.48, 7, d * 0.65,
                0, h + 3.5, 0,
                darkGlass
            );

            addBox(
                group, w * 0.52, 0.25, d * 0.7,
                0, h + 7, 0,
                glow
            );
        }

        if (def.type === "gallery" ||
            def.type === "museum") {

            // Monumental museum crown.

            addCylinder(
                group, 7, 8, 4,
                0, h + 2, 0,
                darkGlass, 12
            );

            const crown = new THREE.Mesh(
                new THREE.TorusGeometry(
                    7.3, 0.17, 8, 36
                ),
                glow
            );

            crown.rotation.x = Math.PI / 2;
            crown.position.y = h + 4.2;

            group.add(crown);
        }

        if (def.type === "laboratory") {

            // Hardware laboratory cooling towers.

            for (const x of [-5, 5]) {

                addCylinder(
                    group, 2.2, 2.7, 5,
                    x, h + 2.5, 0,
                    darkGlass
                );

                addCylinder(
                    group, 2.4, 2.4, 0.2,
                    x, h + 5, 0,
                    cyan
                );
            }
        }

        if (def.type === "cinema") {

            // Oversized cinematic roof dome.

            const dome = new THREE.Mesh(
                new THREE.SphereGeometry(
                    11, 20, 12,
                    0, Math.PI * 2,
                    0, Math.PI / 2
                ),
                darkGlass
            );

            dome.scale.set(1.1, 0.55, 0.85);
            dome.position.y = h;

            group.add(dome);

            addBox(
                group, w + 2, 1.1, d + 1.5,
                0, 4.9, 0,
                purple
            );
        }

        if (def.type === "arcade") {

            // Tall illuminated arcade entrance.

            const columns = [-9, -5, 5, 9];

            for (const x of columns) {

                addBox(
                    group, 0.5, 10, 0.5,
                    x, 8, d / 2 + 0.6,
                    magenta
                );
            }

            addBox(
                group, 20, 0.4, 1,
                0, 13, d / 2 + 0.6,
                cyan
            );
        }

        if (def.type === "stadium") {

            // Exterior performance venue with
            // broad tiered architectural crown.

            for (let i = 0; i < 3; i++) {

                const levelWidth = w + 2 + i * 2;

                addBox(
                    group,
                    levelWidth,
                    1,
                    d + 2 + i * 2,
                    0,
                    h + i * 1.3,
                    0,
                    i % 2 === 0 ? gold : metal
                );
            }

            // Decorative spires at stadium corners.

            for (const x of [-w / 2, w / 2]) {
                for (const z of [-d / 2, d / 2]) {

                    const spire = new THREE.Mesh(
                        new THREE.ConeGeometry(
                            1.3, 7, 6
                        ),
                        gold
                    );

                    spire.position.set(
                        x,
                        h + 5,
                        z
                    );

                    group.add(spire);
                }
            }
        }

        if (def.type === "store") {

            // Wide retail canopy.

            addBox(
                group, w + 3, 0.4, 4,
                0, 5.2, d / 2 + 1.5,
                cyan
            );
        }

        if (def.type === "hall") {

            // Community center skylight.

            addBox(
                group, w * 0.65, 3, d * 0.65,
                0, h + 1.5, 0,
                darkGlass
            );
        }

        if (def.type === "office") {

            // Architectural rooftop fins.

            for (const x of [-w / 3, 0, w / 3]) {

                addBox(
                    group, 0.2, 3.5, d * 0.8,
                    x, h + 1.75, 0,
                    glow
                );
            }
        }

        // =====================================================
        // SECTION 08 // ADD BUILDING
        // =====================================================

        cityBuildings.add(group);

        return group;
    }

    // =====================================================
    // SECTION 09 // CONSTRUCT ALL DEPARTMENTS
    // =====================================================

    const createdBuildings = [];

    for (const definition of buildings) {

        createdBuildings.push(
            createBuilding(definition)
        );
    }

    // =====================================================
    // SECTION 10 // BUILDING DIRECTORY DATA
    // =====================================================

    // Future interactions and NPC navigation can
    // reference these locations by their IDs.

    window.hexcoreCityBuildingDirectory =
        buildings.map(definition => ({
            id: definition.id,
            name: definition.name,
            x: definition.x,
            z: definition.z,
            width: definition.width,
            depth: definition.depth
        }));

    // =====================================================
    // SECTION 11 // ANIMATION
    // =====================================================

    function animateCityBuildings() {

        // Reserved for future animated signs,
        // building entrances, and lighting effects.

    }

    // =====================================================
    // SECTION 12 // OUTPUT
    // =====================================================

    return animateCityBuildings;
}
