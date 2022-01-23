const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv({
  allowUnionTypes: true, // to allow `string | number`
});

const schema = JSON.parse(fs.readFileSync("../state_schema.json"));
const validate = ajv.compile(schema);

const VERSION = 9;

let successes = 0;
let crashes = 0;
let wrongVersion = 0;
let total = 0;
fs.readdirSync("./calc_states").forEach((filename) => {
  fullFilename = path.join("./calc_states", filename);
  try {
    const textContents = fs.readFileSync(fullFilename);
    const data = JSON.parse(textContents);
    if (data.version !== VERSION) {
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
  } catch {
    // Crashes mostly come from empty or completely malformed graph data.
    // These are not an issue with the type definitions
    crashes += 1;
  }
});
console.log(
  `\nTesting finished: ${successes}/${total} version-${VERSION} graphs passed. Skipped ${
    wrongVersion + crashes
  } graphs (${wrongVersion} incorrect versions and ${crashes} test runner exceptions).`
);
