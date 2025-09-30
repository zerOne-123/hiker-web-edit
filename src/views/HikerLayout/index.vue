<script setup>
import { RouterView } from 'vue-router';
import LayoutMenu from './components/LayoutMenu.vue';
import { NLayout, NLayoutSider, NMessageProvider, NConfigProvider, zhCN } from 'naive-ui';
import { provide, ref } from 'vue';
provide('ip', ref(''));
provide('ruleData', ref({}));
</script>

<template>
  <div style="height: 100vh">
    <n-layout position="absolute" has-sider>
      <n-layout-sider bordered :width="135">
        <LayoutMenu />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <n-config-provider :locale="zhCN">
          <n-message-provider placement="top-right">
            <n-dialog-provider>
              <router-view v-slot="{ Component }">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </router-view>
            </n-dialog-provider>
          </n-message-provider>
        </n-config-provider>
      </n-layout>
    </n-layout>
  </div>
</template>
