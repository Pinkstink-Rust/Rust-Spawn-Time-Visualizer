const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    configureWebpack: {
        mode: isDev ? 'development' : 'production',
        plugins: [
            new BundleAnalyzerPlugin({ analyzerMode: isDev ? "server" : "static", openAnalyzer: false })
        ],
        optimization: {
            runtimeChunk: 'multiple',
            splitChunks: {
                chunks: 'all',
                minSize: 10000,
                maxSize: 50000,
                minChunks: 1,
                maxInitialRequests: Infinity,
                automaticNameDelimiter: '~',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                    // Merge all the CSS into one file
                    styles: {
                        name: 'styles',
                        test: /\.s?css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        }
    },
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.optimization = {
                    minimizer: [new UglifyJsPlugin()]
                };
                return options;
            })
            .end();

        config.module
            .rule('pug')
            .test(/\.pug$/)
            .use('pug-plain-loader')
            .loader('pug-plain-loader')
            .end();

        config.plugin('html')
            .tap(args => {
                args[0].title = "Rust Spawn Time Visualizer";
                return args;
            })
            .end();
    }
}