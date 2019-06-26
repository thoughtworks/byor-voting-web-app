const webpack = require('webpack');
const npmPackageVersion = require('./package.json').version;

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __BACKEND_SERVICE_URL__: JSON.stringify(process.env.BACKEND_SERVICE_URL),
      __RADAR_SERVICE_URL__: JSON.stringify(process.env.RADAR_SERVICE_URL),
      __NPM_PACKAGE_VERSION__: JSON.stringify(npmPackageVersion)
    })
  ]
};
