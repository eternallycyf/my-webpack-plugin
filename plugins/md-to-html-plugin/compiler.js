const { randomNum } = require('./utils.js')
const reg_mark = /^(.+?)\s/;
const reg_sharp = /^\#/;
const reg_crossbar = /^\-/;
const reg_number = /^\d/;

function createTree(mdArr) {
  let _htmlPool = {};

  let _lastMark = '';

  let _key = 0;

  mdArr.forEach((mdFragment) => {
    // console.log(mdFragment)
    const matched = mdFragment.match(reg_mark)
    // console.log(matched);
    if (matched) {
      const mark = matched[1]

      const input = matched['input']
      // console.log(input)

      if (reg_sharp.test(mark)) {
        // console.log(matched);
        const tag = `h${mark.length}`;
        const tagContent = input.replace(reg_mark, '')

        // console.log(tag,tagContent);

        //reg_sharp.test(_lastMark
        if ((_lastMark === mark)) {
          _htmlPool[tag].tags = [..._htmlPool[`${tag}-${_key}`], `<${tag}>${tagContent}</${tag}>`]
        } else {
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`${tag}-${_key}`] = {
            type: 'single',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }

      }

      if (reg_crossbar.test(mark)) {
        const tagContent = input.replace(reg_mark, '');
        // console.log(tagContent);
        const tag = `li`;
        if (reg_crossbar.test(_lastMark)) {
          _htmlPool[`ul-${_key}`].tags = [..._htmlPool[`ul-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
        } else {
          _key = randomNum();
          _lastMark = mark;
          _htmlPool[`ul-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }

      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_mark, '');
        const tag = `li`;
        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags = [..._htmlPool[`ol-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
        } else {
          // console.log(_lastMark,mark);
          _lastMark = mark;
          _key = randomNum();
          _htmlPool[`ol-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }
    }

  })

  // console.log(_htmlPool);
  return _htmlPool;
}

function compileHTML(_mdArr) {
  // console.log(_mdArr)
  const _htmlPool = createTree(_mdArr)
  // console.log(_htmlPool);
  let _htmlStr = '';
  let item;
  for (let k in _htmlPool) {
    console.log(k, _htmlPool[k]);
    item = _htmlPool[k];

    if (item.type === 'single') {
      item.tags.forEach(tag => {
        _htmlStr += tag;
      });
    } else if (item.type === 'wrap') {
      let _list = `<${k.split('-')[0]}>`;
      item.tags.forEach(tag => {
        _list += tag;
      })
      _list += `</${k.split('-')[0]}>`;

      _htmlStr += _list
    }
  }

  return _htmlStr;

}

module.exports = {
  compileHTML
}

/**
 * {
 *   h1-hash: {
 *     type:'single,
 *     tags: ['<h1>这是一个h1</h1>']
 *   },
 *   ul-hash: {
 *     type: 'wrap',
 *     tags:[
 *      '<li>这是ul的第1项</li>'
 *      '<li>这是ul的第2项</li>'
 *      '<li>这是ul的第3项</li>'
 *      '<li>这是ul的第4项</li>'
 *     ]
 *   }
 * }
 */