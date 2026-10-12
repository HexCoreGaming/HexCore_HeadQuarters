// HEXCORE // CANONICAL PUBLIC WORLD LAYOUT. One coordinate source for landmarks and interactions.
// Company departments live in HexCore Tower, not independent outdoor landmarks.
export const HEXCORE_WORLD = Object.freeze({
  tower: {x:0,z:300}, hub: {x:0,z:0},
  sites: [
    {x:-195,z:240},{x:195,z:240},{x:-205,z:365},{x:205,z:365},
    {x:-110,z:495},{x:110,z:495},
    {x:-280,z:130},{x:280,z:130},{x:-285,z:435},{x:285,z:435},
    {x:-300,z:300},{x:300,z:300},
    {x:-140,z:140},{x:140,z:140},{x:-125,z:570},{x:125,z:570}
  ]
});

// Exterior public destinations: games, future worlds, merchandise, museum, arcade, residences.
export const HEXCORE_EXTERIOR_SITES = Object.freeze([0,1,2,3,4,5,12,13,14,15]);
export const HEXCORE_CORPORATE_SITES = Object.freeze([6,7,8,9,10,11]);

// Installed before gameplay; the player uses this list for showroom collision.
if (typeof window !== "undefined") window.hexcorePublicExteriorSites = HEXCORE_EXTERIOR_SITES.map(i => HEXCORE_WORLD.sites[i]);
