// =====================================================
// HEXCORE CITY // REUSABLE INTERIOR NAVIGATION
// SECTION 01 // PORTAL REGISTRY AND TRANSITIONS
// =====================================================
// No portals are active until another module registers one.
// This file does not modify the existing city or player controls.

export function createInteriorNavigation() {
    const portals = new Map();
    let position = { x: 0, z: 15 };
    let currentZone = "city";
    let secondsUntilNextTravel = 0;

    window.addEventListener("hexcore-player-position", (event) => {
        const { x, z } = event.detail || {};
        if (Number.isFinite(x) && Number.isFinite(z)) {
            position = { x, z };
        }
    });

    // =====================================================
    // SECTION 02 // REGISTER DOORWAY
    // =====================================================
    // Example registration (not active by default):
    // navigation.registerPortal({
    //     id: "tower-to-admin",
    //     fromZone: "tower-floor-admin",
    //     toZone: "admin-interior",
    //     x: 100, z: 100, radius: 2,
    //     destination: { x: 500, z: 530, yaw: 0 }
    // });

    function registerPortal(config) {
        if (!config || typeof config.id !== "string" || !config.id.trim()) {
            throw new Error("Portal must have a nonempty id.");
        }
        if (portals.has(config.id)) {
            throw new Error(`Duplicate portal id: ${config.id}`);
        }
        for (const value of [config.x, config.z, config.destination?.x, config.destination?.z]) {
            if (!Number.isFinite(value)) {
                throw new Error(`Portal ${config.id} has invalid coordinates.`);
            }
        }
        const portal = {
            ...config,
            radius: Number.isFinite(config.radius) ? Math.max(0.5, config.radius) : 2,
            enabled: config.enabled !== false
        };
        portals.set(portal.id, portal);
        return () => portals.delete(portal.id);
    }

    // =====================================================
    // SECTION 03 // TRAVEL SAFELY
    // =====================================================

    function travel(portal) {
        if (typeof window.hexcoreTeleportPlayer !== "function") return false;
        if (window.hexcoreDialogueOpen === true) return false;
        const destination = portal.destination;
        if (typeof portal.beforeTravel === "function") {
            if (portal.beforeTravel() === false) return false;
        }
        currentZone = portal.toZone;
        // Existing player controller currently understands a single
        // interior flag. Later, zone-based collisions will replace this.
        window.hexcoreInteriorActive = currentZone !== "city";
        window.hexcoreTeleportPlayer(destination.x, destination.z, destination.yaw || 0);
        secondsUntilNextTravel = 1.1;
        if (typeof portal.afterTravel === "function") portal.afterTravel();
        window.dispatchEvent(new CustomEvent("hexcore-zone-changed", {
            detail: { zone: currentZone, portalId: portal.id }
        }));
        return true;
    }

    // =====================================================
    // SECTION 04 // PER-FRAME UPDATE
    // =====================================================

    function update(delta = 1 / 60) {
        if (secondsUntilNextTravel > 0) {
            secondsUntilNextTravel = Math.max(0, secondsUntilNextTravel - Math.min(Math.max(delta, 0), 0.1));
            return;
        }
        for (const portal of portals.values()) {
            if (!portal.enabled || portal.fromZone !== currentZone) continue;
            if (typeof portal.canEnter === "function" && !portal.canEnter()) continue;
            const distance = Math.hypot(position.x - portal.x, position.z - portal.z);
            if (distance <= portal.radius && travel(portal)) break;
        }
    }

    // =====================================================
    // SECTION 05 // PUBLIC API
    // =====================================================

    return {
        registerPortal,
        update,
        getZone: () => currentZone,
        setZone(zone) { currentZone = zone; },
        setEnabled(id, enabled) {
            const portal = portals.get(id);
            if (portal) portal.enabled = !!enabled;
        }
    };
}
