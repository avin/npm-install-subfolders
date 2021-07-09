# npm-install-subfolders

Do `npm install` for all subfolders.

## Usage

```js
const npmInstallSubfolders = require('npm-install-subfolders');
const path = require('path');

npmInstallSubfolders({
  rootFolder: path.resolve(__dirname, 'static'),
  verbose: true,
  client: 'npm', // npm | yarn
  postAction: (path) => {
    console.log('+++', path);
  },
});
```
