import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import fs from "fs";

const HOST = "https://static.gongbushang.com/";

const files = await imagemin(["public/*.{jpg,png}"], {
  destination: "images",
  plugins: [
    imageminJpegtran(),
    imageminPngquant({
      quality: [0.6, 0.8],
    }),
  ],
});

const dests = files
  .map(({ destinationPath }) => {
    const path = destinationPath.replace(/.*\\/, `${HOST}images/`);

    return `<img src="${path}" />`;
  })
  .reduce((sum, path, index) => {
    if (!(index % 2)) {
      return [...sum, [path]];
    }

    return [...sum.slice(0, -1), [sum[sum.length - 1][0], path]];
  }, [])
  .map((group) => group.join(","))
  .join("\n");

fs.writeFileSync("dest.csv", dests);
