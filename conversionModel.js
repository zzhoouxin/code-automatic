const fs = require('fs'); //文件读写
const path = require('path'); //路径配置
const utils = require('./helper/utils')
const ejs = require('ejs'); //ejs模版引擎
const {cosmiconfigSync} = require('cosmiconfig');//获取配置文件的



findSetting = ()=>{
    const explorer = cosmiconfigSync("code-automatic");
    let {config} = explorer.search();
    return config.model && config.model.name;
    console.log("config====>",config.model)
}


/**
 * 改变一下生成的逻辑-渲染逻辑不放在ejs
 * @param ejsData
 */
exports.conversionModel = (ejsData) => {
    findSetting();
    let modelTemplate = fs.readFileSync(path.resolve(__dirname, './ejs/model.ejs'), 'utf8');
    const renderData = {
        methodsName: importMethodsName(ejsData.mocks),//头部方法名称
        modelName:findSetting()//model的名称

    }
    const ModelHtml = utils.formatting(ejs.render(modelTemplate, renderData));
    fs.writeFile('reduxModel.ts', ModelHtml, 'utf8',  () => {})

}


/**
 * 组长头部import action的对象名称
 * @param mocks
 */
importMethodsName = (mocks) => {
   return mocks.map((_mock)=>{
       return utils.convertMethod(_mock)
    }).join(",")
}
