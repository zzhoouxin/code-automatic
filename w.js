const fs = require('fs'); //文件读写
const path = require('path'); //路径配置



let cc =  fs.readFileSync(path.resolve(__dirname, 'action.ts'), 'utf8');
console.log("ccc===>",cc)

