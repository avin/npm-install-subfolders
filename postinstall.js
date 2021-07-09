const fs = require('fs');
const os = require('os');
const childProcess = require('child_process');
const path = require('path');

const walk = function (dir, done) {
  let results = [];
  fs.readdir(dir, function (err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) {
        return done(null, results);
      }
      file = path.resolve(dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

function npmInstallSubfolders({ rootFolder, verbose, client, postAction }) {
  client = client || 'npm';

  walk(rootFolder, function (err, results) {
    if (err) throw err;

    results.forEach((fileSrc) => {
      if (fileSrc.endsWith(path.sep + 'package.json') && !/node_modules/.exec(fileSrc)) {
        const filePath = fileSrc.replace(path.sep + 'package.json', '');

        if (verbose) {
          console.log('===================================================================');
          console.log(`Performing "${client} install" inside ${filePath}`);
          console.log('===================================================================');
        }

        const npmCmd = os.platform().startsWith('win') ? `${client}.cmd` : client;

        childProcess.spawn(npmCmd, ['install'], {
          env: process.env,
          cwd: filePath,
          stdio: 'inherit',
        });

        if (postAction) {
          postAction(filePath);
        }
      }
    });
  });
}

module.exports = npmInstallSubfolders;
