# npm-install-subfolders

Do `npm install` for all subfolders.

## Usage

```js
const npmInstallSubfolders = require('npm-install-subfolders');

npmInstallSubfolders({
  rootFolder: './static',
  verbose: true,
  client: 'npm', // npm | yarn
  postAction: (path) => {
    console.log('path = ', path);
  },
});
```
