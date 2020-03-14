const fs = require('fs'); //文件读写
const path = require('path'); //路径配置
const utils = require('../helper/utils')
const ejs = require('ejs'); //ejs模版引擎
const {assemblyData}  = require("./assemblyData");





exports.conversionHome = (ejsData) => {
    let renderData = assemblyData(ejsData);
    let template = fs.readFileSync(path.resolve(__dirname, '../ejs/home.ejs'), 'utf8');
    const ModelHtml = utils.formatting(ejs.render(template, renderData.page));
    fs.writeFile(`page.tsx`, ModelHtml, 'utf8', () => {
    })
}
