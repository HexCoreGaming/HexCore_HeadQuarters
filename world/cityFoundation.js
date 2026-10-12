
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================================================
// HEXCORE GAMING // FLOATING CITY FOUNDATION
// =====================================================

export function createCityFoundation(scene) {

    const city = new THREE.Group();
    city.name = "HEXCORE_FLOATING_CITY";
    scene.add(city);

    const islandSurface = new THREE.MeshPhysicalMaterial({
        color: 0x101625,
        metalness: 0.62,
        roughness: 0.32,
        clearcoat: 0.7,
        clearcoatRoughness: 0.15
    });

    const islandUnderside = new THREE.MeshStandardMaterial({
        color: 0x070a14,
        metalness: 0.38,
        roughness: 0.78,
        flatShading: true
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1d2640,
        emissive: 0x6f2be1,
        emissiveIntensity: 0.75,
        metalness: 0.72,
        roughness: 0.2
    });

    const cyanEdge = new THREE.MeshStandardMaterial({
        color: 0x1d314d,
        emissive: 0x71dfff,
        emissiveIntensity: 0.85,
        metalness: 0.72,
        roughness: 0.2
    });

    const crystalMaterial = new THREE.MeshStandardMaterial({
        color: 0x4660a1,
        emissive: 0x985cff,
        emissiveIntensity: 0.45,
        metalness: 0.48,
        roughness: 0.3
    });

    const islandDefinitions = [
        { id: "MAIN", x: 0, z: 110, radius: 92, scaleZ: 1.18 },
        { id: "ENTERTAINMENT", x: 224, z: 110, radius: 66, scaleZ: 1 },
        { id: "COMMERCE", x: -218, z: 116, radius: 62, scaleZ: 1 },
        { id: "FUTURE_WORLDS", x: 0, z: 345, radius: 76, scaleZ: 1 }
    ];

    function buildIsland(definition) {

        const island = new THREE.Group();
        island.name = definition.id;
        island.position.set(definition.x, 0, definition.z);

        const surface = new THREE.Mesh(
            new THREE.CylinderGeometry(
                definition.radius,
                definition.radius * 0.97,
                2.2,
                56
            ),
            islandSurface
        );
        surface.scale.z = definition.scaleZ;
        surface.position.y = -1.05;
        island.add(surface);

        const innerShelf = new THREE.Mesh(
            new THREE.CylinderGeometry(
                definition.radius * 0.93,
                definition.radius * 0.95,
                0.65,
                56
            ),
            new THREE.MeshStandardMaterial({
                color: 0x131b2c,
                emissive: 0x2a0e4f,
                emissiveIntensity: 0.18,
                metalness: 0.65,
                roughness: 0.28
            })
        );
        innerShelf.scale.z = definition.scaleZ;
        innerShelf.position.y = -0.02;
        island.add(innerShelf);

        const underside = new THREE.Mesh(
            new THREE.CylinderGeometry(
                definition.radius * 0.95,
                definition.radius * 0.38,
                26,
                40,
                7
            ),
            islandUnderside
        );
        underside.scale.z = definition.scaleZ;
        underside.position.y = -14.5;
        island.add(underside);

        const outerRing = new THREE.Mesh(
            new THREE.TorusGeometry(
                definition.radius * 0.974,
                0.42,
                8,
                84
            ),
            edgeMaterial
        );
        outerRing.rotation.x = Math.PI / 2;
        outerRing.scale.y = definition.scaleZ;
        outerRing.position.y = 0.14;
        island.add(outerRing);

        const guideRing = new THREE.Mesh(
            new THREE.TorusGeometry(
                definition.radius * 0.86,
                0.12,
                8,
                84
            ),
            cyanEdge
        );
        guideRing.rotation.x = Math.PI / 2;
        guideRing.scale.y = definition.scaleZ;
        guideRing.position.y = 0.18;
        island.add(guideRing);

        for (let i = 0; i < 10; i++) {
            const angle = i / 10 * Math.PI * 2;
            const rx = Math.cos(angle) * definition.radius * 0.46;
            const rz = Math.sin(angle) * definition.radius * 0.46 * definition.scaleZ;

            const crystal = new THREE.Mesh(
                new THREE.ConeGeometry(2.2, 9.5, 6),
                crystalMaterial
            );
            crystal.position.set(rx, -26.5, rz);
            crystal.rotation.x = Math.PI;
            crystal.rotation.y = angle;
            island.add(crystal);
        }

        const underGlow = new THREE.PointLight(
            0x7f50ff,
            definition.id === "MAIN" ? 5.5 : 3.8,
            definition.radius * 2.8
        );
        underGlow.position.set(0, -10, 0);
        island.add(underGlow);

        city.add(island);
    }

    for (const definition of islandDefinitions) {
        buildIsland(definition);
    }

    window.hexcoreCityIslands = islandDefinitions;

    function animateCityFoundation() {}

    return animateCityFoundation;
}
