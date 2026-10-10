
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // FLOATING CITY FOUNDATION
// =====================================================

// =====================================================
// SECTION 01 // CREATE CITY FOUNDATION
// =====================================================

export function createCityFoundation(scene) {

    const city = new THREE.Group();
    city.name = "HEXCORE_FLOATING_CITY";

    scene.add(city);

    // =====================================================
    // SECTION 02 // CITY MATERIALS
    // =====================================================

    const islandSurface = new THREE.MeshStandardMaterial({
        color: 0x111322,
        metalness: 0.45,
        roughness: 0.5
    });

    const islandUnderside = new THREE.MeshStandardMaterial({
        color: 0x090713,
        metalness: 0.35,
        roughness: 0.8,
        flatShading: true
    });

    const purpleGlow = new THREE.MeshBasicMaterial({
        color: 0x8650E8
    });

    const cyanGlow = new THREE.MeshBasicMaterial({
        color: 0x8CD6FD
    });

    // =====================================================
    // SECTION 03 // ISLAND DEFINITIONS
    // =====================================================

    // Headquarters faces positive Z.
    // The main island continues outward from its exit.

    const islandDefinitions = [
        {
            id: "MAIN",
            x: 0,
            z: 110,
            radius: 92,
            scaleZ: 1.18
        },
        {
            id: "ENTERTAINMENT",
            x: 224,
            z: 110,
            radius: 66,
            scaleZ: 1
        },
        {
            id: "COMMERCE",
            x: -218,
            z: 116,
            radius: 62,
            scaleZ: 1
        },
        {
            id: "FUTURE_WORLDS",
            x: 0,
            z: 345,
            radius: 76,
            scaleZ: 1
        }
    ];

    // =====================================================
    // SECTION 04 // BUILD FLOATING ISLANDS
    // =====================================================

    function buildIsland(definition) {

        const island = new THREE.Group();

        island.name = definition.id;

        island.position.set(
            definition.x,
            0,
            definition.z
        );

        // SECTION 04A // WALKABLE UPPER SURFACE

        const surface = new THREE.Mesh(
            new THREE.CylinderGeometry(
                definition.radius,
                definition.radius * 0.96,
                2,
                48
            ),
            islandSurface
        );

        surface.scale.z = definition.scaleZ;
        surface.position.y = -1;

        island.add(surface);

        // Surface top is Y = 0, matching HQ.

        // SECTION 04B // FLOATING ROCK UNDERSIDE

        const underside = new THREE.Mesh(
            new THREE.CylinderGeometry(
                definition.radius * 0.94,
                definition.radius * 0.42,
                24,
                32,
                4
            ),
            islandUnderside
        );

        underside.scale.z = definition.scaleZ;
        underside.position.y = -14;

        island.add(underside);

        // SECTION 04C // OUTER PURPLE LIGHT RING

        const outerRing = new THREE.Mesh(
            new THREE.TorusGeometry(
                definition.radius * 0.975,
                0.35,
                6,
                64
            ),
            purpleGlow
        );

        outerRing.rotation.x = Math.PI / 2;
        outerRing.scale.y = definition.scaleZ;
        outerRing.position.y = 0.15;

        island.add(outerRing);

        // SECTION 04D // INNER CYAN GUIDE RING

        const guideRing = new THREE.Mesh(
            new THREE.TorusGeometry(
                definition.radius * 0.86,
                0.11,
                6,
                64
            ),
            cyanGlow
        );

        guideRing.rotation.x = Math.PI / 2;
        guideRing.scale.y = definition.scaleZ;
        guideRing.position.y = 0.18;

        island.add(guideRing);

        city.add(island);

        return island;
    }

    for (const definition of islandDefinitions) {
        buildIsland(definition);
    }

    // =====================================================
    // SECTION 05 // CITY FOUNDATION INFORMATION
    // =====================================================

    // Other systems will eventually use these definitions
    // for safe walking, roads, buildings, and NPC navigation.

    window.hexcoreCityIslands = islandDefinitions;

    // =====================================================
    // SECTION 06 // CITY FOUNDATION ANIMATION
    // =====================================================

    function animateCityFoundation() {

        // Reserved for island lighting, waterfalls,
        // digital effects, and distant structures.

    }

    // =====================================================
    // SECTION 07 // CITY FOUNDATION OUTPUT
    // =====================================================

    return animateCityFoundation;
}
