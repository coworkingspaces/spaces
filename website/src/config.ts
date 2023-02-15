const tileServer = "https://tiles.geprog.com";

const config = {
  map: {
    brightMapStyle: `${tileServer}/styles/bright-matter/style.json`,
    darkMapStyle: `${tileServer}/styles/gray-matter/style.json`,
    minZoom: 5,
    maxZoom: 18,
    center: [10.5529, 52.3249] as [number, number], // currently middle of Germany
    zoom: 8,
    // [west, south, east, north] (currently borders of Germany)
    maxBounds: [5.0, 46.0, 15.0, 57.0] as [number, number, number, number],
  },
};

export function getConfig(): typeof config {
  return config;
}
