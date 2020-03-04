const prettier = require('prettier');

exports.formatting = (ejs)=>{
    return prettier.format(ejs, {semi: false,parser: 'babel'});
}
