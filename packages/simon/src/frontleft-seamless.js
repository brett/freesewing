import { addButtonHoles } from "./shared";

export default part => {
  let {
    store,
    measurements,
    utils,
    sa,
    Point,
    points,
    Path,
    paths,
    Snippet,
    snippets,
    complete,
    paperless,
    macro,
    options
  } = part.shorthand();
  let fold = options.buttonholePlacketFoldWidth;
  let width = options.buttonholePlacketWidth;
  points.placketCfNeck = points.cfNeck;
  points.placketTopFold1 = points.cfNeck.shift(180, width / 2);
  points.placketTopFold2 = points.cfNeck.shift(180, width * 1.5);
  points.placketTopEdge = points.cfNeck.shift(180, width * 2.5);
  points.placketBottomFold1 = points.cfHem.shift(180, width / 2);
  points.placketBottomFold2 = points.cfHem.shift(180, width * 1.5);
  points.placketBottomEdge = points.cfHem.shift(180, width * 2.5);

  paths.seam
    .line(points.placketTopEdge)
    .line(points.placketBottomEdge)
    .close();

  // Complete pattern?
  if (complete) {
    // Placket help lines
    paths.frontCenter = new Path()
      .move(points.cfNeck)
      .line(points.cfHem)
      .attr("class", "help");
    paths.placketFold1 = new Path()
      .move(points.placketTopFold1)
      .line(points.placketBottomFold1)
      .attr("class", "dotted");
    paths.placketFold2 = new Path()
      .move(points.placketTopFold2)
      .line(points.placketBottomFold2)
      .attr("class", "dotted");
    macro("sprinkle", {
      snippet: "notch",
      on: [
        "cfNeck",
        "cfHem",
        "placketTopFold1",
        "placketTopFold2",
        "placketBottomFold1",
        "placketBottomFold2"
      ]
    });

    // Buttons
    addButtonHoles(part, "cfNeck");

    // Title
    macro("title", { at: points.title, nr: 2, title: "frontLeft" });

    if (sa) {
      paths.saFromArmhole
        .line(points.placketTopEdge.shift(90, sa))
        .line(points.placketTopEdge)
        .move(points.placketBottomEdge)
        .line(points.placketBottomEdge.shift(-90, 3 * sa))
        .line(paths.hemSa.start());
    }
  }

  // Paperless?
  if (paperless) {
    let offset = 0;
    for (let pid of [
      "placketBottomFold2",
      "placketBottomFold1",
      "cfHem",
      "hips"
    ]) {
      offset += 15;
      macro("hd", {
        from: points.placketBottomEdge,
        to: points[pid],
        y: points.placketBottomEdge.y + offset + 3 * sa
      });
    }
    macro("hd", {
      from: points.placketTopEdge,
      to: points.neck,
      y: points.neck.y - 15 - sa
    });
    let len =
      points.cfNeck.dist(points.cfHips) * (1 - options.buttonFreeLength);
    points.button0 = points.placketTopEdge;
    let j;
    for (let i = 0; i < options.buttons; i++) {
      j = i + 1;
      macro("vd", {
        from: points["button" + j],
        to: points["button" + i],
        x: points.placketTopEdge.x - 15
      });
    }
    macro("vd", {
      from: points.placketBottomEdge,
      to: points.placketTopEdge,
      x: points.placketTopEdge.x - 30
    });
  }
  return part;
};
