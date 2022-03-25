const { readFileSync } = require('fs')
const { resolve } = require('path')
const { compileHTML } = require('./compiler')
const INNER_MARK = '<!--inner-->'

class MdToHtmlPlugin {
  constructor({ template, filename }) {
    if (!template) {
      throw new Error('The config for "template" must be configured');
    }
    this.template = template;
    this.filename = filename ? filename : 'md.html';
  }

  // apply:编译的过程钩子函数 compiler:有相应的钩子集合
  apply(compiler) {
    // tap(一般叫插件名,(compilation)=>{}) , compilation.assets
    compiler.hooks.emit.tap('md-to-html-plugin', (compilation) => {
      const _assets = compilation.assets;
      console.log(_assets);
      // readFileSync 同步
      const _mdContent = readFileSync(this.template, 'utf8');
      const _templateHtml = readFileSync(resolve(__dirname, "template.html"), 'utf-8')
      // console.log(_mdContent);
      // 变为数组
      const _mdContentArr = _mdContent.split('\n');
      // console.log(_mdContentArr);
      // 替换为标签
      const _htmlStr = compileHTML(_mdContentArr)
      // console.log(_htmlStr)
      const _fileHtml = _templateHtml.replace(INNER_MARK, _htmlStr)

      // 写入文件
      _assets[this.filename] = {
        source() {
          return _fileHtml;
        },
        size() {
          return _fileHtml.length;
        }
      }
    })
  }
}

module.exports = MdToHtmlPlugin;
