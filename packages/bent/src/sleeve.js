export default function(part) {
  let { Point, Path, points, paths, store, options, measurements,utils } = part.shorthand();
  // FIXME: simplify points names a bit, they're too long

  function draftSleeve(part, tweak) {
    let { Point, Path, points, paths, store, options, measurements,utils } = part.shorthand();
    // Sleeve frame
    points.top = new Point(0, 0);
    points.boxTopRight = points.top.shift(0, store.get("sleevecapTarget") / 5.8 * tweak);
    points.boxTopLeft = points.boxTopRight.flipX();
    points.boxBottom = points.top.shift(-90, measurements.shoulderToWrist * (1 + options.sleeveLengthBonus));
    points.boxBottomRight = points.boxBottom.shift(0, points.boxTopRight.x);
    points.boxBottomLeft = points.boxBottomRight.flipX();
    points.armCenter = points.top.shift(
      -90,
      measurements.bicepsCircumference *
      (1+ options.bicepsEase) *
      options.sleevecapHeight *
      tweak
    );
    points.armRight = points.armCenter.shift(0, points.boxTopRight.x);
    points.armLeft = points.armRight.flipX();
    points.elbowCenter = points.top.shift(-90, measurements.shoulderToElbow);
    points.elbowRight = points.elbowCenter.shift(0, points.boxTopRight.x);
    points.elbowLeft = points.elbowRight.flipX();

    // Using sleeve width to adapt other values
    let factor = points.boxTopRight.x;

    // Note: us = undersleeve, ts = topsleeve
    points.backPitchPoint = new Point(factor, points.armCenter.y / 3);
    points.usTip = points.backPitchPoint.shift(180, factor / 4);
    points.tsLeftEdge = points.armLeft.shift(180, factor / 4);
    points.usLeftEdge = points.armLeft.shift(0, factor / 4);
    points.tsRightEdge = points.armRight.shift(0, factor / 9);
    points.usRightEdge = points.armRight.shift(180, factor / 9);
    points.frontPitchPoint = new Point(points.boxTopLeft.x, points.armCenter.y * 0.6);
    points.tsElbowLeft = points.elbowLeft.shift(180, factor / 9);
    points.usElbowLeft = points.elbowLeft.shift(0, factor / 2.4);

    // Different approach to sleeve bend, wrist right first
    points.tsWristRight = utils.beamsIntersect(
      points.elbowRight,
      points.boxBottomRight.rotate(options.sleeveBend * -1, points.elbowRight),
      points.boxBottomLeft,
      points.boxBottomRight
    );
    points.usWristRight = points.tsWristRight.clone();

    // Shift wrist left to the exact wrist width
    let wristWidth = measurements.wristCircumference * (1 + options.cuffEase);
    let topWrist = wristWidth/2 + factor/5;
    let underWrist = wristWidth/2 - factor/5;
    points.tsWristLeftHelperBottom = points.tsWristRight.shift(180, topWrist/2);
    points.usWristLeftHelperBottom = points.usWristRight.shift(180, underWrist/2);
    points.tsWristLeftHelperTop = points.tsElbowLeft.shiftFractionTowards(points.elbowRight, 0.5)
    points.usWristLeftHelperTop = points.usElbowLeft.shiftFractionTowards(points.elbowRight, 0.5)
    let tsWristAngle = points.tsWristLeftHelperBottom.angle(points.tsWristLeftHelperTop);
    let usWristAngle = points.usWristLeftHelperBottom.angle(points.usWristLeftHelperTop);
    points.tsWristLeft = points.tsWristRight.shift(tsWristAngle - 90, topWrist * -1);
    points.usWristLeft = points.usWristRight.shift(usWristAngle - 90, underWrist * -1);

    // Control points ts
    points.tsRightEdgeCpTop = points.tsRightEdge.shift(90, points.backPitchPoint.dy(points.tsRightEdge)/2);
    points.tsRightEdgeCpBottom = points.tsRightEdgeCpTop.flipY(points.tsRightEdge);
    points.elbowRightCpTop = points.tsWristRight.shiftFractionTowards(points.elbowRight, 1.15);
    points.topCpRight = points.top.shift(0, factor/1.6);
    points.topCpLeft = points.topCpRight.flipX();
    points.tsLeftEdgeCpRight = points.tsLeftEdge.shift(0, points.tsLeftEdge.dist(points.armLeft)/2);
    points.frontPitchPointCpBottom = points.frontPitchPoint.shiftFractionTowards(points.tsLeftEdgeCpRight, 0.666);
    points.frontPitchPointCpTop = points.frontPitchPointCpBottom.rotate(180, points.frontPitchPoint);
    points.tsElbowLeftCpTop = points.tsWristLeft.shiftFractionTowards(points.tsElbowLeft, 1.2);

    // Control points us
    points.usRightEdgeCpBottom = points.usRightEdge.shift(points.usTip.angle(points.elbowRight), points.usTip.dy(points.usRightEdge)/2);
    points.usRightEdgeCpTop = points.usRightEdgeCpBottom.rotate(180, points.usRightEdge);
    points._helper1 = new Path()
      .move(points.backPitchPoint)
      ._curve(points.topCpRight, points.top)
      .shiftAlong(5);
    points._helper2 = new Path()
      .move(points.backPitchPoint)
      ._curve(points.tsRightEdgeCpTop, points.tsRightEdge)
      .shiftAlong(5);
    points.usLeftEdgeRight = points.usLeftEdge.shift(0, points.usLeftEdge.dist(points.armCenter)/3);
    points.usLeftEdgeCpRight = points.usLeftEdge.shift(0, points.usLeftEdge.dist(points.armCenter)/1.2);

    // Angle of the usTip
    let angle = points._helper1.angle(points.backPitchPoint) - points.backPitchPoint.angle(points._helper2);
    points.usTipCpBottom = points.usRightEdgeCpTop.rotate(angle * -1, points.usTip)
    points.usElbowLeftCpTop = points.usWristLeft.shiftFractionTowards(points.usElbowLeft, 1.2);

    // Calculate length of the sleevecap seam
    let lenTop = new Path()
      .move(points.backPitchPoint)
      .curve(points.backPitchPoint, points.topCpRight, points.top)
      .curve(points.topCpLeft, points.frontPitchPointCpTop, points.frontPitchPoint)
      .curve(points.frontPitchPointCpBottom, points.tsLeftEdgeCpRight, points.tsLeftEdge)
      .length();
    let lenUnder = new Path()
      .move(points.usTip)
      .curve(points.usTipCpBottom, points.usLeftEdgeCpRight, points.usLeftEdgeRight)
      .line(points.usLeftEdge)
      .length();
    store.set("sleevecapLength", lenTop + lenUnder);
  }

  let armholeLength =
    store.get("frontArmholeLength") + store.get("backArmholeLength");
  let sleevecapEase = armholeLength * options.sleevecapEase;
  store.set("sleevecapEase", sleevecapEase);
  store.set("sleevecapTarget", armholeLength + sleevecapEase);

  let delta = 0;
  let runs = 0;
  let tweak = 1;
  let target = store.get("sleevecapTarget");
  do {
    draftSleeve(part, tweak);
    runs++;
    delta = store.get("sleevecapLength") - target;
    if (delta > 0) tweak = tweak * 0.99;
    else tweak = tweak * 1.02;
  } while (Math.abs(delta) > 2 && runs < 25);


  // Paths
  paths.ts = new Path()
    .move(points.tsWristRight)
    .line(points.elbowRight)
    .curve(points.elbowRightCpTop, points.tsRightEdgeCpBottom, points.tsRightEdge)
    .curve_(points.tsRightEdgeCpTop, points.backPitchPoint)
    .curve(points.backPitchPoint, points.topCpRight, points.top)
    .curve(points.topCpLeft, points.frontPitchPointCpTop, points.frontPitchPoint)
    .curve(points.frontPitchPointCpBottom, points.tsLeftEdgeCpRight, points.tsLeftEdge)
    .curve(points.tsLeftEdge, points.tsElbowLeftCpTop, points.tsElbowLeft)
    .line(points.tsWristLeft)
    .line(points.tsWristRight)
    .close()
    .attr("class", "lining");

  paths.us = new Path()
    .move(points.usWristRight)
    .line(points.elbowRight)
    .curve(points.elbowRightCpTop, points.usRightEdgeCpBottom, points.usRightEdge)
    .curve_(points.usRightEdgeCpTop, points.usTip)
    .curve(points.usTipCpBottom, points.usLeftEdgeCpRight, points.usLeftEdgeRight)
    .line(points.usLeftEdge)
    .curve(points.usLeftEdge, points.usElbowLeftCpTop, points.usElbowLeft)
    .line(points.usWristLeft)
    .line(points.usWristRight)
    .close()
    .attr("class", "stroke-xl interfacing");

  return part;
}
