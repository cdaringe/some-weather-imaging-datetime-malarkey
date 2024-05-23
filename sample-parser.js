// https://services.swpc.noaa.gov/images/animations/geospace/north_america/
// copy(
//   [...document.body.childNodes[3].children]
//    .filter(it => it.tagName==='A')
//    .splice(4).map(it => it.href)
//    .map(it => new URL(it).pathname.split('/'))
//    .map(it => it[it.length - 1])
//    .join('\n')
// )

const fs = require("node:fs");
const values = fs
  .readFileSync("sample.txt", "utf-8")
  .split("\n")
  .map((line) => {
    const [_north, _america, a, b] = line.trim().replace(".png", "").split("_");
    if (!a) return [];
    function aToDate(partialDate) {
      const year = partialDate.slice(0, 4);
      const month = partialDate.slice(4, 6);
      const day = partialDate.slice(6, 8);
      const hour = partialDate.slice(9, 11);
      const minute = partialDate.slice(11, 13);
      const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${a}`);
      }
      return date;
    }
    function bToDate(partialDate) {
      const year = partialDate.slice(0, 4);
      const month = partialDate.slice(4, 6);
      const day = partialDate.slice(6, 8);
      const hour = partialDate.slice(9, 11);
      const minute = partialDate.slice(11, 13);
      const second = partialDate.slice(13, 15);
      const date = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second),
      );
      if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${a}`);
      }
      return date;
    }
    return [aToDate(a), bToDate(b)];
  })
  .filter((parts) => parts.length > 0)
  .sort(([, a], [, b]) => a.getTime() - b.getTime())
  .map(([a, b], i) =>
    [i, a.toISOString(), a.getTime(), b.toISOString(), b.getTime()].join(","),
  )
  .join("\n");

fs.writeFileSync("output.csv", "i,a_iso,a_epo,b_iso,b_epo\n" + values);
