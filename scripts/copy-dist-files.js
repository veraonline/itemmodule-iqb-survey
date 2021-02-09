const fs = require('fs');

const fileContent = fs.readFileSync('wrapper/index.html', 'utf8').toString();

fs.writeFileSync('dist/index.html', fileContent, 'utf8');
