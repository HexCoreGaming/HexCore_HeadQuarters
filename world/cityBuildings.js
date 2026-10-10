
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // CYBER-FANTASY CITY ARCHITECTURE
// =====================================================

// =====================================================
// SECTION 01 // CREATE CITY BUILDINGS
// =====================================================

export function createCityBuildings(scene) {

    const city = new THREE.Group();
    city.name = "HEXCORE_CITY_BUILDINGS";
    scene.add(city);

    // =====================================================
    // SECTION 02 // SHARED MATERIALS
    // =====================================================

    const materials = {
        obsidian: new THREE.MeshStandardMaterial({
            color: 0x11111D,
            metalness: 0.72,
            roughness: 0.32
        }),

        midnight: new THREE.MeshStandardMaterial({
            color: 0x17182D,
            metalness: 0.62,
            roughness: 0.38
        }),

        titanium: new THREE.MeshStandardMaterial({
            color: 0x33384C,
            metalness: 0.82,
            roughness: 0.25
        }),

        glass: new THREE.MeshStandardMaterial({
            color: 0x254E72,
            emissive: 0x071A32,
            emissiveIntensity: 0.6,
            metalness: 0.35,
            roughness: 0.14,
            transparent: true,
            opacity: 0.86,
            side: THREE.DoubleSide
        }),

        violetGlass: new THREE.MeshStandardMaterial({
            color: 0x44276C,
            emissive: 0x251044,
            emissiveIntensity: 0.5,
            metalness: 0.35,
            roughness: 0.2,
            side: THREE.DoubleSide
        }),

        purple: new THREE.MeshBasicMaterial({
            color: 0x8650E8
        }),

        cyan: new THREE.MeshBasicMaterial({
            color: 0x8CD6FD
        }),

        magenta: new THREE.MeshBasicMaterial({
            color: 0xE34BC9
        }),

        gold: new THREE.MeshBasicMaterial({
            color: 0xE5AF69
        }),

        white: new THREE.MeshBasicMaterial({
            color: 0xE4D9FF
        })
    };

    // =====================================================
    // SECTION 03 // IRREGULAR CITY PLACEMENT
    // =====================================================

    // Positions are fixed so the city does not rearrange
    // every time somebody opens the website.
    //
    // All buildings remain on the main exterior ground.
    // Their front entrances face different directions.
    //
    // Rotation is measured in degrees.

    const departments = [
        {
            id: "game_gallery",
            name: "GAME GALLERY",
            x: -47, z: 77,
            rotation: 70,
            size: 22,
            type: "prism"
        },
        {
            id: "development",
            name: "DEVELOPMENT STUDIO",
            x: 47, z: 89,
            rotation: -65,
            size: 23,
            type: "spire"
        },
        {
            id: "community",
            name: "COMMUNITY CENTER",
            x: -42, z: 116,
            rotation: 120,
            size: 22,
            type: "hexhall"
        },
        {
            id: "support",
            name: "SUPPORT CENTER",
            x: 42, z: 126,
            rotation: -115,
            size: 18,
            type: "pod"
        },
        {
            id: "media",
            name: "MEDIA CENTER",
            x: -68, z: 146,
            rotation: 42,
            size: 19,
            type: "crystal"
        },
        {
            id: "business",
            name: "BUSINESS & INVESTMENT",
            x: 65, z: 151,
            rotation: -135,
            size: 20,
            type: "obelisk"
        },
        {
            id: "administration",
            name: "ADMINISTRATION & LEGAL",
            x: -37, z: 171,
            rotation: 155,
            size: 20,
            type: "citadel"
        },
        {
            id: "merchandise",
            name: "MERCHANDISE STORE",
            x: 36, z: 173,
            rotation: -150,
            size: 19,
            type: "market"
        },
        {
            id: "hardware",
            name: "HARDWARE DIVISION",
            x: -68, z: 205,
            rotation: 80,
            size: 20,
            type: "reactor"
        },
        {
            id: "future_worlds",
            name: "FUTURE WORLDS MUSEUM",
            x: 64, z: 201,
            rotation: -70,
            size: 23,
            type: "sanctum"
        },
        {
            id: "arcade",
            name: "HEXCORE ARCADE",
            x: 76, z: 108,
            rotation: -105,
            size: 17,
            type: "arcade"
        },
        {
            id: "cinema",
            name: "HEXCORE CINEMA",
            x: 8, z: 151,
            rotation: 18,
            size: 23,
            type: "cinema"
        },
        {
            id: "stadium",
            name: "PERFORMANCE STADIUM",
            x: -8, z: 211,
            rotation: 170,
            size: 28,
            type: "arena"
        }
    ];

    // =====================================================
    // SECTION 04 // GEOMETRY HELPERS
    // =====================================================

    function box(parent, w, h, d, x, y, z, mat) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function cylinder(
        parent, top, bottom, height,
        x, y, z, mat, sides = 12
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

    function cone(
        parent, radius, height,
        x, y, z, mat, sides = 6
    ) {

        const mesh = new THREE.Mesh(
            new THREE.ConeGeometry(
                radius, height, sides
            ),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function sphere(
        parent, radius,
        x, y, z, mat,
        segments = 16
    ) {

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                radius, segments, 10
            ),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function ring(
        parent, radius, thickness,
        x, y, z, mat,
        vertical = false
    ) {

        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(
                radius, thickness, 6, 48
            ),
            mat
        );

        if (!vertical) {
            mesh.rotation.x = Math.PI / 2;
        }

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function beamBetween(parent, start, end, width, mat) {

        const a = new THREE.Vector3(...start);
        const b = new THREE.Vector3(...end);

        const direction = new THREE.Vector3()
            .subVectors(b, a);

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                width, width,
                direction.length(), 6
            ),
            mat
        );

        mesh.position.copy(a).add(b).multiplyScalar(0.5);

        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        parent.add(mesh);
        return mesh;
    }

    // =====================================================
    // SECTION 05 // FUTURISTIC FACADES
    // =====================================================

    function addGlassBands(group, radius, levels, mat) {

        for (let i = 1; i <= levels; i++) {

            const y = i * 4.5;

            cylinder(
                group,
                radius, radius,
                0.45,
                0, y, 0,
                mat, 12
            );
        }
    }

    function addVerticalFins(
        group, radius, height,
        count, mat
    ) {

        for (let i = 0; i < count; i++) {

            const angle =
                (i / count) * Math.PI * 2;

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            const fin = box(
                group,
                0.22, height, 0.65,
                x, height / 2, z,
                mat
            );

            fin.rotation.y = angle;
        }
    }

    // =====================================================
    // SECTION 06 // HOLOGRAPHIC BUILDING SIGNS
    // =====================================================

    function makeSign(group, name, color, front) {

        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(8,7,23,0.94)";
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = color;
        ctx.lineWidth = 9;
        ctx.strokeRect(10, 10, 1004, 236);

        ctx.fillStyle = "#F0EAFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowColor = color;
        ctx.shadowBlur = 18;

        let fontSize = 72;

        do {
            ctx.font = `bold ${fontSize}px Arial`;
            if (ctx.measureText(name).width < 930) break;
            fontSize -= 3;
        } while (fontSize > 30);

        ctx.fillText(name, 512, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(13, 3.25),
            new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );

        sign.position.set(0, 7.1, front + 0.65);
        group.add(sign);
    }

    // =====================================================
    // SECTION 07 // SHARED ENTRANCE STRUCTURE
    // =====================================================

    
    function addEntrance(group, front, accent) {

        // Automatic two-panel sliding entrance.
        // The building interior will be added later.

        const doorFrame = new THREE.Group();
        doorFrame.position.z = front;

        group.add(doorFrame);

        // SECTION 07A // DOOR FRAME

        for (const x of [-4.1, 4.1]) {

            box(
                doorFrame, 0.45, 6.1, 1.25,
                x, 3.05, 0.8,
                materials.titanium
            );

            box(
                doorFrame, 0.11, 5.6, 0.15,
                x < 0 ? x + 0.28 : x - 0.28,
                3.05, 1.54,
                accent
            );
        }

        box(
            doorFrame, 8.7, 0.6, 1.4,
            0, 6.1, 0.8,
            materials.obsidian
        );

        box(
            doorFrame, 8.2, 0.12, 0.2,
            0, 5.7, 1.56,
            accent
        );

        // SECTION 07B // TWO SLIDING DOOR PANELS

        const leftDoor = new THREE.Group();
        const rightDoor = new THREE.Group();

        leftDoor.position.x = -1.65;
        rightDoor.position.x = 1.65;

        for (const [panel, x] of [
            [leftDoor, -1.65],
            [rightDoor, 1.65]
        ]) {

            box(
                panel, 3.3, 5.2, 0.18,
                0, 2.7, 1.57,
                materials.glass
            );

            box(
                panel, 0.12, 5, 0.24,
                x < 0 ? 1.54 : -1.54,
                2.7, 1.71,
                accent
            );

            box(
                panel, 2.8, 0.1, 0.25,
                0, 0.72, 1.72,
                accent
            );
        }

        doorFrame.add(leftDoor);
        doorFrame.add(rightDoor);

        // SECTION 07C // FLOOR ACCESS LIGHT

        box(
            doorFrame, 8, 0.08, 1.7,
            0, 0.055, 2,
            accent
        );

        return {
            leftDoor,
            rightDoor,
            progress: 0
        };
    }


    // =====================================================
    // SECTION 08 // DISTINCT BUILDING ARCHITECTURE
    // =====================================================

    function createArchitecture(def, group) {

        let front = def.size * 0.48;
        let accent = materials.purple;
        let signColor = "#8650E8";

        switch (def.type) {

            // =================================================
            // SECTION 08A // GAME GALLERY
            // Angular exhibition prism
            // =================================================

            case "prism": {

                accent = materials.purple;
                front = 10;

                const base = cylinder(
                    group, 11, 13, 18,
                    0, 9, 0,
                    materials.violetGlass, 5
                );

                base.rotation.y = Math.PI / 5;

                const crown = cone(
                    group, 11, 10,
                    0, 23, 0,
                    materials.obsidian, 5
                );

                crown.rotation.y = Math.PI / 5;

                for (let i = 0; i < 5; i++) {

                    const angle = i * Math.PI * 2 / 5;

                    const x = Math.sin(angle) * 12;
                    const z = Math.cos(angle) * 12;

                    beamBetween(
                        group,
                        [x, 2, z],
                        [0, 28, 0],
                        0.12,
                        materials.cyan
                    );
                }

                break;
            }

            // =================================================
            // SECTION 08B // DEVELOPMENT STUDIO
            // Split futuristic skyscraper
            // =================================================

            case "spire": {

                accent = materials.cyan;
                signColor = "#8CD6FD";
                front = 10;

                for (const x of [-5, 5]) {

                    const shaft = box(
                        group,
                        8, x < 0 ? 35 : 43, 15,
                        x,
                        x < 0 ? 17.5 : 21.5,
                        -2,
                        materials.glass
                    );

                    shaft.rotation.z =
                        x < 0 ? -0.055 : 0.055;

                    box(
                        group, 0.22, 35, 0.3,
                        x < 0 ? -8.8 : 8.8,
                        18, 5.7,
                        accent
                    );
                }

                box(
                    group, 22, 4, 14,
                    0, 5, 0,
                    materials.obsidian
                );

                beamBetween(
                    group,
                    [-5, 34, -2],
                    [5, 42, -2],
                    0.35,
                    accent
                );

                cone(
                    group, 2, 11,
                    5, 49, -2,
                    accent, 4
                );

                break;
            }

            // =================================================
            // SECTION 08C // COMMUNITY CENTER
            // Wide hexagonal social hall
            // =================================================

            case "hexhall": {

                accent = materials.cyan;
                signColor = "#8CD6FD";
                front = 9;

                cylinder(
                    group, 12, 13, 13,
                    0, 6.5, 0,
                    materials.midnight, 6
                );

                cylinder(
                    group, 9, 11, 6,
                    0, 16, 0,
                    materials.glass, 6
                );

                cone(
                    group, 11, 7,
                    0, 22.5, 0,
                    materials.titanium, 6
                );

                ring(
                    group, 11.5, 0.25,
                    0, 13.5, 0,
                    accent
                );

                addVerticalFins(
                    group, 12.2, 12,
                    6, accent
                );

                break;
            }

            // =================================================
            // SECTION 08D // SUPPORT CENTER
            // Rounded high-tech service pod
            // =================================================

            case "pod": {

                accent = materials.purple;
                front = 8;

                cylinder(
                    group, 10, 11, 9,
                    0, 4.5, 0,
                    materials.obsidian, 16
                );

                const dome = sphere(
                    group, 10,
                    0, 9, 0,
                    materials.glass, 24
                );

                dome.scale.y = 0.6;

                ring(
                    group, 10.1, 0.35,
                    0, 9, 0,
                    accent
                );

                ring(
                    group, 7, 0.18,
                    0, 12.5, 0,
                    materials.cyan
                );

                break;
            }

            // =================================================
            // SECTION 08E // MEDIA CENTER
            // Twisted crystal broadcasting tower
            // =================================================

            case "crystal": {

                accent = materials.magenta;
                signColor = "#E34BC9";
                front = 9;

                cylinder(
                    group, 10, 12, 12,
                    0, 6, 0,
                    materials.obsidian, 6
                );

                for (let i = 0; i < 4; i++) {

                    const section = cylinder(
                        group,
                        8.5 - i * 1.1,
                        9.5 - i,
                        8,
                        0, 16 + i * 7, 0,
                        i % 2 === 0
                            ? materials.glass
                            : materials.violetGlass,
                        5
                    );

                    section.rotation.y =
                        i * Math.PI / 8;

                    ring(
                        group,
                        9 - i,
                        0.16,
                        0,
                        12 + i * 7,
                        0,
                        accent
                    );
                }

                cone(
                    group, 4, 11,
                    0, 49, 0,
                    accent, 5
                );

                break;
            }

            // =================================================
            // SECTION 08F // BUSINESS & INVESTMENT
            // Black-and-gold obelisk
            // =================================================

            case "obelisk": {

                accent = materials.gold;
                signColor = "#E5AF69";
                front = 9;

                cylinder(
                    group, 11, 13, 9,
                    0, 4.5, 0,
                    materials.obsidian, 4
                ).rotation.y = Math.PI / 4;

                const tower = cylinder(
                    group, 5, 9, 38,
                    0, 28, 0,
                    materials.titanium, 4
                );

                tower.rotation.y = Math.PI / 4;

                cone(
                    group, 6, 13,
                    0, 53.5, 0,
                    materials.glass, 4
                ).rotation.y = Math.PI / 4;

                for (const x of [-7, 7]) {

                    beamBetween(
                        group,
                        [x, 9, 0],
                        [x * 0.35, 43, 0],
                        0.2,
                        accent
                    );
                }

                ring(
                    group, 8, 0.2,
                    0, 9, 0,
                    accent
                );

                break;
            }

            // =================================================
            // SECTION 08G // ADMINISTRATION & LEGAL
            // Cyber-gothic fortress
            // =================================================

            case "citadel": {

                accent = materials.purple;
                front = 10;

                box(
                    group, 22, 15, 18,
                    0, 7.5, 0,
                    materials.obsidian
                );

                for (const x of [-10, 10]) {

                    cylinder(
                        group, 2.6, 3.2, 24,
                        x, 12, 0,
                        materials.titanium, 6
                    );

                    cone(
                        group, 3.2, 9,
                        x, 28.5, 0,
                        materials.violetGlass, 6
                    );
                }

                box(
                    group, 10, 21, 12,
                    0, 15.5, -2,
                    materials.midnight
                );

                cone(
                    group, 7, 11,
                    0, 31.5, -2,
                    materials.glass, 4
                );

                for (const x of [-6, 0, 6]) {

                    box(
                        group, 0.18, 12, 0.2,
                        x, 11, 9.2,
                        accent
                    );
                }

                break;
            }

            // =================================================
            // SECTION 08H // MERCHANDISE STORE
            // Low futuristic market pavilion
            // =================================================

            case "market": {

                accent = materials.cyan;
                signColor = "#8CD6FD";
                front = 9;

                cylinder(
                    group, 12, 14, 9,
                    0, 4.5, 0,
                    materials.glass, 8
                );

                cylinder(
                    group, 15, 13, 1.3,
                    0, 10, 0,
                    materials.obsidian, 8
                );

                for (let i = 0; i < 8; i++) {

                    const angle = i * Math.PI / 4;

                    const x = Math.sin(angle) * 13;
                    const z = Math.cos(angle) * 13;

                    beamBetween(
                        group,
                        [x, 9.5, z],
                        [0, 16, 0],
                        0.16,
                        accent
                    );
                }

                cone(
                    group, 13, 6,
                    0, 13, 0,
                    materials.titanium, 8
                );

                ring(
                    group, 14.5, 0.25,
                    0, 10.7, 0,
                    accent
                );

                break;
            }

            // =================================================
            // SECTION 08I // HARDWARE DIVISION
            // Futuristic engineering reactor
            // =================================================

            case "reactor": {

                accent = materials.cyan;
                signColor = "#8CD6FD";
                front = 9;

                cylinder(
                    group, 10, 12, 13,
                    0, 6.5, 0,
                    materials.obsidian, 8
                );

                cylinder(
                    group, 6, 9, 19,
                    0, 22.5, 0,
                    materials.glass, 8
                );

                addGlassBands(
                    group, 7.4, 5,
                    accent
                );

                for (let i = 0; i < 4; i++) {

                    const angle =
                        i * Math.PI / 2;

                    const x = Math.sin(angle) * 10;
                    const z = Math.cos(angle) * 10;

                    cylinder(
                        group, 2, 2.6, 20,
                        x, 10, z,
                        materials.titanium, 8
                    );

                    cone(
                        group, 2.2, 5,
                        x, 22.5, z,
                        accent, 6
                    );
                }

                sphere(
                    group, 3.2,
                    0, 34, 0,
                    materials.violetGlass
                );

                ring(
                    group, 5.2, 0.22,
                    0, 34, 0,
                    accent, true
                );

                break;
            }

            // =================================================
            // SECTION 08J // FUTURE WORLDS MUSEUM
            // Monumental fantasy sanctum
            // =================================================

            case "sanctum": {

                accent = materials.purple;
                front = 10;

                cylinder(
                    group, 13, 15, 11,
                    0, 5.5, 0,
                    materials.obsidian, 8
                );

                cylinder(
                    group, 10, 13, 12,
                    0, 17, 0,
                    materials.violetGlass, 8
                );

                cone(
                    group, 11, 17,
                    0, 31.5, 0,
                    materials.glass, 8
                );

                for (let i = 0; i < 8; i++) {

                    const angle =
                        i * Math.PI / 4;

                    const x = Math.sin(angle) * 12;
                    const z = Math.cos(angle) * 12;

                    beamBetween(
                        group,
                        [x, 11, z],
                        [0, 40, 0],
                        0.13,
                        accent
                    );
                }

                ring(
                    group, 12, 0.2,
                    0, 11.3, 0,
                    accent
                );

                break;
            }

            // =================================================
            // SECTION 08K // HEXCORE ARCADE
            // Illuminated entertainment rotunda
            // =================================================

            case "arcade": {

                accent = materials.magenta;
                signColor = "#E34BC9";
                front = 9;

                cylinder(
                    group, 12, 13, 12,
                    0, 6, 0,
                    materials.violetGlass, 10
                );

                addVerticalFins(
                    group, 12.4, 12,
                    10, accent
                );

                cylinder(
                    group, 13.5, 12.5, 1.4,
                    0, 12.5, 0,
                    materials.obsidian, 10
                );

                cone(
                    group, 11, 9,
                    0, 17.5, 0,
                    materials.glass, 10
                );

                ring(
                    group, 12.6, 0.32,
                    0, 13.5, 0,
                    materials.cyan
                );

                ring(
                    group, 7, 0.2,
                    0, 18, 0,
                    accent
                );

                break;
            }

            // =================================================
            // SECTION 08L // HEXCORE CINEMA
            // Cinematic geodesic theater
            // =================================================

            case "cinema": {

                accent = materials.purple;
                front = 11;

                cylinder(
                    group, 15, 16, 11,
                    0, 5.5, 0,
                    materials.obsidian, 16
                );

                const dome = sphere(
                    group, 15,
                    0, 11, 0,
                    materials.glass, 24
                );

                dome.scale.y = 0.66;

                ring(
                    group, 15, 0.35,
                    0, 11, 0,
                    accent
                );

                ring(
                    group, 13, 0.15,
                    0, 16, 0,
                    materials.cyan, true
                );

                const orbit = ring(
                    group, 14.7, 0.2,
                    0, 14, 0,
                    materials.magenta, true
                );

                orbit.rotation.y = Math.PI / 3;

                break;
            }

            // =================================================
            // SECTION 08M // PERFORMANCE STADIUM
            // Giant theatrical amphitheater
            // =================================================

            case "arena": {

                accent = materials.gold;
                signColor = "#E5AF69";
                front = 17;

                cylinder(
                    group, 19, 21, 11,
                    0, 5.5, 0,
                    materials.obsidian, 16
                );

                cylinder(
                    group, 21, 21, 2,
                    0, 12, 0,
                    materials.titanium, 16
                );

                for (const y of [4, 8, 12]) {

                    ring(
                        group, 20, 0.3,
                        0, y, 0,
                        accent
                    );
                }

                const roof = sphere(
                    group, 19,
                    0, 13, 0,
                    materials.violetGlass, 24
                );

                roof.scale.y = 0.5;

                // Four colossal fantasy pylons.

                for (const x of [-15, 15]) {
                    for (const z of [-12, 12]) {

                        cylinder(
                            group, 1.6, 2.1, 20,
                            x, 10, z,
                            materials.titanium, 6
                        );

                        cone(
                            group, 2.3, 9,
                            x, 24.5, z,
                            accent, 6
                        );
                    }
                }

                break;
            }
        }

        // =====================================================
        // SECTION 09 // BUILDING ACCESS FACADE
        // =====================================================

                const doors = addEntrance(group, front, accent);

        makeSign(
            group,
            def.name,
            signColor,
            front
        );

        // SECTION 09A // GROUND-LEVEL LIGHTING

        // Small guide lights point toward the entrance.

        for (const x of [-5.5, 5.5]) {

            box(
                group,
                0.24, 0.08, 4,
                x, 0.08, front + 3.5,
                accent
            );
        }

        // SECTION 09B // ENTRANCE LANDING

        box(
            group,
            11, 0.12, 5,
            0, 0.04, front + 3.5,
            materials.titanium
        );

              return {
            front,
            accent,
            doors
        };
    }

    // =====================================================
    // SECTION 10 // BUILD THE CITY DEPARTMENTS
    // =====================================================
    const automaticDoors = [];
    const directory = [];

    for (const def of departments) {

        const group = new THREE.Group();

        group.name = def.id;

        group.position.set(
            def.x, 0, def.z
        );

        group.rotation.y =
            THREE.MathUtils.degToRad(
                def.rotation
            );

      
        const architecture = createArchitecture(def, group);

        automaticDoors.push({
            group,
            front: architecture.front,
            doors: architecture.doors
        });


        city.add(group);

        directory.push({
            id: def.id,
            name: def.name,
            x: def.x,
            z: def.z,
            rotation: def.rotation,
            size: def.size,
            type: def.type
        });
    }

    // =====================================================
    // SECTION 11 // DEPARTMENT DIRECTORY
    // =====================================================

    window.hexcoreCityBuildingDirectory = directory;

   
    // =====================================================
    // SECTION 12 // AUTOMATIC CITY DOOR ANIMATION
    // =====================================================

    const clock = new THREE.Clock();

    const playerPosition = new THREE.Vector3();
    const doorPosition = new THREE.Vector3();

    let playerPositionKnown = false;

    // Receive player coordinates from the existing
    // player movement system.

    window.addEventListener(
        "hexcore-player-position",
        event => {

            playerPosition.set(
                event.detail.x,
                0,
                event.detail.z
            );

            playerPositionKnown = true;
        }
    );

    function animateCityBuildings() {

        const delta = Math.min(clock.getDelta(), 0.05);

        for (const entrance of automaticDoors) {

            // Find the world position of this doorway.

            doorPosition.set(
                0,
                0,
                entrance.front + 2
            );

            entrance.group.localToWorld(doorPosition);

            const distance =
                playerPosition.distanceTo(doorPosition);

            // Doors open when visitors come within
            // approximately 8 world units.

            const shouldOpen =
                playerPositionKnown && distance < 8;

            const target = shouldOpen ? 1 : 0;

            entrance.doors.progress =
                THREE.MathUtils.damp(
                    entrance.doors.progress,
                    target,
                    4,
                    delta
                );

            const opening = entrance.doors.progress;

            // Slide panels away from the middle.

            entrance.doors.leftDoor.position.x =
                -1.65 - opening * 3.4;

            entrance.doors.rightDoor.position.x =
                1.65 + opening * 3.4;
        }
    }


    // =====================================================
    // SECTION 13 // OUTPUT
    // =====================================================

    return animateCityBuildings;
}
