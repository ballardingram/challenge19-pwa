// REQUIRED > FUNCTIONALITY FOR WEBPACK
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
    entry: {
        app: './public/js/index.js'
    },
    output: {
        path: path.join(__dirname + "/dist"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                            name(file) {
                                return '[path][name].[ext]';
                            },
                            publicPath(url) {
                                return url.replace('../', './public/');
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuerty: 'jquery'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new WebpackPwaManifest({
            name: 'Budget Tracker',
            short_name: 'Budgets',
            description: 'An app that allows you add incoming funds and expenses.',
            start_url: '../public/index.html',
            background_color: '#01579b',
            theme_color: '#ffffff',
            fingerprints: false,
            inject: false,
            icons: [
                {
                    src: path.resolve('public/icons/icon-512x512.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join('public','icons')
                }
            ]
        })
    ],
    mode: 'development'
};

module.exports = config;