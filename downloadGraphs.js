const https = require("https");
const fs = require("fs");

const hashes = ["uaemeopdlh", "whbnt8igg3", "n4fg6ozex9"];

// https://stackoverflow.com/a/22907134/7481517
function download(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(callback); // close() is async, call cb after close completes.
      });
    })
    .on("error", function (err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (callback) callback(err.message);
    });
}

function downloadHash(hashIndex) {
  if (hashIndex >= hashes.length) {
    console.log("done");
    return;
  }
  const hash = hashes[hashIndex];
  console.log("downloading", hash);
  download(
    `https://saved-work.desmos.com/calc-states/production/${hash}`,
    `./calc_states/${hash}.json`,
    // short timeout to be nice to server
    () => setTimeout(() => downloadHash(hashIndex + 1), 300)
  );
}

downloadHash(0);
