
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 多页面打包
const setMPA = () => {
    const entry = {}
    const htmlWebpackPlugins = []

    const entryFiles = glob.sync(path.join(__dirname, '../src/views/*/index.js'))

    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index]
        const match = entryFile.match(/src\/views\/(.*)\/index\.js/)
        const pageName = match && match[1]

        entry[pageName] = entryFile
        htmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                template: path.join(__dirname, `../src/views/${pageName}/index.html`),
                filename: `${pageName + (pageName !== 'index' ? '/index' : '')}.html`,
                chunks: [pageName, 'vendors', 'commons'],
                inject: true, // 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
                hash: true, // 回给script标签中的js文件增加一个随机数 防止缓存 bundle.js?22b9692e22e7be37b57e
                // 压缩选项 会有很多选项 可以去npm官网上查看对应的配置
                minify: {
                    html5: true,
                    collapseWhitespace: true, // 去空格
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: true, // 去注释
                    removeAttributeQuotes: true, // 去属性的引号
                }
            })
        )
    })

    return {
        entry,
        htmlWebpackPlugins
    }
}

module.exports = setMPA
