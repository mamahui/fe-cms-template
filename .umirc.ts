import moment from 'moment';
import { defineConfig } from 'umi';
import Dotenv from 'dotenv-webpack';
const CompressionPlugin = require('compression-webpack-plugin');
import theme from './theme.config';
import { resolve } from 'path';

function prefixEnv(define) {
  const PREFIX = 'process.env.';
  return Object.keys(define).reduce((obj, key) => {
    obj[`${PREFIX}${key}`] = define[key];
    return obj;
  }, {});
}

const { PUBLIC_PATH, DEPLOY_ENV } = process.env;
const development = process.env.NODE_ENV !== 'production';
const publicPath = development ? '/' : PUBLIC_PATH;
const DEFAULT_ENV = 'dev';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  define: prefixEnv({
    APP_CODE: 'CONTENT_PLATFORM',
    PUBLIC_PATH: publicPath,
    DEPLOY_ENV,
    APP_VERSION: moment().valueOf(),
  }),
  title: '管理后台',
  fastRefresh: {},
  dynamicImport: {
    loading: '@/Loading',
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/cloud/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/cloud/' : '/',
  outputPath: process.env.NODE_ENV === 'production' ? 'cloud' : 'dist',
  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
        {
          deleteOriginalAssets: false,
          algorithm: 'gzip',
          test: /\.js(\?.*)?$/i,
        },
      ]);
    }
    config
      .plugin('dot-env')
      .use(Dotenv, [{ path: `./.env.${DEPLOY_ENV || DEFAULT_ENV}` }]);
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@suze',
        libraryDirectory: 'es',
        style: true,
      },
      'suze',
    ]
  ],
  hash: true,
  history: { type: 'browser' },
  theme: theme(),
  alias: {
    '@': resolve(__dirname, './src'),
  },
  targets: {
    chrome: 80, // -180K
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
  terserOptions: {
    compress: { ecma: 6 },
    mangle: { safari10: false },
    output: {
      ecma: 6,
      ascii_only: false, // -140K 中文不做转换
    },
  },
});
