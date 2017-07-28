'use strict';

var config = require('config');
var api_prefix = config.get('webApiPrefix');
var redirect_uri = config.get('redirect_uri');
var path_prefix = require('config').get('pathPrefix');

var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToJQuery = path.resolve(node_modules, 'jquery/dist/jquery.min.js');
var pathToBootstarp = path.resolve(node_modules, 'bootstrap/dist/');
var domain = require('config').get('domain');
let FaviconsWebpackPlugin = require('favicons-webpack-plugin');

var config = {
  entry: {
    "group": './source/scripts/group.jsx',
    "paper-list": './source/scripts/paper-list.jsx',
    "basic-quiz": './source/scripts/basic-quiz.jsx',
    "quiz": './source/scripts/quiz.jsx',
    "deadline": './source/scripts/deadline.jsx',
    "style-guide": './source/scripts/style-guide.jsx',
    "404": "./source/scripts/404.js",
    "index": "./source/scripts/index.jsx",
    "logic-puzzle": "./source/scripts/logic-puzzle.jsx",
    "homework": "./source/scripts/homework.jsx",
    "register": "./source/scripts/register.jsx",
    "start": "./source/scripts/start.jsx",
    "user-center": './source/scripts/user-center.jsx',
    "dashboard": './source/scripts/dashboard.jsx',
    "password-retrieve": './source/scripts/password-retrieve.jsx',
    "password-reset": './source/scripts/password-reset.jsx',
    "homework-details": './source/scripts/homework-details.jsx',
    "paper-assignment": './source/scripts/paper-assignment.jsx',
    "admin": './source/scripts/admin.jsx',
    "qa-page": './source/scripts/qa-page.jsx',
    "index-2016-summer": './source/scripts/index-2016-summer.jsx',
    "weChat-loading": './source/scripts/weChat-loading.jsx',
    "che": './source/scripts/che.jsx',
    "thridParty-userDetail": './source/scripts/thridParty-userDetail.jsx',
    "reminder": './source/scripts/reminder.jsx',
    "get-invitation-code": './source/scripts/get-invitation-code.jsx',
    "vendors": ['jquery', 'bootstrap.css', 'font-awesome', 'react', 'react-dom', 'bootstrap.js']
  },
  output: {
    path: __dirname + '/public/assets/',
    filename: '[chunkhash:8].[name].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: path.join(node_modules, 'jquery/dist/jquery.min.js'),
        loader: 'expose?jQuery'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=10000&name=build/[name].[ext]'
      }
    ],
    noParse: [pathToJQuery, pathToBootstarp]
  },
  plugins: [
    new FaviconsWebpackPlugin('./source/images/site_logo.png'),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      React: 'react',
      ReactDom: 'react-dom',
      ReactDOM: 'react-dom'
    }),
    new webpack.DefinePlugin({
      API_PREFIX: JSON.stringify(api_prefix),
      REDIRECT_URL : JSON.stringify(redirect_uri),
      DOMAIN: JSON.stringify(domain),
      STUDENT_URI_PREFIX: JSON.stringify(path_prefix),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new ExtractTextPlugin("[chunkhash:8].[name].css"),
    new webpack.optimize.CommonsChunkPlugin('vendors', '[chunkhash:8].vendors.js'),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   except: ['$super', '$', 'exports', 'require']
    // })
  ],
  resolve: {
    alias: {
      'jquery': 'jquery/dist/jquery.min.js',
      'bootstrap.css': 'bootstrap/dist/css/bootstrap.min.css',
      'font-awesome': 'font-awesome/css/font-awesome.min.css',
      'bootstrap.js': 'bootstrap/dist/js/bootstrap.min.js',
      'ie': 'component-ie'
    }
  }
};

function htmlwebpackPluginBuilder(fileName, deps) {
  return new HtmlwebpackPlugin({
    filename: fileName,
    minify: {collapseWhitespace: true},
    template: __dirname + '/source/' + fileName,
    inject: true,
    chunks: deps
  })
}

(function webpackByEnv() {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        })
    );
  } else {
    config.devtool = '#cheap-source-map';
  }
})();

config.plugins.push(htmlwebpackPluginBuilder('index.html', ['index.css', 'vendors', 'index']));
config.plugins.push(htmlwebpackPluginBuilder('index-00.html', ['index.css']));
config.plugins.push(htmlwebpackPluginBuilder('register.html', ['register.css', 'vendors', 'register']));
config.plugins.push(htmlwebpackPluginBuilder('user-center.html', ['user-center.css', 'vendors', 'user-center']));
config.plugins.push(htmlwebpackPluginBuilder('user-center.html', ['user-center.css', 'vendors', 'user-center']));
config.plugins.push(htmlwebpackPluginBuilder('start.html', ['start.css', 'vendors', 'start']));
config.plugins.push(htmlwebpackPluginBuilder('password-retrieve.html', ['password-retrieve.css', 'vendors', 'password-retrieve']));
config.plugins.push(htmlwebpackPluginBuilder('password-reset.html', ['password-reset.css', 'vendors', 'password-reset']));
config.plugins.push(htmlwebpackPluginBuilder('logic-puzzle.html', ['logic-puzzle.css', 'vendors', 'logic-puzzle']));
config.plugins.push(htmlwebpackPluginBuilder('homework-details.html', ['homework-details.css', 'vendors', 'homework-details']));
config.plugins.push(htmlwebpackPluginBuilder('homework.html', ['homework.css', 'vendors', 'homework']));
config.plugins.push(htmlwebpackPluginBuilder('dashboard.html', ['dashboard.css', 'vendors', 'dashboard']));
config.plugins.push(htmlwebpackPluginBuilder('404.html', ['404.css', 'vendors', '404']));
config.plugins.push(htmlwebpackPluginBuilder('deadline.html', ['deadline.css', 'vendors', 'deadline']));
config.plugins.push(htmlwebpackPluginBuilder('style-guide.html', ['style-guide.css', 'vendors', 'style-guide']));
config.plugins.push(htmlwebpackPluginBuilder('group.html', ['group.css', 'vendors', 'group']));
config.plugins.push(htmlwebpackPluginBuilder('qa-page.html', ['qa-page.css', 'vendors', 'qa-page']));
config.plugins.push(htmlwebpackPluginBuilder('paper-assignment.html', ['paper-assignment.css', 'vendors', 'paper-assignment']));
config.plugins.push(htmlwebpackPluginBuilder('admin.html', ['admin.css', 'vendors', 'admin']));
config.plugins.push(htmlwebpackPluginBuilder('403.html', ['vendors']));
config.plugins.push(htmlwebpackPluginBuilder('index-2016-summer.html', ['index-2016-summer.css', 'vendors', 'index-2016-summer']));
config.plugins.push(htmlwebpackPluginBuilder('paper-list.html', ['paper-list.css', 'vendors', 'paper-list']));
config.plugins.push(htmlwebpackPluginBuilder('quiz.html', ['quiz.css', 'vendors', 'quiz']));
config.plugins.push(htmlwebpackPluginBuilder('basic-quiz.html', ['vendors', 'basic-quiz']));
config.plugins.push(htmlwebpackPluginBuilder('weChat-loading.html', ['vendors', 'weChat-loading']));
config.plugins.push(htmlwebpackPluginBuilder('thridParty-userDetail.html', ['vendors', 'thridParty-userDetail']));
config.plugins.push(htmlwebpackPluginBuilder('che.html', ['index.css', 'vendors', 'che']));
config.plugins.push(htmlwebpackPluginBuilder('reminder.html', ['index.css', 'vendors', 'reminder']));
config.plugins.push(htmlwebpackPluginBuilder('get-invitation-code.html', ['get-invitation-code.css', 'vendors', 'get-invitation-code']));

module.exports = config;
