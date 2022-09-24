const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const path = require('path');
const which = require('which');

const walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  let i = 0;
  (function next() {
    let file = list[i++];
    if (!file) {
      return;
    }
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      const res = walk(file);
      results = results.concat(res);
      next();
    } else {
      results.push(file);
      next();
    }
  })();

  return results;

};

function getVoltaPrefix() {
  const VOLTA_PREFIX = 'volta run';
  const hasVoltaCommand = which.sync('volta', { nothrow: true }) !== null;
  return hasVoltaCommand ? VOLTA_PREFIX : '';
}

function npmInstallSubfolders({ rootFolder, verbose, client, postAction }) {
  client = client || 'npm';

  const results = walk(rootFolder);

  results.forEach((fileSrc) => {
    if (fileSrc.endsWith(path.sep + 'package.json') && !/node_modules/.exec(fileSrc)) {
      const filePath = fileSrc.replace(path.sep + 'package.json', '');

      if (verbose) {
        console.log('===================================================================');
        console.log(`Performing "${client} install" inside ${filePath}`);
        console.log('===================================================================');
      }

      const npmCommand = os.platform().startsWith('win') ? `${client}.cmd` : client;

      const command = `${getVoltaPrefix()} ${npmCommand} install`;

      spawnSync(command, {
        stdio: 'inherit',
        shell: true,
        env: process.env,
        cwd: filePath,
      });

      if (postAction) {
        postAction(filePath);
      }
    }
  });

}

module.exports = npmInstallSubfolders;
