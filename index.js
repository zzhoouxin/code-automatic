const axios = require('axios');
const _ = require("lodash")
const JsonToTS = require('json-to-ts')
const host = 'https://www.studyinghome.com/api/mock/by_projects';
const id = "5e5baaf483482d5224c000d8";
const projectIds = [id];
const white = [
 "/user/favorite/collect", "/news/create", "/wechat/jsapi" // 只生成 proxy 接口
];
const black = [];
const ejs = require('ejs'); //ejs模版引擎
const fs = require('fs'); //文件读写
const path = require('path'); //路径配置
const help = require("/Users/admin/code-automatic/helper/index.js")
const utils = require("./helper/utils")
//1.获取接口数据
async function start() {
    const swaggerData = await axios.get(host, {
        params: {
            project_ids: projectIds.join(',')
        }
    })
    let data = swaggerData.data.data;
    if (data) {
        //请求数据
        filterAPI(data)
        const mocks = data[id].mocks
        const ejsData = {mocks, $$: help}
        //读取模板
        let action = fs.readFileSync(path.resolve(__dirname, './ejs/action.ejs'), 'utf8');
        //渲染数据
        let webApiHtml = utils.formatting(ejs.render(action, ejsData));
        // //写入数据
        await fs.writeFile('action.ts', webApiHtml, 'utf8', async () => {
            let interfaceContent = "\n";
            //这边遍历对象-渲染请求参数的params
            mocks.map((item) => {
                let parameters = JSON.parse(item.parameters)[0];
                let responseModel = JSON.parse(item.response_model)[200]
                //Response的interface
                if (responseModel && responseModel.example && responseModel.example.data && !_.isEmpty(responseModel.example.data)) {
                    let responseInterfaceName = help.responseName(item);
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
                    let interFaceName = help.convertParamFirstACapital(item);
                    JsonToTS(parameters.example, {rootName: interFaceName}).forEach(typeInterface => {
                        interfaceContent += typeInterface + "\n";
                    })
                }
            })
            await fs.appendFile(path.resolve(__dirname, 'action.ts'), interfaceContent, 'utf8', () => {});
        });
    }
}
/**
 * 过滤黑白名单的数据
 * @param {json数据} apis
 */
function filterAPI(apis) {
    Object.keys(apis).forEach((projectId) => {
        var api = apis[projectId]
        var whiteList = white
        var blackList = black;
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


start();




