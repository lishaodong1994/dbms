module.exports = {
    lintOnSave:false,
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'API': '@/API',
                "pages": '@/pages'
            }
        }
    },
    // 配置 webpack-dev-server 行为。
    // devServer: {
    //     proxy: {
    //         // '/proxy': {      
    //         //     target: `http://localhost:4000`,
    //         //     changeOrigin: true,
    //         //   	pathRewrite: {
    //         //         '^/proxy': ''  
    //         // 			}
    //         // },
    //     }
    // }
}