
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // NPC CHARACTER SYSTEM
// =====================================================

// =====================================================
// SECTION 01 // CREATE HEADQUARTERS NPCS
// =====================================================

export function createNPCs(scene) {

    // =====================================================
    // SECTION 02 // CHARACTER MATERIALS
    // =====================================================

    const uniformMaterial = new THREE.MeshStandardMaterial({
        color: 0x191528,
        metalness: 0.45,
        roughness: 0.45
    });

    const skinMaterial = new THREE.MeshStandardMaterial({
        color: 0xBA8F7D,
        roughness: 0.75
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
        color: 0x17111F,
        roughness: 0.65
    });

    const purpleTrim = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyanTrim = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // =====================================================
    // SECTION 03 // RECEPTION REPRESENTATIVE
    // =====================================================

    const receptionist = new THREE.Group();

    receptionist.position.set(0, 0, -26.2);

    // SECTION 03A // LOWER BODY

    const legs = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.38, 1.0, 10),
        uniformMaterial
    );

    legs.position.y = 0.5;
    receptionist.add(legs);

    // SECTION 03B // UPPER BODY

    const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.25, 0.85, 10),
        uniformMaterial
    );

    torso.position.y = 1.38;
    receptionist.add(torso);

    // SECTION 03C // HEAD

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.26, 16, 12),
        skinMaterial
    );

    head.position.y = 2.04;
    receptionist.add(head);

    // SECTION 03D // HAIR

    const hair = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.28,
            16,
            12,
            0,
            Math.PI * 2,
            0,
            Math.PI * 0.55
        ),
        hairMaterial
    );

    hair.position.y = 2.11;
    receptionist.add(hair);

    // SECTION 03E // ARMS

    for (const x of [-0.42, 0.42]) {

        const arm = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.09, 0.68, 8),
            uniformMaterial
        );

        arm.position.set(x, 1.38, 0);
        arm.rotation.z = x < 0 ? -0.14 : 0.14;

        receptionist.add(arm);
    }

    // SECTION 03F // UNIFORM LIGHTING

    const chestTrim = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.05, 0.06),
        purpleTrim
    );

    chestTrim.position.set(0, 1.58, 0.28);
    receptionist.add(chestTrim);

    const badge = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.14, 0.05),
        cyanTrim
    );

    badge.position.set(-0.15, 1.68, 0.25);
    receptionist.add(badge);

    // =====================================================
    // SECTION 04 // RECEPTIONIST NAME DISPLAY
    // =====================================================

    const nameCanvas = document.createElement("canvas");
    nameCanvas.width = 1024;
    nameCanvas.height = 256;

    const nameContext = nameCanvas.getContext("2d");

    nameContext.clearRect(0, 0, 1024, 256);
    nameContext.textAlign = "center";
    nameContext.textBaseline = "middle";
    nameContext.fillStyle = "#8CD6FD";
    nameContext.font = "bold 70px Consolas";

    nameContext.fillText(
        "RECEPTION REPRESENTATIVE",
        512,
        128
    );

    const nameTexture = new THREE.CanvasTexture(nameCanvas);
    nameTexture.colorSpace = THREE.SRGBColorSpace;

    const nameDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 0.95),
        new THREE.MeshBasicMaterial({
            map: nameTexture,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        })
    );

    nameDisplay.position.set(0, 2.95, 0);
    receptionist.add(nameDisplay);

    scene.add(receptionist);

    // =====================================================
    // SECTION 05 // SHARED VISITOR RESOURCES
    // =====================================================

    const bodyGeometry =
        new THREE.CylinderGeometry(0.25, 0.23, 0.8, 8);

    const legGeometry =
        new THREE.CylinderGeometry(0.09, 0.08, 0.8, 6);

    const armGeometry =
        new THREE.CylinderGeometry(0.085, 0.075, 0.72, 6);

    const headGeometry =
        new THREE.SphereGeometry(0.22, 10, 8);

    const hairGeometry =
        new THREE.SphereGeometry(
            0.235, 10, 8,
            0, Math.PI * 2,
            0, Math.PI * 0.55
        );

    const visitorColors = [
        0x292044,
        0x182B43,
        0x3D193C,
        0x202A2F,
        0x40283B,
        0x253644,
        0x322842,
        0x183A39,
        0x3E284A,
        0x242838
    ];

    const skinColors = [
        0xBA8F7D,
        0xD5AA8A,
        0x805544,
        0xE0B899,
        0xA77859
    ];

    const hairColors = [
        0x17111F,
        0x412B29,
        0xD2C5B0,
        0x4B214D,
        0x163C51
    ];

    // =====================================================
    // SECTION 05A // FEMALE VISITOR APPEARANCE
    // =====================================================

    // Shared dress geometry with a fitted upper section
    // and a wider skirt.

    const dressSkirtGeometry =
        new THREE.CylinderGeometry(0.23, 0.58, 1.05, 12);

    const dressWaistGeometry =
        new THREE.CylinderGeometry(0.22, 0.3, 0.48, 10);

    // Longer hair falls behind the shoulders.

    const longHairGeometry =
        new THREE.CylinderGeometry(0.20, 0.29, 0.85, 10);

    const femaleDressColors = [
        0x54256B,
        0x192F58,
        0x642345,
        0x293D53,
        0x43245F
    ];

    const femaleDressMaterials =
        femaleDressColors.map(color =>
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.25,
                roughness: 0.5,
                side: THREE.DoubleSide
            })
        );

    const visitorNames = [
        "NeonWraith",
        "VoidRunner",
        "HexGhost",
        "CyberNova",
        "ArcLight",
        "VioletZero",
        "SkyBreaker",
        "EchoShift",
        "NightPixel",
        "GlitchFox"
    ];

    const outfitMaterials = visitorColors.map(color =>
        new THREE.MeshStandardMaterial({
            color,
            metalness: 0.25,
            roughness: 0.65
        })
    );

    const visitorSkinMaterials = skinColors.map(color =>
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.8
        })
    );

    const visitorHairMaterials = hairColors.map(color =>
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.85
        })
    );

    // =====================================================
    // SECTION 06 // VISITOR NAME AND CHAT DISPLAYS
    // =====================================================

    function createTextSprite(text, options = {}) {

        const isChat = options.chat === true;

        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 128;

        const ctx = canvas.getContext("2d");

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(material);

        sprite.scale.set(
            isChat ? 3.8 : 2.0,
            isChat ? 0.95 : 0.5,
            1
        );

        function setText(value) {

            ctx.clearRect(0, 0, 512, 128);

            if (isChat) {

                ctx.fillStyle = "rgba(8,7,23,0.90)";
                ctx.fillRect(8, 8, 496, 112);

                ctx.strokeStyle = "#8650E8";
                ctx.lineWidth = 4;
                ctx.strokeRect(8, 8, 496, 112);

                ctx.fillStyle = "#EAE8FF";
                ctx.font = "25px Consolas, monospace";

                const words = value.split(" ");
                const lines = [];
                let line = "";

                for (const word of words) {

                    const test = line
                        ? line + " " + word
                        : word;

                    if (
                        ctx.measureText(test).width > 460 &&
                        line
                    ) {
                        lines.push(line);
                        line = word;
                    } else {
                        line = test;
                    }
                }

                if (line) {
                    lines.push(line);
                }

                const visibleLines = lines.slice(0, 3);
                const lineHeight = 30;

                const startY =
                    64 - ((visibleLines.length - 1) * lineHeight) / 2;

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                visibleLines.forEach((part, i) => {
                    ctx.fillText(
                        part,
                        256,
                        startY + i * lineHeight
                    );
                });

            } else {

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "bold 43px Consolas, monospace";

                ctx.shadowColor = "#000000";
                ctx.shadowBlur = 10;

                ctx.fillStyle = "#8CD6FD";
                ctx.fillText(value, 256, 64);
            }

            texture.needsUpdate = true;
        }

        setText(text);

        return {
            sprite,
            setText
        };
    }

    // =====================================================
    // SECTION 07 // VISITOR MOVEMENT AREAS
    // =====================================================

    // These visitor destinations avoid the reception desk,
    // central energy platform, and main structural pillars.

    const roamingPoints = [
        { x: -12, z: -12 },
        { x: -14, z: 1 },
        { x: -10, z: 13 },
        { x: -6, z: 20 },

        { x: 12, z: -12 },
        { x: 14, z: 1 },
        { x: 10, z: 13 },
        { x: 6, z: 20 },

        { x: -15, z: -7 },
        { x: 15, z: -7 },

        { x: -8, z: -18 },
        { x: 8, z: -18 }
    ];

    function validVisitorPosition(x, z) {

        if (
            Math.abs(x) > 23 ||
            Math.abs(z) > 22
        ) {
            return false;
        }

        // Central platform.

        if (x * x + z * z < 48) {
            return false;
        }

        // Reception desk.

        if (
            Math.abs(x) < 7.5 &&
            z < -21
        ) {
            return false;
        }

        // Lobby pillars.

        for (const px of [-20, 20]) {
            for (const pz of [-18, 18]) {

                if (
                    Math.abs(x - px) < 2.5 &&
                    Math.abs(z - pz) < 2.5
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    // =====================================================
    // SECTION 08 // CREATE SIMULATED VISITORS
    // =====================================================

    const isMobile =
        window.matchMedia("(pointer: coarse)").matches;

    const visitorCount = isMobile ? 6 : 10;

    const visitors = [];

    function createVisitor(index) {

        const group = new THREE.Group();

        // SECTION 08A-1 // VISITOR BODY TYPE

        // Alternate between male and female visitors.
        // This creates an even population split.

        const isFemale = index % 2 === 1;

        const outfit =
            outfitMaterials[index % outfitMaterials.length];

        const skin =
            visitorSkinMaterials[index % visitorSkinMaterials.length];

        const visitorHair =
            visitorHairMaterials[index % visitorHairMaterials.length];

        // SECTION 08A // BODY

        const body = new THREE.Mesh(
            bodyGeometry,
            outfit
        );

        body.position.y = 1.25;
        group.add(body);

        // SECTION 08A-2 // FEMALE DRESS

        if (isFemale) {

            // Hide the original cylindrical torso.

            body.visible = false;

            const dressMaterial =
                femaleDressMaterials[
                    Math.floor(index / 2) %
                    femaleDressMaterials.length
                ];

            // Fitted upper part of the dress.

            const dressUpper = new THREE.Mesh(
                dressWaistGeometry,
                dressMaterial
            );

            dressUpper.position.y = 1.43;
            group.add(dressUpper);

            // Flowing skirt, wider toward the bottom.

            const dressSkirt = new THREE.Mesh(
                dressSkirtGeometry,
                dressMaterial
            );

            dressSkirt.position.y = 0.73;
            group.add(dressSkirt);

            // Subtle glowing waist decoration.

            const waistGlow = new THREE.Mesh(
                new THREE.TorusGeometry(
                    0.27,
                    0.018,
                    6,
                    20
                ),
                purpleTrim
            );

            waistGlow.rotation.x = Math.PI / 2;
            waistGlow.position.y = 1.21;

            group.add(waistGlow);
        }

        // SECTION 08B // LEGS

        const leftLeg = new THREE.Mesh(
            legGeometry,
            outfit
        );

        leftLeg.position.set(-0.13, 0.42, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(
            legGeometry,
            outfit
        );

        rightLeg.position.set(0.13, 0.42, 0);
        group.add(rightLeg);

        // SECTION 08C // ARMS

        const leftArm = new THREE.Mesh(
            armGeometry,
            outfit
        );

        leftArm.position.set(-0.34, 1.2, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(
            armGeometry,
            outfit
        );

        rightArm.position.set(0.34, 1.2, 0);
        group.add(rightArm);

        // SECTION 08D // HEAD AND HAIR

        const visitorHead = new THREE.Mesh(
            headGeometry,
            skin
        );

        visitorHead.position.y = 1.86;
        group.add(visitorHead);

        const visitorHairMesh = new THREE.Mesh(
            hairGeometry,
            visitorHair
        );

        visitorHairMesh.position.y = 1.91;
        group.add(visitorHairMesh);

        // SECTION 08D-1 // LONG FEMALE HAIRSTYLES

        if (isFemale) {

            const longHair = new THREE.Mesh(
                longHairGeometry,
                visitorHair
            );

            // Position the long hair behind the head.
            // This leaves the face visible.

            longHair.position.set(0, 1.58, -0.13);

            group.add(longHair);

            // Add two strands around the shoulders.

            const strandGeometry =
                new THREE.CylinderGeometry(
                    0.065,
                    0.095,
                    0.7,
                    8
                );

            for (const x of [-0.21, 0.21]) {

                const strand = new THREE.Mesh(
                    strandGeometry,
                    visitorHair
                );

                strand.position.set(x, 1.55, 0.04);

                group.add(strand);
            }
        }

        // SECTION 08E // USERNAME

        const username = createTextSprite(
            visitorNames[index]
        );

        username.sprite.position.y = 2.45;
        group.add(username.sprite);

        // SECTION 08F // OVERHEAD CHAT

        const chat = createTextSprite("", {
            chat: true
        });

        chat.sprite.position.y = 3.25;
        chat.sprite.visible = false;

        group.add(chat.sprite);

        // SECTION 08G // INITIAL POSITION

        const start =
            roamingPoints[index % roamingPoints.length];

        group.position.set(start.x, 0, start.z);

        scene.add(group);

        const visitor = {
            group,
            name: visitorNames[index],
            chat,
            leftLeg,
            rightLeg,
            leftArm,
            rightArm,
            target: new THREE.Vector3(
                start.x, 0, start.z
            ),
            speed: 0.85 + Math.random() * 0.45,
            waitUntil: Math.random() * 4,
            walking: false,
            chatUntil: 0,
            nextChatTime: 7 + Math.random() * 8,
            movementPhase: Math.random() * Math.PI * 2
        };

        visitors.push(visitor);
    }

    for (let i = 0; i < visitorCount; i++) {
        createVisitor(i);
    }

    // =====================================================
    // SECTION 09 // VISITOR WANDERING BEHAVIOR
    // =====================================================

    function chooseVisitorTarget(visitor) {

        // Usually roam around the headquarters.
        // Occasionally stop for a longer period.

        if (Math.random() < 0.22) {

            visitor.walking = false;
            visitor.waitUntil =
                elapsedTime + 3 + Math.random() * 6;

            return;
        }

        const point =
            roamingPoints[
                Math.floor(Math.random() * roamingPoints.length)
            ];

        visitor.target.set(point.x, 0, point.z);
        visitor.walking = true;
    }

    // =====================================================
    // SECTION 10 // RANDOM NPC CONVERSATIONS
    // =====================================================

    const conversations = [
        [
            "Have you checked out Cyber_Arena yet?",
            "I heard you can walk on the ceilings.",
            "That movement system sounds wild."
        ],
        [
            "This headquarters is huge.",
            "Wait until we get into HexCore City.",
            "I'm heading to the arcade first."
        ],
        [
            "Did you see the floating city outside?",
            "Yeah, the atmosphere here is incredible.",
            "I wonder what the other buildings are like."
        ],
        [
            "What game are you most excited for?",
            "Probably Untamed Horizon.",
            "I want to explore that world."
        ],
        [
            "I want to see Where Light Dies.",
            "That rainforest sounds terrifying at night.",
            "Especially with all the glowing wildlife."
        ],
        [
            "Have you seen the fantasy academy concept?",
            "Yeah, the whole world looks massive.",
            "I'm curious about the classes."
        ],
        [
            "Are there other visitors here?",
            "These are simulated visitors for now.",
            "The multiplayer version is planned later."
        ],
        [
            "I really like the cyber-fantasy design.",
            "The purple lighting is my favorite.",
            "It feels like walking through a game."
        ],
        [
            "What is that energy structure in the center?",
            "No idea, but it looks powerful.",
            "Maybe the receptionist knows."
        ],
        [
            "I hope they add vehicles to the city.",
            "Imagine driving through those neon streets.",
            "I'm definitely exploring everything."
        ]
    ];

    // Conversations are coordinated, rather than having
    // every visitor speak unrelated sentences constantly.

    const socialPairs = [];

    for (let i = 0; i + 1 < visitors.length; i += 2) {

        socialPairs.push({
            first: visitors[i],
            second: visitors[i + 1],
            lines: [],
            step: 0,
            nextTime: 9 + Math.random() * 12,
            active: false
        });
    }

    function displayVisitorChat(visitor, message, now) {

        visitor.chat.setText(message);
        visitor.chat.sprite.visible = true;

        visitor.chatUntil = now + 4.5;
    }

    function updateSocialConversations(now) {

        for (const pair of socialPairs) {

            if (now < pair.nextTime) {
                continue;
            }

            if (!pair.active) {

                // Conversations only begin when NPCs
                // are near enough to plausibly socialize.

                const distance =
                    pair.first.group.position.distanceTo(
                        pair.second.group.position
                    );

                if (distance > 9) {

                    pair.nextTime = now + 5;
                    continue;
                }

                pair.lines =
                    conversations[
                        Math.floor(
                            Math.random() * conversations.length
                        )
                    ];

                pair.step = 0;
                pair.active = true;

                pair.first.walking = false;
                pair.second.walking = false;

                pair.first.waitUntil = now + 18;
                pair.second.waitUntil = now + 18;
            }

            if (pair.step < pair.lines.length) {

                const speaker =
                    pair.step % 2 === 0
                        ? pair.first
                        : pair.second;

                displayVisitorChat(
                    speaker,
                    pair.lines[pair.step],
                    now
                );

                pair.step++;
                pair.nextTime = now + 5.5;

            } else {

                pair.active = false;
                pair.nextTime =
                    now + 20 + Math.random() * 20;
            }
        }
    }

    // =====================================================
    // SECTION 11 // NPC ANIMATION SYSTEM
    // =====================================================

    const clock = new THREE.Clock();
    let elapsedTime = 0;

    function updateNPCs() {

        const delta = Math.min(clock.getDelta(), 0.05);
        elapsedTime += delta;

        // SECTION 11A // RECEPTIONIST IDLE ANIMATION

        torso.rotation.z =
            Math.sin(elapsedTime * 1.3) * 0.025;

        head.rotation.y =
            Math.sin(elapsedTime * 0.7) * 0.12;

        const pulse =
            0.85 + Math.sin(elapsedTime * 1.7) * 0.15;

        chestTrim.scale.x = pulse;

        // SECTION 11B // VISITOR MOVEMENT

        for (const visitor of visitors) {

            if (
                !visitor.walking &&
                elapsedTime >= visitor.waitUntil
            ) {
                chooseVisitorTarget(visitor);
            }

            if (visitor.walking) {

                const dx =
                    visitor.target.x -
                    visitor.group.position.x;

                const dz =
                    visitor.target.z -
                    visitor.group.position.z;

                const distance = Math.hypot(dx, dz);

                if (distance < 0.3) {

                    visitor.walking = false;

                    visitor.waitUntil =
                        elapsedTime + 2 + Math.random() * 5;

                } else {

                    const step = Math.min(
                        distance,
                        visitor.speed * delta
                    );

                    const nx =
                        visitor.group.position.x +
                        (dx / distance) * step;

                    const nz =
                        visitor.group.position.z +
                        (dz / distance) * step;

                    if (validVisitorPosition(nx, nz)) {

                        visitor.group.position.x = nx;
                        visitor.group.position.z = nz;

                        // Rotate character toward travel direction.

                        visitor.group.rotation.y =
                            Math.atan2(dx, dz);

                    } else {

                        visitor.walking = false;
                        visitor.waitUntil =
                            elapsedTime + 1.5;
                    }
                }
            }

            // SECTION 11C // WALK ANIMATION

            const walkingMotion =
                visitor.walking
                    ? Math.sin(
                        elapsedTime * 7 +
                        visitor.movementPhase
                    ) * 0.45
                    : 0;

            visitor.leftLeg.rotation.x =
                walkingMotion;

            visitor.rightLeg.rotation.x =
                -walkingMotion;

            visitor.leftArm.rotation.x =
                -walkingMotion * 0.65;

            visitor.rightArm.rotation.x =
                walkingMotion * 0.65;

            // SECTION 11D // HIDE EXPIRED CHAT

            if (
                visitor.chat.sprite.visible &&
                elapsedTime >= visitor.chatUntil
            ) {
                visitor.chat.sprite.visible = false;
            }
        }

        // SECTION 11E // UPDATE SOCIAL CHAT

        updateSocialConversations(elapsedTime);
    }

    // =====================================================
    // SECTION 12 // NPC SYSTEM OUTPUT
    // =====================================================

    return updateNPCs;
}
