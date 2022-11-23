const path = require("path");
const webpack = require("webpack");

module.exports = [
    {
        entry: "./src/main.js",
        output: {
            path: path.resolve(__dirname, "./static/volunteercenter"),
            filename: "main.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
            ],
        },
        optimization: {
            minimize: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify("production"),
            }),
        ],
    },
    {
        entry: "./src/callhandler/callhandler.js",
        output: {
            path: path.resolve(__dirname, "./static/volunteercenter"),
            filename: "callhandler.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
            ],
        },
        optimization: {
            minimize: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify("production"),
            }),
        ],
    },
    {
        entry: "./src/client/client.js",
        output: {
            path: path.resolve(__dirname, "./static/volunteercenter"),
            filename: "client.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
            ],
        },
        optimization: {
            minimize: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify("production"),
            }),
        ],
    },
    {
        entry: "./src/operator/operator.js",
        output: {
            path: path.resolve(__dirname, "./static/volunteercenter"),
            filename: "operator.js",
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                    },
                },
            ],
        },
        optimization: {
            minimize: true,
        },
        plugins: [
            new webpack.DefinePlugin({
                // This has effect on the react lib size
                NODE_ENV: JSON.stringify("production"),
            }),
        ],
    },
];
