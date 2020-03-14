/**
 * 此模块用于生成model模块
 */

const fs = require('fs'); //文件读写
const path = require('path'); //路径配置
const utils = require('../helper/utils')
const ejs = require('ejs'); //ejs模版引擎
const {cosmiconfigSync} = require('cosmiconfig');//获取配置文件的
const {assemblyData}  = require("./assemblyData");


const findSetting = () => {
    const explorer = cosmiconfigSync("code-automatic");
    let {config} = explorer.search();
    return config.model && config.model.name;
}


/**
 * 改变一下生成的逻辑-渲染逻辑不放在ejs
 * @param ejsData
 */
exports.conversionModel = (ejsData) => {
    let renderData = assemblyData(ejsData);
    let modelTemplate = fs.readFileSync(path.resolve(__dirname, '../ejs/model.ejs'), 'utf8');
    const ModelHtml = utils.formatting(ejs.render(modelTemplate, renderData.model));
    fs.writeFile(`${findSetting()}Model.ts`, ModelHtml, 'utf8', () => {
    })

}


/**
 * 组长头部import action的对象名称
 * @param mocks
 */
importMethodsName = (mocks) => {
    return mocks.map((_mock) => {
        return utils.convertMethod(_mock)
    }).join(",")
}
