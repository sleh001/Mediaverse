const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.BannerPlugin({
          banner:
          `Mediaverse (https://github.com/swift502/Sketchbook)\nBuilt on three.js (https://github.com/mrdoob/three.js) and cannon.js (https://github.com/schteppe/cannon.js)`,
        }),
    ]
});