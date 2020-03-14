const utils = require('../helper/utils')
const {cosmiconfigSync} = require('cosmiconfig');//获取配置文件的



/**
 * 获取json配置
 * @returns {Config}
 */
const findSetting = () => {
    const explorer = cosmiconfigSync("code-automatic");
    let {config} = explorer.search();
    return config;
}


/**
 * 这边统一处理数据 集中处理
 */
exports.assemblyData = (ejsData) => {
    let {model, page} = findSetting();

    let effectMethodData = ejsData.mocks.map((item) => {
        return {
            queryMethod: utils.convertMethod(item),//请求方法名称
            params: utils.convertParam(item),//入参
            paramsType: utils.convertParamFirstACapital(item)//入参的ts类型
        }
    })
    const renderData = {
        model: {
            methodsName: importMethodsName(ejsData.mocks),//头部方法名称
            modelName: model.name,//model的名称
            effectMethod: effectMethodData,//effect方法
            importInterFace: effectMethodData.map(item => item.paramsType).join(",")//头部的interFace的内容
        },
        page: {
            pageName: page.name,
            modelName: model.name,
            mapDispatch:effectMethodData.map(item=>item.queryMethod)
        }
    }
    return renderData;
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
