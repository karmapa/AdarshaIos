// This patch fixes "Unable to resolve module react-native-android-kdb" error

const path = require('path');
const fs = require('fs');

const platformPath = path.resolve(__dirname, '../node_modules/ksana-database/platform.js');


var platformContent = fs.readFileSync(platformPath, 'utf8');

platformContent = platformContent.replace(/require\(\"react-native-android-kdb\"\);|require\(\'react-native-android-kdb\'\);/g, '');

// Write file.
fs.writeFileSync(platformPath, platformContent, 'utf8');
