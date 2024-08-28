const fs = require('fs');
const tape = require('tape');
const parser = require('../index.js');

const isOSCFile = (filename) => (/^.*\.osc$/).test(filename);
const stripExtension = (filename) => filename.split('.')[0];

const filenames =
  fs.readdirSync('tests/data', { encoding: 'utf-8' })
    .filter(isOSCFile)
    .map(stripExtension);

filenames.forEach(function(filename) {
  tape(`testing file: ${filename}`, function(t) {
    const xml = fs.readFileSync(`tests/data/${filename}.osc`, { encoding: 'utf-8' });
    const expected = JSON.parse(fs.readFileSync(`tests/data/${filename}.json`));

    parser(xml, null).then((actual) => {
      t.deepEqual(actual, expected, 'parsed correctly');
      t.end();
    });
  });
});
