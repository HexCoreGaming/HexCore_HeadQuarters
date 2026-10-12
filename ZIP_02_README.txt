HEXCORE CITY // ZIP 2 OF 4 // INTERIORS + STARTUP STALL FIX

Full cumulative repository. Extract and copy all contents into repository root. Review GitHub Desktop before committing.

Changes:
- FIXED missing anchorX/anchorZ/colMats variables in ZIP 1 publicCity module. Previously this threw a ReferenceError during city initialization, leaving entrances and interiors unavailable.
- FIXED mismatched exterior building versus interaction coordinates by aligning publicCity to remadeWorld 4-column map.
- CHANGED startup sequencing: draw HQ first, then build tower, world, city interactions, visitor areas and interior systems on separate animation frames.
- LOWERED renderer maximum pixel ratio to 1.4 (from 2) and requested high-performance rendering.
- REDUCED unnecessary offscreen interior point lights.
- NEW interiorFinishes module: architectural ribs, seating, illuminated exhibit framing in all 16 public interiors; instanced geometry for lower draw calls.
- Existing tower department furniture, NPC representatives, and visitor dialogue preserved.

IMPORTANT: Initial construction of any large scene is synchronous JavaScript. Staging prevents a single massive initial stall, but brief pauses may still occur on low-powered machines. No physical device/browser profiling has been performed.
Support tickets, payments, employee accounts and multiplayer are NOT enabled without backend integrations.
