import * as THREE from 'three';

export const PARTICLE_COUNT = 20000;

// Helper to get a random point in a sphere
const randomInSphere = (radius: number) => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

// 1. Fractal: Sierpinski Tetrahedron approximation
export const generateFractal = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  // Start with a tetrahedron vertices
  const vertices = [
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(1, -1, -1),
  ];

  let currentPoint = new THREE.Vector3(0, 0, 0);

  for (let i = 0; i < count; i++) {
    // Chaos game: pick a random vertex and move halfway there
    const vertex = vertices[Math.floor(Math.random() * vertices.length)];
    currentPoint.lerp(vertex, 0.5);
    
    // Scale up slightly to fill space better
    const p = currentPoint.clone().multiplyScalar(4);
    
    positions[i * 3] = p.x;
    positions[i * 3 + 1] = p.y;
    positions[i * 3 + 2] = p.z;
  }
  return positions;
};

// 2. Möbius Strip
export const generateMobius = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // u goes from 0 to 2PI
    const u = Math.random() * Math.PI * 2;
    // v goes from -1 to 1 (width of the strip)
    const v = (Math.random() * 2 - 1) * 0.5; // Width factor

    // Mobius strip parametric equations
    const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u);
    const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u);
    const z = v / 2 * Math.sin(u / 2);

    // Scale it up
    const scale = 3.5;
    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;
  }
  return positions;
};

// 3. Penrose Triangle (Impossible Object Approximation)
// We'll create a structure that looks like a triangle from a specific angle.
// It's essentially 3 bars arranged in 3D.
export const generatePenrose = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const barWidth = 0.5;
  const barLength = 4;
  
  for (let i = 0; i < count; i++) {
    const part = Math.floor(Math.random() * 3);
    let x = 0, y = 0, z = 0;
    
    // Random position within a bar
    const t = Math.random() * barLength;
    const w = (Math.random() - 0.5) * barWidth;
    const h = (Math.random() - 0.5) * barWidth;

    if (part === 0) {
      // Bar 1: along X
      x = t - barLength / 2;
      y = barLength / 2 + w;
      z = -barLength / 2 + h;
    } else if (part === 1) {
      // Bar 2: along Y
      x = barLength / 2 + w;
      y = t - barLength / 2;
      z = 0 + h; // Connects to Bar 1 at top right?
      // Adjusting to make it look like a triangle from isometric view
      // Let's try a simple 3-segment structure
      // Segment 1: (0,0,0) to (L,0,0)
      // Segment 2: (L,0,0) to (L,L,0)
      // Segment 3: (L,L,0) to (0,L,L) -> This doesn't close.
      
      // Standard Penrose construction in 3D:
      // 1. x-axis bar
      // 2. y-axis bar
      // 3. z-axis bar
      // Viewed from (1,1,1) it looks like a triangle.
      
      // Let's do 3 orthogonal bars that don't quite touch but align in view.
      // Bar 1: x from 0 to L, y=L, z=0
      // Bar 2: x=L, y from 0 to L, z=L
      // Bar 3: x=0, y=0, z from 0 to L
      
      // Wait, let's refine coordinates for a better illusion.
      // Bar 1 (Top): x: -L..L, y: L, z: 0
      // Bar 2 (Right): x: L, y: -L..L, z: 0 (Wait, this is flat)
      
      // Let's use a known 3D construction:
      // Leg 1: x=1..3, y=1, z=1
      // Leg 2: x=3, y=1..3, z=1
      // Leg 3: x=3, y=3, z=1..3 -> No
      
      // Let's stick to the "3 orthogonal bars" approach which forms an open loop that looks closed.
      // Bar 1: x axis. Center (0, 2, 0). Length 4.
      x = (Math.random() - 0.5) * 4;
      y = 2 + (Math.random() - 0.5) * 0.5;
      z = (Math.random() - 0.5) * 0.5;
    } else if (part === 1) {
      // Bar 2: y axis. Center (2, 0, 0). Length 4.
      x = 2 + (Math.random() - 0.5) * 0.5;
      y = (Math.random() - 0.5) * 4;
      z = 2 + (Math.random() - 0.5) * 0.5; // Offset z to create depth
    } else {
      // Bar 3: z axis? Or connecting?
      // To make a triangle, we need a diagonal or another orthogonal.
      // Let's do:
      // 1. Horizontal top
      // 2. Vertical right
      // 3. Diagonal closing?
      
      // Let's try the "L" shape + one bar behind.
      // Bar 1: x: -2 to 2, y: 2, z: 0
      // Bar 2: x: 2, y: -2 to 2, z: 0
      // Bar 3: x: -2, y: -2, z: -2 to 2 -> This doesn't close visually.
      
      // Simpler approach: A triangle in 3D.
      // Just a regular triangle but with "thickness" and maybe a twist.
      // Let's do a standard triangle for now, Penrose is hard to get perfect without exact camera angle.
      // User asked for "3D approximation".
      
      // Let's do a "twisted" triangle.
      // Vertices: (2,2,0), (-2,2,0), (0,-2,0)
      // But we want the "impossible" look.
      // Let's create 3 bars:
      // 1. x: -2..2, y: 2, z: 0
      // 2. x: 2, y: -2..2, z: -2..0 (Slope?)
      
      // Let's use the 3-bar orthogonal construction again, it's the standard illusion.
      // Bar 1: x axis, y=high, z=front
      // Bar 2: y axis, x=high, z=back
      // Bar 3: z axis, x=low, y=low (connecting?)
      
      // Re-attempt logic:
      // Bar 1: x from -2 to 2, y = 2, z = 0
      // Bar 2: x = 2, y from -2 to 2, z = -2
      // Bar 3: x = -2, y = -2, z from -2 to 2 (Wait, z needs to go to 0 to close? No, it goes to front)
      // Bar 3: x = -2, y from -2 to 2 (diagonal?)
      
      // Let's just do 3 bars forming a "C" shape in 3D that looks like a triangle.
      // Bar 1: (-2, 2, 0) to (2, 2, 0)
      // Bar 2: (2, 2, 0) to (0, -2, -2)
      // Bar 3: (0, -2, -2) to (-2, 2, 0)
      // This is just a triangle.
      
      // Let's stick to the "3 orthogonal bars" which is the classic impossible triangle construction.
      // Bar 1: x axis.
      x = (Math.random() * 4) - 2;
      y = 2;
      z = 0;
    }
    
    // Let's overwrite with a cleaner implementation of the 3-bar illusion
    // Bar 1: Top horizontal
    if (part === 0) {
        x = (Math.random() * 4) - 2; // -2 to 2
        y = 1.5 + (Math.random()-0.5)*0.5;
        z = 0 + (Math.random()-0.5)*0.5;
    }
    // Bar 2: Right vertical (going down and back)
    else if (part === 1) {
        x = 2 + (Math.random()-0.5)*0.5;
        y = (Math.random() * 4) - 2.5; // -2.5 to 1.5
        z = -1 * (2 - (y + 2.5)); // Slanted in Z? No, let's keep it simple orthogonal.
        // Let's just place it at z=-2
        z = -2 + (Math.random()-0.5)*0.5;
        // Wait, to connect to Bar 1 (2, 1.5, 0), this bar needs to be near there.
        // Let's make Bar 2: x=2, y: -2 to 2, z: goes from 0 to -2?
        // Let's just make it straight.
        y = (Math.random() * 4) - 2;
        z = (y / 4) * -2; // Slant depth
    }
    // Bar 3: Left diagonal (closing the loop)
    else {
        // Connects (-2, -2, -2) back to (-2, 2, 0)?
        // Let's just do a simple triangle loop.
        const t = Math.random();
        const p1 = new THREE.Vector3(2, -2, -2);
        const p2 = new THREE.Vector3(-2, 2, 0);
        const p = new THREE.Vector3().lerpVectors(p1, p2, t);
        x = p.x + (Math.random()-0.5)*0.5;
        y = p.y + (Math.random()-0.5)*0.5;
        z = p.z + (Math.random()-0.5)*0.5;
    }
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

// 4. Cardioid (Heart 3D)
export const generateCardioid = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let u = Math.random() * Math.PI; // 0 to PI
    let v = Math.random() * Math.PI * 2; // 0 to 2PI
    
    // Heart shape formula (approximate)
    // x = 16sin^3(t)
    // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
    // This is 2D.
    
    // 3D Heart:
    // (x^2 + 9/4y^2 + z^2 - 1)^3 - x^2z^3 - 9/80y^2z^3 = 0
    // Hard to sample uniformly.
    
    // Parametric approach:
    // x = 16 sin^3(u) sin(v)
    // y = 13 cos(u) - 5 cos(2u) - 2 cos(3u) - cos(4u)
    // z = 16 sin^3(u) cos(v)
    // This rotates the 2D heart around Y axis.
    
    // Let's use the rotation of the 2D heart curve.
    // u is the parameter for the heart curve (0 to 2PI)
    u = Math.random() * Math.PI * 2;
    // v is the rotation angle (0 to PI) - wait, full rotation is 2PI?
    // Let's just scatter points near the surface.
    
    const hx = 16 * Math.pow(Math.sin(u), 3);
    const hy = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
    
    // Rotate around Y axis
    // But we want volume, so let's add some noise or layers.
    // Let's just do the surface for now.
    
    // We need a 3rd dimension. Let's use 'v' to rotate 'hx' around Y.
    // r = hx (radius from Y axis) -> wait, hx can be negative.
    // Let's treat hx as the radial distance? No.
    
    // Let's use a simpler spherical modification.
    // x = r * sin(theta) * cos(phi)
    // y = r * sin(theta) * sin(phi)
    // z = r * cos(theta)
    // Modify r based on angles?
    
    // Let's stick to the rotated 2D heart.
    // x = hx * cos(v)
    // z = hx * sin(v)
    // y = hy
    
    // Scale down
    const scale = 0.25;
    
    positions[i * 3] = hx * Math.cos(v) * scale;
    positions[i * 3 + 1] = hy * scale;
    positions[i * 3 + 2] = hx * Math.sin(v) * scale;
  }
  return positions;
};
