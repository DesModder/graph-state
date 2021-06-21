const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv({
  allowUnionTypes: true, // to allow `string | number`
});

const schema = JSON.parse(fs.readFileSync("./state.json"));
const validate = ajv.compile(schema);

let successes = 0;
let wrongVersion = 0;
let total = 0;
fs.readdirSync("./calc_states").forEach((filename) => {
  fullFilename = path.join("./calc_states", filename);
  const data = JSON.parse(fs.readFileSync(fullFilename));
  if (data.version !== 8) {
    wrongVersion += 1;
    return;
  }
  const valid = validate(data);
  const graphID = filename.split(".")[0];
  total += 1;
  if (valid) {
    successes += 1;
  } else {
    console.log(graphID, "FAIL", validate.errors);
  }
});
console.log(
  `\nTesting finished: ${successes}/${total} version-8 graphs passed. Skipped ${wrongVersion} graphs (different versions).`
);
