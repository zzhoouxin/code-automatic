const prettier = require('prettier');

exports.formatting = (ejs)=>{
    return prettier.format(ejs, {semi: false,parser: 'babel'});
}


/**
 * action 方法名称
 * @type {function(*): string}
 */
var convertUrl = exports.convertUrl = function(url) {
    // /restful/:id/:list/{id} -> restful_id_list_id
    // /restful/:id/:list/{id}.json -> restful_id_list_id
    var _url = url
        .replace(/[:{}]/g, '')
        .replace(/-/g, '_')
        .split('/')
        .filter(value => !!value).join('_')
        .replace(/_(\w)/g, (str, letter) => letter.toUpperCase())  // 改成小驼峰
    return _url.split('.')[0]
}

/**
 * 生成请求函数名称
 * @param mock
 * @returns {string}
 */
exports.convertMethod = function(mock) {
    // 防止重名
    // restful_id_list_id => restful_id_list_id_g
    // or
    // restful_id_list_id => restful_id_list_id_p
    return convertUrl(mock.url)// + '_' + mock.method.toLowerCase();
}

/**
 * 请求体对象信息描述
 */
exports.convertQueryParamDesc = function(mock) {
    if (mock.parameters) {
        const params = JSON.parse(mock.parameters)[0]
        if(params && params.schema && params.schema.properties){
            let desc = ""
            for(let key in params.schema.properties){
                desc += `${key}:${params.schema.properties[key].description}|${params.schema.properties[key].type},`
            }
            return `{${desc}}`;
        }else{
            return ''
        }
    } else return ''
}

/**
 *
 */

exports.convertParam = function(mock) {
    if (mock.parameters) {
        const params = JSON.parse(mock.parameters)
        return params.map(T => T.name).join(', ')
    } else return ''
}

/**
 * 请求体类型大写
 * @param mock
 */
exports.convertParamFirstACapital = function(mock) {
    if (mock.parameters) {
        const params = JSON.parse(mock.parameters)
        return params.map(T => T.name.substring(0, 1).toUpperCase() + T.name.substring(1)).join(', ')
    } else return ''
}


/**
 * 响应体Ts类型
 * @param mock
 * @returns {string|*}
 */
exports.responseName = function(mock) {
    let responseName = "";
    if (mock.response_model) {
        const response_model = JSON.parse(mock.response_model)[200]
        if(response_model.schema && response_model.schema.title ){
            if(response_model.schema.title  === "ResponseVo"){
                return ''
            }else if(response_model.schema.title.includes("ResponseVo") ){
                responseName = "<"+response_model.schema.title.split("»").join("").split("«").join("")+">"
            }
        }
    }
    return responseName;

}

