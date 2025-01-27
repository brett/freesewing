---
title: sewTogether
---

The `sewTogether` macro is used to mark where two parts of the same `part` need 
to be sewn together. This happens when you want to construct a cone for instance.

It is provided by [plugin-annotations](/reference/plugins/annotations), which is
part of [core-plugins](/reference/plugins/core) (so it is available by default).

## Signature

```js
macro('sewTogether', {
  String id = 'sewtogether',
  Point from,
  Point to,
  Point middle = null,
  Boolean hinge = false,
  String prefix = 'sewtogether',
  Boolean force = false,
})
```

## Example

<Example caption="An example of the sewtogether macro">
```js
({ Point, points, Path, paths, macro, part }) => {
  points.seamTL = new Point(0,0)
  points.seamM = new Point(30,-10)
  points.seamTR = new Point(60,0)

  paths.seam = new Path()
    .move(points.seamTL)
    .line(points.seamM)
    .line(points.seamTR)
    .attr('class', 'fabric')

  points.from = new Point(45,-5)
  points.to = new Point(15,-5)
  points.middle = points.seamM.copy()

  macro('sewTogether', {
    from: points.from,
    to: points.to,
    middle: points.middle,
    hinge: true,
  })

  return part
}
```
</Example>

## Configuration

| Property        | Default  | Type                | Description |
|----------------:|----------|---------------------|-------------|
| `id`            | `sewtogether` | `string` | The ID of this macro instance |
| `from`          |          | [Point](/reference/api/point) | One side of what needs to be sewn together |
| `to`            |          | [Point](/reference/api/point) | The other side of what needs to be sewn together |
| `middle`        | null     | [Point](/reference/api/point) | The middle point (when ommitted, it will be halfway between `from` and `to`) |
| `prefix`        | 'sewtogether'  | String   | The prefix to be used for creating all the points and paths |
| `hinge `        | `false`  | Boolean  | Draws the hinge line                  |
| `force`      | `false`    | `boolean`  | Set this to `true` to display the macro output even when `complete` is `false` |

## Notes

This macro takes the `complete` setting into account and won't output anything when both complete and `force` are `false`.

This macro is aware of the `sa` setting. Normally it draws the 
hinge line on the inside of the part (following the counter-clockwise 
standard). When the `sa` is provided it draws the hinge line on the 
outside, up to the `sa` line.
