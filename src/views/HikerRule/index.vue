<script setup>
import {
  NButton,
  NCard,
  NTabs,
  NTabPane,
  NSpace,
  NAffix,
  useMessage,
  useDialog,
  NDropdown,
  NModal,
  NInput,
} from 'naive-ui';
import axios from 'axios';
import HikerHeader from './components/HikerHeader.vue';
import HikerBaseMsg from './components/HikerBaseMsg.vue';
import HikerBaseRule from './components/HikerBaseRule.vue';
import HikerBaseParse from './components/HikerBaseParse.vue';
import HikerSearchParse from './components/HikerSearchParse.vue';
import HikerChildPage from './components/HikerChildPage.vue';
import { onActivated, inject, onDeactivated, toRaw } from 'vue';
import { useImport, useExport } from './composables';
import { default_rule } from '../../assets/defineConst.js';

const ruleData = inject('ruleData');
ruleData.value = structuredClone(default_rule);
const message = useMessage();
const { showImportModal, importText, onImportPositiveClick, dropHandler, dragOverHandler, onImportAfterLeaver } =
  useImport(ruleData, message);
const { exportOptions, handleSelectExport } = useExport(ruleData, message);
const ip = inject('ip');

const dialog = useDialog();

const clearForm = () => {
  dialog.warning({
    title: '警告',
    content: '你确定要清空表单吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      ruleData.value = structuredClone(default_rule);
    },
    onNegativeClick: () => {},
  });
};
const saveRule = () => {
  ruleData.value.pages = JSON.stringify(ruleData.value.pageList);
  axios
    .post('http://' + ip.value + '/saveRule', JSON.stringify(toRaw(ruleData.value)), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => {
      if (res.data.isSuccess) {
        message.success('保存成功！');
      } else {
        message.error('保存规则失败' + res.data.errorMsg);
      }
    })
    .catch((error) => {
      message.error('连接失败，请重新连接');
    });
};
const handleKeyOfSave = (e) => {
  if (e.keyCode === 83 && e.ctrlKey) {
    console.log('保存' + e.key);
    saveRule();
    e.preventDefault();
  }
};
onActivated(() => {
  document.addEventListener('keydown', handleKeyOfSave);
});
onDeactivated(() => {
  document.removeEventListener('keydown', handleKeyOfSave);
});
</script>

<template>
  <HikerHeader />
  <n-card style="padding-right: 100px">
    <n-affix :top="120" :trigger-top="60">
      <n-tabs>
        <n-tab-pane name="基础信息" tab="基础信息" display-directive="show:lazy">
          <HikerBaseMsg :ruleData="ruleData" />
        </n-tab-pane>
        <n-tab-pane name="基础规则" tab="基础规则" display-directive="show:lazy">
          <HikerBaseRule :ruleData="ruleData" />
        </n-tab-pane>
        <n-tab-pane name="基础解析" tab="基础解析" display-directive="show:lazy">
          <HikerBaseParse :ruleData="ruleData" />
        </n-tab-pane>
        <n-tab-pane name="搜索解析" tab="搜索解析" display-directive="show:lazy">
          <HikerSearchParse :ruleData="ruleData" />
        </n-tab-pane>
        <n-tab-pane name="子页面" tab="子页面" display-directive="show:lazy">
          <HikerChildPage :ruleData="ruleData" />
        </n-tab-pane>
      </n-tabs>
    </n-affix>
  </n-card>
  <n-space
    vertical
    style="overflow: auto; position: fixed; right: 26px; top: 94px; margin-right: 20px; align-items: center"
  >
    <!-- <n-button type="primary" @click="saveRule">保存规则</n-button> -->
    <n-button type="info" @click="showImportModal = true">口令导入</n-button>
    <n-dropdown trigger="hover" :options="exportOptions" @select="handleSelectExport">
      <n-button>分享规则</n-button>
    </n-dropdown>
    <n-button type="error" @click="clearForm">清空表单</n-button>
    <!-- <HikerShowColType /> -->
  </n-space>
  <n-modal
    v-model:show="showImportModal"
    :mask-closable="true"
    preset="dialog"
    title="剪切板口令导入"
    content="你确认"
    positive-text="确认"
    negative-text="算了"
    @positive-click="onImportPositiveClick"
    @after-leave="onImportAfterLeaver"
  >
    <n-input
      v-model:value="importText"
      type="textarea"
      :autosize="{
        minRows: 16,
        maxRows: 16,
      }"
      placeholder="支持云剪切板口令和海阔视界表示开头的口令，还可以直接拖入 .txt 或 .hiker 规则文件"
      @drop="dropHandler"
      @dragover="dragOverHandler"
    />
  </n-modal>
</template>

<style>
.n-form-item-feedback-wrapper {
  min-height: 10px !important;
}
</style>
