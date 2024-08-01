"use strict";
const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './',
        filename: 'bundle.[contenthash].js',
        assetModuleFilename: 'assets/img/[name].[hash][ext]',
        clean: true, // Cleans the output directory before emit
    },
    optimization: {
        minimizer: [
            new CSSMinimizerPlugin(),
            new TerserPlugin({
                extractComments: true,
                terserOptions: {
                    format: {
                        comments: 'false',
                    },
                    compress: {
                        drop_console: true,
                    },
                },
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/template.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },
});
//# sourceMappingURL=webpack.prod.js.map