const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
// const WebpackManifestPlugin = require('webpack-manifest-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

//const CURRENT_WORKING_DIR = process.cwd()

module.exports = {
    mode: "development",
    entry: [ path.join(__dirname , './server/server.js') ],
    target: "node",
    devtool: "cheap-module-eval-source-map",
    output: {
        path: path.join(__dirname, '/build/'),
        filename: "server.js",
        publicPath: '/build/',
        libraryTarget: "commonjs2"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css'
        })
    ],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env", 
                                {
                                    "targets": {
                                        "node": "current"
                                    }
                                }
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    { loader: 'postcss-loader', 
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')({
                                        overrideBrowserslist: ['last 3 versions', 'ie >9']
                                    })
                                ]
                            }
                        }
                    }
                ],
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    { loader: 'css-loader', options: { importLoaders: 1 } }, 
                    { loader: 'postcss-loader', 
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')({
                                        overrideBrowserslist: ['last 3 versions', 'ie >9']
                                    })
                                ]
                            }
                        }
                    }, 
                    'sass-loader'
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:7].[ext]'
                        },
                    },
                    { loader: 'image-webpack-loader' }
                ],
            }  
        ]
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    resolve: {
        alias: {
            CssFolder: path.resolve(__dirname, 'src/stylesheets/')
        }
    }
}