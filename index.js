const axios = require('axios');
const _ = require("lodash")
const {cosmiconfigSync} = require('cosmiconfig');//获取配置文件的
const logger = require('./helper/logger')
const JsonToTS = require('json-to-ts')
const ejs = require('ejs'); //ejs模版引擎
const fs = require('fs'); //文件读写
const path = require('path'); //路径配置
const utils = require("./helper/utils")//一些工具方法
const ora = require("ora");
let codeConfig = {};
const spinners = [ora("代码自动生成中...")];
const {conversionModel} = require('./conversionModel')




run();

async function run() {
    spinners[0].start();
    const explorer = cosmiconfigSync("code-automatic");
    let {config} = explorer.search()
    codeConfig = config;
    if (!codeConfig) {
        logger.fatal('未找到 ".code-automaticrs" 相关配置文件.   ')
    }
    const swaggerData = await fetchData();
    if (swaggerData) {
        //过滤数据
        filterAPI(swaggerData.data.data)
        await connerEalToHtml(swaggerData.data.data)
        spinners[0].succeed("代码生成成功~ ");
    }

}

/**
 * 请求swagger json数据
 * @returns {Promise<AxiosResponse<T>>}
 */
async function fetchData() {
    const swaggerData = await axios.get(codeConfig.host, {
        params: {
            project_ids: [codeConfig.id].join(",")
        }
    })
    return swaggerData;
}

/**
 * 根据数据转换代码
 * @param data
 * @returns {Promise<void>}
 */
async function connerEalToHtml(data){
    const mocks = data[codeConfig.id] && data[codeConfig.id].mocks;
    const ejsData = {mocks, $$: utils}
    //读取模板
    let action = fs.readFileSync(path.resolve(__dirname, './ejs/action.ejs'), 'utf8');
    //渲染数据
    let webApiHtml = utils.formatting(ejs.render(action, ejsData));
    //渲染model
    conversionModel(ejsData);
    // //写入数据
    await fs.writeFile('action.ts', webApiHtml, 'utf8', async () => {
        let interfaceContent = "\n";
        //这边遍历对象-渲染请求参数的params
        mocks.map((item) => {
            let parameters = JSON.parse(item.parameters)[0];
            let responseModel = JSON.parse(item.response_model)[200]
            //Response的interface
            if (responseModel && responseModel.example && responseModel.example.data && !_.isEmpty(responseModel.example.data)) {
                let responseInterfaceName = utils.responseName(item);
                JsonToTS(responseModel.example.data, {rootName: responseInterfaceName}).forEach(resTypeInterface => {
                    interfaceContent += resTypeInterface + "\n";
                })
            }
            //处理请求的interface
            if (parameters && parameters.example) {
                if (!_.isObject(parameters.example)) {
                    let obj = new Object();
                    obj[parameters.name] = parameters.example
                    parameters.example = obj;
                }
                let interFaceName = utils.convertParamFirstACapital(item);
                JsonToTS(parameters.example, {rootName: interFaceName}).forEach(typeInterface => {
                    interfaceContent += typeInterface + "\n";
                })
            }
        })
        await fs.appendFile(path.resolve(__dirname, 'action.ts'), interfaceContent, 'utf8', () => {
        });
    });

}




/**
 * 过滤黑白名单的数据
 * @param {AxiosResponse<T>} apis
 */
function filterAPI(apis) {
    debugger
    Object.keys(apis).forEach((projectId) => {
        var api = apis[projectId]
        var whiteList = codeConfig.white
        var blackList = codeConfig.black;
        api.mocks = api.mocks.filter((mock) => {
            if (!_.isEmpty(whiteList)) {
                return _.includes(revertUrl(whiteList, mock.url), mock.url)
            } else if (!_.isEmpty(blackList)) {
                return !_.includes(revertUrl(blackList, mock.url), mock.url)
            }
            return true
        })
    })
}


function revertUrl(filters, url) {
    return filters.map(filter => {
        return url.indexOf(filter) !== -1 ? url : filter
    })
}





