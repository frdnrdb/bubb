var fs = require('fs');

function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return (fileSizeInBytes/1024).toFixed(1)+' kB'
}
console.log('___', getFilesizeInBytes('./dist/bubb.min.js'));
