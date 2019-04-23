import { version } from "../package.json";

export default {
  name: "florent",
  version: version,
  measurements: ["headCircumference"],
  dependencies: {
    side: "top",
    brimTop: "brimBottom",
    brimInterfacing: "brimBottom"
  },
  inject: {
    side: "top",
    brimTop: "brimBottom",
    brimInterfacing: "brimBottom"
  },
  options: {
    // Constants
    topSide: 0.8,
    brim: 0,
    // Percentages
    headEase: { pct: 2, min: 0, max: 5 }
  }
};
