import { defineConfig } from '@rsbuild/core'
import { pluginVue } from '@rsbuild/plugin-vue'
import AutoImport from 'unplugin-auto-import/rspack'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/rspack'
import { version } from './package.json' with { type: 'json' }
import RspackVueRouterPlugin from './vue-router-rspack'

const APP_TITLE = '门诊管理系统'

export default defineConfig({
  plugins: [
    pluginVue(),
  ],
  source: {
    define: {
      APP_TITLE: JSON.stringify(APP_TITLE),
      APP_VERSION: JSON.stringify(version),
    },
  },
  server: {
    port: 3333,
  },
  html: {
    favicon: './src/assets/icon/app-icon.png',
    title: APP_TITLE,
  },
  performance: {
    buildCache: false,
  },
  tools: {
    rspack: {
      plugins: [new RspackVueRouterPlugin(), AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
            ],
          },
        ],
      }), Components({
        resolvers: [NaiveUiResolver()],
      })],
    },
  },
})
