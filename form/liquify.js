const fs = require("fs");
const root = `${__dirname}/build`;

const liquify = async () => {
  try {
    console.log("Starting liquify...")
    await moveStatic();
    await makeLiquid();
    console.log("Done!")
  } catch (error) {
    console.log(error);
  }
};

const makeLiquid = async () => {
  console.log("Moving index.html to liquid template...")
  const file = await fs.readFileSync(`${root}/index.html`, {
    encoding: `UTF-8`,
  });
  const srcs = file.match(new RegExp(/src="(.*?)"/, "g"));
  let newFile = file;
  for (const i in srcs) {
    const filePath = srcs[i].match(/"((?:\\.|[^"\\])*)"/)[1];
    const split = filePath.split("/");
    newFile = newFile.replace(
      new RegExp(srcs[i], "g"),
      `src="{{ '${split[split.length - 1]}' | asset_url }}"`
    );
  }
  await fs.writeFileSync(`../../snippets/recommendationTool.liquid`, newFile);
};

const moveStatic = async () => {
  console.log("Moving javascript and media assets...")
  const previousMap = await fs.existsSync(`../../assets/previousChunks.json`);
  if (previousMap) {
    const previous = require("../../assets/previousChunks.json");
    const { chunks } = previous;
    for (const i in chunks) {
      const chunk = chunks[i];
      await fs.unlinkSync(`../../assets/${chunk}`);
    }
    await fs.unlinkSync(`../../assets/previousChunks.json`);
  }

  const jsDir = `${root}/static/js`;
  const mediaDir = `${__dirname}/src/public`;
  const jsFiles = await fs.readdirSync(jsDir);
  const mediaFiles = await fs.readdirSync(mediaDir);

  let map = { chunks: [] };

  for (const i in jsFiles) {
    const file = jsFiles[i];
    const isJs = file.split(".")[file.split(".").length - 1] === "js";
    map.chunks.push(isJs ? `${file}.liquid` : file);
    const data = await fs.readFileSync(`${jsDir}/${file}`);
    await fs.writeFileSync(
      isJs ? `../../assets/${file}.liquid` : `../../assets/${file}`,
      data
    );
  }
  for (const i in mediaFiles) {
    const file = mediaFiles[i];
    map.chunks.push(`${file}`);
    const data = await fs.readFileSync(`${mediaDir}/${file}`);
    await fs.writeFileSync(`../../assets/${file}`, data);
  }
  console.log("Writing map for clean-up on next build...")
  await fs.writeFileSync(`../../assets/previousChunks.json`, JSON.stringify(map));
};

liquify();
