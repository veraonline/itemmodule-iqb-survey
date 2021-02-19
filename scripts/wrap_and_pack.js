const fs = require('fs');
const childProcess = require('child_process');

childProcess.fork('node_modules/iqb-dev-components/src/js_css_packer.js', ['dist', 'verona-player-abi', 'dist']);

function readPackageVersion() {
  const packageJsonData = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`).toString());
  return packageJsonData.version;
}

function replaceVersion(fileContent) {
  const regexAppVersionMatch = /name="application-name"[^]+data-version="(\S+)"/gi.exec(fileContent);
  return fileContent.replace(`data-version="${regexAppVersionMatch[1]}"`,
    `data-version="${readPackageVersion()}"`);
}

const args = process.argv.slice(2);

let fileContent = '';
if (args[0] && args[0] === 'dev') {
  fileContent = fs.readFileSync('wrapper/index_dev.html', 'utf8').toString();
} else {
  fileContent = fs.readFileSync('wrapper/index_prod.html', 'utf8').toString();
}

fileContent = replaceVersion(fileContent);

fs.writeFileSync(`dist/abi_player_${readPackageVersion()}.html`, fileContent, 'utf8');
