const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  context: path.resolve(__dirname), // Sets the context to the directory where webpack.config.js is
  output: {
    uniqueName: "customModule",
    publicPath: 'auto',
  },
  optimization: {
    minimize: true,
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      // ... other rules ...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets',
      noErrorOnMissing: true,
      globOptions: {
      ignore: [
              "**/.gitkeep", // Make sure this matches exactly the files you want to exclude
              "**/.*" // This pattern excludes all hidden files
            ] } } // Adjust the paths as needed
      ]
    }),
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        name: "customModule",
        filename: "remoteEntry.js",
        exposes: {
            './custom-module': './src/bootstrap.ts',
        },

        // For hosts (please adjust)
        // remotes: {
        //     "mfe1": "http://localhost:3000/remoteEntry.js",

        // },

      shared: share({
        "@angular/core": { requiredVersion: "auto" },
        "@angular/common": { requiredVersion: "auto" },
        "@angular/router": { requiredVersion: "auto" },
        "rxjs": { requiredVersion: "auto" },
        "@angular/common/http": { requiredVersion: "auto" },
        '@ngx-translate/core': { singleton: true},
        '@angular/material': { singleton: true, requiredVersion: "auto" },
        '@ngrx/store': { singleton: true},
        ...sharedMappings.getDescriptors()
      })

    }),
    sharedMappings.getPlugin()
  ],
};
