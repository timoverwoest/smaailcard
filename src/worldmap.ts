import type { Dot } from "./dots";

type Poly = [number, number][];

/* Coarse continent outlines (lon, lat), ported from departures_board.py. */
const AFRICA: Poly = [
  [-17, 15], [-16, 21], [-10, 30], [0, 35], [11, 37], [20, 32], [25, 32],
  [33, 31], [37, 22], [43, 12], [51, 12], [48, 2], [41, -5], [40, -15],
  [35, -24], [28, -33], [20, -35], [18, -30], [12, -18], [9, -1], [2, 5],
  [-8, 4], [-13, 9],
];
const EURASIA: Poly = [
  [-10, 36], [-9, 44], [-2, 48], [2, 51], [5, 58], [11, 58], [10, 64],
  [21, 70], [30, 70], [40, 68], [55, 68], [70, 72], [85, 74], [100, 76],
  [115, 73], [130, 72], [140, 70], [160, 68], [170, 66], [180, 65], [180, 58],
  [160, 57], [150, 59], [142, 53], [135, 44], [129, 42], [126, 37], [122, 31],
  [120, 23], [110, 20], [105, 10], [100, 5], [98, 8], [95, 16], [90, 22],
  [80, 10], [76, 8], [72, 20], [68, 24], [60, 25], [56, 26], [50, 28],
  [45, 35], [36, 36], [28, 37], [20, 40], [15, 40], [12, 45], [3, 43], [-3, 37],
];
const NAMER: Poly = [
  [-168, 66], [-160, 58], [-150, 60], [-140, 60], [-130, 54], [-124, 48],
  [-124, 40], [-117, 32], [-105, 22], [-97, 18], [-92, 15], [-84, 10],
  [-78, 8], [-82, 15], [-88, 21], [-90, 29], [-82, 25], [-80, 32], [-75, 35],
  [-70, 42], [-60, 45], [-55, 50], [-65, 60], [-78, 62], [-95, 68], [-110, 70],
  [-130, 70], [-155, 71],
];
const SAMER: Poly = [
  [-78, 8], [-72, 12], [-62, 10], [-52, 5], [-44, -3], [-35, -6], [-38, -13],
  [-48, -25], [-58, -35], [-62, -40], [-65, -50], [-70, -55], [-73, -45],
  [-71, -33], [-72, -20], [-77, -8], [-80, 0],
];
const AUS: Poly = [
  [113, -22], [114, -33], [126, -32], [135, -35], [140, -38], [147, -38],
  [150, -35], [153, -28], [145, -15], [137, -12], [130, -12], [122, -17],
];
const GRE: Poly = [
  [-45, 60], [-25, 70], [-20, 76], [-30, 83], [-50, 82], [-58, 75], [-55, 65],
];

const POLYS: Poly[] = [AFRICA, EURASIA, NAMER, SAMER, AUS, GRE];

/* Equirectangular window the poster maps onto the dot grid. */
const LON0 = -170.0;
const LON1 = 180.0;
const LAT0 = 78.0;
const LAT1 = -56.0;

function inside(x: number, y: number, poly: Poly): boolean {
  let c = false;
  for (let i = 0, n = poly.length; i < n; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % n];
    if (y1 > y !== y2 > y) {
      const xin = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (x < xin) c = !c;
    }
  }
  return c;
}

export interface WorldMap {
  land: Dot[];
  pin: Dot | null;
}

/** Land dots for the mini world map, plus the optional home-base marker. */
export function worldMap(
  x0: number,
  y0: number,
  cols: number,
  rows: number,
  pitch: number,
  pin: [number, number] | null,
): WorldMap {
  const land: Dot[] = [];
  for (let cy = 0; cy < rows; cy++) {
    const lat = LAT0 + ((cy + 0.5) / rows) * (LAT1 - LAT0);
    for (let cx = 0; cx < cols; cx++) {
      const lon = LON0 + ((cx + 0.5) / cols) * (LON1 - LON0);
      if (POLYS.some((p) => inside(lon, lat, p))) {
        land.push({ x: x0 + cx * pitch, y: y0 + cy * pitch });
      }
    }
  }

  let pinDot: Dot | null = null;
  if (pin) {
    const px = Math.round(((pin[0] - LON0) / (LON1 - LON0)) * cols - 0.5);
    const py = Math.round(((pin[1] - LAT0) / (LAT1 - LAT0)) * rows - 0.5);
    if (px >= 0 && px < cols && py >= 0 && py < rows) {
      pinDot = { x: x0 + px * pitch, y: y0 + py * pitch };
    }
  }
  return { land, pin: pinDot };
}
