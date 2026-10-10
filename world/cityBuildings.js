
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // WALKABLE CITY DEPARTMENTS
// =====================================================

export function createCityBuildings(scene) {

    // =====================================================
    // SECTION 01 // SHARED MATERIALS
    // =====================================================

    const material = (color, basic = false) => basic
        ? new THREE.MeshBasicMaterial({
            color,
            side: THREE.DoubleSide
        })
        : new THREE.MeshStandardMaterial({
            color,
            metalness: 0.55,
            roughness: 0.35,
            side: THREE.DoubleSide
        });

    const dark = material(0x111322);
    const steel = material(0x354057);
    const glass = material(0x1A4260);
    const violetGlass = material(0x442766);

    const purple = material(0x8650E8, true);
    const cyan = material(0x8CD6FD, true);
    const magenta = material(0xE34BC9, true);
    const gold = material(0xE5AF69, true);

    const accent = {
        purple, cyan, magenta, gold
    };

    const accentHex = {
        purple: "#8650E8",
        cyan: "#8CD6FD",
        magenta: "#E34BC9",
        gold: "#E5AF69"
    };

    // =====================================================
    // SECTION 02 // CITY DIRECTORY AND VARIED PLACEMENT
    // =====================================================

    // Keep existing locations and rotations.

    const buildings = [
        ["game_gallery", "GAME GALLERY",
            -47, 77, 70, 13, 15, "prism", "purple"],

        ["development", "DEVELOPMENT STUDIO",
            47, 89, -65, 12, 22, "spire", "cyan"],

        ["community", "COMMUNITY CENTER",
            -42, 116, 120, 14, 13, "hexhall", "cyan"],

        ["support", "SUPPORT CENTER",
            42, 126, -115, 11, 11, "pod", "purple"],

        ["media", "MEDIA CENTER",
            -68, 146, 42, 12, 18, "crystal", "magenta"],

        ["business", "BUSINESS & INVESTMENT",
            65, 151, -135, 12, 20, "obelisk", "gold"],

        ["administration", "ADMINISTRATION & LEGAL",
            -37, 171, 155, 13, 17, "citadel", "purple"],

        ["merchandise", "MERCHANDISE STORE",
            36, 173, -150, 14, 12, "market", "cyan"],

        ["hardware", "HARDWARE DIVISION",
            -68, 205, 80, 13, 18, "reactor", "cyan"],

        ["future_worlds", "FUTURE WORLDS MUSEUM",
            64, 201, -70, 15, 19, "sanctum", "purple"],

        ["arcade", "HEXCORE ARCADE",
            76, 108, -105, 13, 14, "arcade", "magenta"],

        ["cinema", "HEXCORE CINEMA",
            8, 151, 18, 17, 15, "cinema", "purple"],

        ["stadium", "PERFORMANCE STADIUM",
            -8, 211, 170, 21, 18, "arena", "gold"]
    ];

    const city = new THREE.Group();
    city.name = "HEXCORE_CITY_BUILDINGS";
    scene.add(city);

    const activeDoors = [];
    const directory = [];

    // =====================================================
    // SECTION 03 // REUSABLE CONSTRUCTION HELPERS
    // =====================================================

    function box(
        parent, w, h, d,
        x, y, z, mat, rotation = 0
    ) {

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, d),
            mat
        );

        mesh.position.set(x, y, z);
        mesh.rotation.y = rotation;
        parent.add(mesh);

        return mesh;
    }

    function cylinder(
        parent, top, bottom, h,
        x, y, z, mat, sides = 12
    ) {

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                top, bottom, h, sides
            ),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function cone(
        parent, r, h,
        x, y, z, mat, sides = 8
    ) {

        const mesh = new THREE.Mesh(
            new THREE.ConeGeometry(r, h, sides),
            mat
        );

        mesh.position.set(x, y, z);
        parent.add(mesh);

        return mesh;
    }

    function ring(
        parent, r, y, mat, vertical = false
    ) {

        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(
                r, 0.16, 6, 48
            ),
            mat
        );

        mesh.position.y = y;

        if (!vertical) {
            mesh.rotation.x = Math.PI / 2;
        }

        parent.add(mesh);
        return mesh;
    }

    // =====================================================
    // SECTION 04 // HOLLOW BUILDING WITH FRONT OPENING
    // =====================================================

    function createShell(group, radius, height, trim) {

        const sides = 12;
        const step = Math.PI * 2 / sides;

        const front =
            radius * Math.cos(step / 2);

        // Construct separate exterior wall panels.
        // The front-facing panel is omitted.

        for (let i = 0; i < sides; i++) {

            if (i === sides - 1) {
                continue;
            }

            const a = (i + 0.5) * step;
            const b = (i + 1.5) * step;

            const ax = Math.sin(a) * radius;
            const az = Math.cos(a) * radius;

            const bx = Math.sin(b) * radius;
            const bz = Math.cos(b) * radius;

            const length = Math.hypot(
                bx - ax,
                bz - az
            );

            const angle =
                -Math.atan2(bz - az, bx - ax);

            // Solid wall panel.

            box(
                group,
                length + 0.35, height, 0.5,
                (ax + bx) / 2,
                height / 2,
                (az + bz) / 2,
                dark,
                angle
            );

            // Elevated decorative window.

            box(
                group,
                length * 0.68, 2.3, 0.14,
                (ax + bx) / 2,
                height * 0.64,
                (az + bz) / 2,
                glass,
                angle
            );

            // Illuminated wall crown.

            box(
                group,
                length, 0.15, 0.65,
                (ax + bx) / 2,
                height - 0.4,
                (az + bz) / 2,
                trim,
                angle
            );
        }

        // A real floor and overhead ceiling.
        // The space between them remains empty.

        cylinder(
            group,
            radius - 0.35,
            radius - 0.35,
            0.13,
            0, 0, 0,
            steel, 12
        );

        cylinder(
            group,
            radius + 0.4,
            radius + 0.4,
            0.65,
            0, height + 0.3, 0,
            dark, 12
        );

        ring(
            group,
            radius + 0.15,
            height + 0.7,
            trim
        );

        return front;
    }

    // =====================================================
    // SECTION 05 // CLEAR, READABLE DEPARTMENT SIGNS
    // =====================================================

    function addSign(group, title, front, color) {

        const canvas = document.createElement("canvas");

        canvas.width = 1024;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#080914";
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = color;
        ctx.lineWidth = 12;
        ctx.strokeRect(9, 9, 1006, 238);

        let size = 74;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#F3EEFF";

        do {

            ctx.font = `bold ${size}px Arial`;

            if (
                ctx.measureText(title).width <= 930
            ) {
                break;
            }

            size -= 3;

        } while (size > 30);

        ctx.fillText(title, 512, 128);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const sign = new THREE.Mesh(
            new THREE.PlaneGeometry(13, 3.1),
            new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                depthTest: false,
                transparent: true
            })
        );

        // Outside and above the doorway.

        sign.position.set(
            0,
            8.2,
            front + 2.0
        );

        sign.renderOrder = 5;

        group.add(sign);
    }

    // =====================================================
    // SECTION 06 // FUNCTIONAL AUTOMATIC DOUBLE DOORS
    // =====================================================

    function addDoors(group, front, trim) {

        const entrance = new THREE.Group();

        entrance.position.z = front + 0.45;
        group.add(entrance);

        // Door frame.

        for (const x of [-3.55, 3.55]) {

            box(
                entrance,
                0.3, 6.0, 0.65,
                x, 3, 0,
                steel
            );
        }

        box(
            entrance,
            7.5, 0.4, 0.7,
            0, 6, 0,
            trim
        );

        // Sliding glass panels.

        const left = new THREE.Group();
        const right = new THREE.Group();

        left.position.x = -1.6;
        right.position.x = 1.6;

        for (const panel of [left, right]) {

            box(
                panel,
                3.18, 5.7, 0.14,
                0, 2.85, 0,
                glass
            );

            box(
                panel,
                2.8, 0.1, 0.17,
                0, 0.75, 0.1,
                trim
            );
        }

        entrance.add(left, right);

        return {
            group,
            front,
            left,
            right,
            progress: 0
        };
    }

    // =====================================================
    // SECTION 07 // DISTINCT ROOFTOPS AND SILHOUETTES
    // =====================================================

    // Decorative structures remain above the rooms.

    function addSignature(group, type, r, h, trim) {

        if (type === "prism") {

            cone(
                group,
                r * 0.83, 14,
                0, h + 7, 0,
                violetGlass, 5
            );

            ring(group, r * 0.75, h + 2, trim);

        } else if (type === "spire") {

            for (const x of [-4, 4]) {

                box(
                    group,
                    5, 17, 6,
                    x, h + 9, 0,
                    glass
                );

                cone(
                    group,
                    3, 8,
                    x, h + 21, 0,
                    trim, 4
                );
            }

        } else if (type === "hexhall") {

            cylinder(
                group,
                r * 0.65, r * 0.9, 5,
                0, h + 3, 0,
                glass, 6
            );

            cone(
                group,
                r * 0.7, 7,
                0, h + 9, 0,
                trim, 6
            );

        } else if (type === "pod") {

            const dome = new THREE.Mesh(
                new THREE.SphereGeometry(
                    r * 0.85,
                    18, 12,
                    0, Math.PI * 2,
                    0, Math.PI / 2
                ),
                glass
            );

            dome.scale.y = 0.58;
            dome.position.y = h + 0.6;

            group.add(dome);

            ring(
                group,
                r * 0.8,
                h + 1,
                trim
            );

        } else if (type === "crystal") {

            const crystal = new THREE.Mesh(
                new THREE.IcosahedronGeometry(8, 0),
                violetGlass
            );

            crystal.position.y = h + 8;
            crystal.scale.y = 1.7;

            group.add(crystal);

            ring(group, 9, h + 5, trim, true);

        } else if (type === "obelisk") {

            cylinder(
                group,
                4, 7, 19,
                0, h + 9.5, 0,
                steel, 4
            ).rotation.y = Math.PI / 4;

            cone(
                group,
                5, 13,
                0, h + 25.5, 0,
                trim, 4
            );

        } else if (type === "citadel") {

            for (const x of [-r * 0.68, r * 0.68]) {

                cylinder(
                    group,
                    2.8, 3.1, 10,
                    x, h + 5, 0,
                    steel, 6
                );

                cone(
                    group,
                    3.2, 9,
                    x, h + 14.5, 0,
                    trim, 6
                );
            }

            cone(
                group,
                7, 9,
                0, h + 5, 0,
                violetGlass, 6
            );

        } else if (type === "market") {

            cone(
                group,
                r * 0.9, 7,
                0, h + 4, 0,
                glass, 8
            );

            ring(
                group,
                r * 0.95,
                h + 1,
                trim
            );

        } else if (type === "reactor") {

            for (const x of [-6, 6]) {

                cylinder(
                    group,
                    2.3, 2.8, 9,
                    x, h + 4.5, 0,
                    steel, 8
                );

                cone(
                    group,
                    2.5, 5,
                    x, h + 11.5, 0,
                    trim, 6
                );
            }

            ring(
                group,
                7, h + 8,
                trim, true
            );

        } else if (type === "sanctum") {

            cone(
                group,
                r * 0.79, 20,
                0, h + 10, 0,
                violetGlass, 8
            );

            ring(
                group,
                r * 0.7,
                h + 2,
                trim
            );

            ring(
                group,
                r * 0.42,
                h + 13,
                trim, true
            );

        } else if (type === "arcade") {

            cone(
                group,
                r * 0.84, 8,
                0, h + 4, 0,
                glass, 10
            );

            for (let i = 0; i < 10; i++) {

                const a = i * Math.PI / 5;

                box(
                    group,
                    0.3, 4, 0.4,
                    Math.sin(a) * r * 0.85,
                    h + 2,
                    Math.cos(a) * r * 0.85,
                    trim, a
                );
            }

        } else if (type === "cinema") {

            const dome = new THREE.Mesh(
                new THREE.SphereGeometry(
                    r * 0.85,
                    24, 12,
                    0, Math.PI * 2,
                    0, Math.PI / 2
                ),
                glass
            );

            dome.scale.y = 0.75;
            dome.position.y = h + 0.4;

            group.add(dome);

            ring(
                group,
                r * 0.95,
                h + 1,
                trim
            );

            ring(
                group,
                r * 0.8,
                h + 7,
                trim, true
            );

        } else if (type === "arena") {

            const dome = new THREE.Mesh(
                new THREE.SphereGeometry(
                    r * 0.8,
                    24, 12,
                    0, Math.PI * 2,
                    0, Math.PI / 2
                ),
                violetGlass
            );

            dome.scale.y = 0.5;
            dome.position.y = h + 0.5;

            group.add(dome);

            for (let i = 0; i < 6; i++) {

                const a = i * Math.PI / 3;

                const x =
                    Math.sin(a) * r * 0.83;

                const z =
                    Math.cos(a) * r * 0.83;

                cylinder(
                    group,
                    1.3, 1.6, 9,
                    x, h + 4.5, z,
                    steel, 6
                );

                cone(
                    group,
                    1.7, 6,
                    x, h + 12, z,
                    trim, 6
                );
            }
        }
    }

    // =====================================================
    // SECTION 08 // ASSEMBLE CITY BUILDINGS
    // =====================================================

    for (
        const [
            id, name, x, z, rotation,
            radius, height, type, glow
        ] of buildings
    ) {

        const group = new THREE.Group();

        group.name = id;
        group.position.set(x, 0, z);

        group.rotation.y =
            THREE.MathUtils.degToRad(rotation);

        const front = createShell(
            group,
            radius,
            height,
            accent[glow]
        );

        addSignature(
            group,
            type,
            radius,
            height,
            accent[glow]
        );

        addSign(
            group,
            name,
            front,
            accentHex[glow]
        );

        const door = addDoors(
            group,
            front,
            accent[glow]
        );

        activeDoors.push(door);

        directory.push({
            id,
            name,
            x,
            z,
            rotation,
            radius,
            front,
            type,
            doorOpen: 0
        });

        city.add(group);
    }

    window.hexcoreCityBuildingDirectory = directory;

    // =====================================================
    // SECTION 09 // AUTOMATIC DOOR ANIMATION
    // =====================================================

    let playerX = 0;
    let playerZ = 0;
    let hasPlayer = false;

    window.addEventListener(
        "hexcore-player-position",
        event => {

            playerX = event.detail.x;
            playerZ = event.detail.z;

            hasPlayer = true;
        }
    );

    const clock = new THREE.Clock();
    const doorWorld = new THREE.Vector3();

    function animateCityBuildings() {

        const delta = Math.min(
            clock.getDelta(),
            0.05
        );

        activeDoors.forEach((door, i) => {

            doorWorld.set(
                0, 0, door.front + 1.2
            );

            door.group.localToWorld(doorWorld);

            const distance = Math.hypot(
                playerX - doorWorld.x,
                playerZ - doorWorld.z
            );

            const target =
                hasPlayer && distance < 9 ? 1 : 0;

            door.progress = THREE.MathUtils.damp(
                door.progress,
                target,
                5,
                delta
            );

            door.left.position.x =
                -1.6 - 3.25 * door.progress;

            door.right.position.x =
                1.6 + 3.25 * door.progress;

            directory[i].doorOpen = door.progress;
        });
    }

    // =====================================================
    // SECTION 10 // OUTPUT
    // =====================================================

    return animateCityBuildings;
}
