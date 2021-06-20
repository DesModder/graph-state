const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

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
    console.log(graphID, "PASS");
  } else {
    const printedErrors = [validate.errors[0]];
    if (validate.errors.length > 1) printedErrors.push("...");
    console.log(graphID, "FAIL", printedErrors);
  }
});
console.log(
  `\nTesting finished: ${successes}/${total} version-8 graphs passed. ${wrongVersion} graphs are of a lower version`
);
