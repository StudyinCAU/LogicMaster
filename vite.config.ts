import { defineConfig } from 'vite';
import { resolve } from 'pathe';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import VueI18n from '@intlify/vite-plugin-vue-i18n';
import Components from 'unplugin-vue-components/vite';
import PurgeIcons from 'vite-plugin-purge-icons';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/LogicMaster/',  // 添加这一行，设置为你的仓库名称
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    svgLoader(),
    Components({
      extensions: ['vue'],
      dts: 'src/components.d.ts',
    }),
    WindiCSS(),
    PurgeIcons(),
    VueI18n({
      include: [resolve(__dirname, './locales/**')],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        '/LogicMaster/icons/android-chrome-192x192.png',
        '/LogicMaster/icons/android-chrome-512x512.png',
        '/LogicMaster/icons/apple-touch-icon.png',
        '/LogicMaster/icons/apple-touch-icon-precomposed.png',
        '/LogicMaster/icons/browserconfig.xml',
        '/LogicMaster/icons/favicon.ico',
        '/LogicMaster/icons/favicon-16x16.png',
        '/LogicMaster/icons/favicon-32x32.png',
        '/LogicMaster/icons/mstile-70x70.png',
        '/LogicMaster/icons/mstile-144x144.png',
        '/LogicMaster/icons/mstile-150x150.png',
        '/LogicMaster/icons/mstile-310x150.png',
        '/LogicMaster/icons/mstile-310x310.png',
        '/LogicMaster/icons/safari-pinned-tab.svg',
      ],
      manifest: {
        name: 'Truth Table Generator',
        short_name: 'Truth Table',
        description: '根据逻辑表达式自动生成真值表',
        icons: [
          {
            src: '/LogicMaster/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/LogicMaster/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#ddd6fe',
        start_url: '/LogicMaster/',
        background_color: '#f5f3ff',
        display: 'standalone',
      },
    }),    
  ],

  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
});
