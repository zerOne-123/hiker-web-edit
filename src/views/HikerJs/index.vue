<template>
  <n-form-item label="插件：" label-placement="left">
    <n-input-group>
      <n-select
        v-model:value="jsTitle"
        :options="allJsTitles"
        style="max-width: 200px"
        filterable
        @update:value="selectJsTitle"
        label-field="value"
      />
      <n-button type="primary" ghost :loading="reloadLoading" @click="reload">
        刷新
      </n-button>
    </n-input-group>
  </n-form-item>
  <div style="padding-right: 130px">
    <MonacoEditor v-model="jsData" :height="560" />
  </div>
  <n-space
    vertical
    style="
      overflow: auto;
      position: fixed;
      right: 26px;
      top: 94px;
      margin-right: 20px;
      align-items: center;
    "
  >
    <!-- <n-button type="primary" @click="saveJs">保存插件</n-button> -->
    <!-- <HikerShowColType /> -->
  </n-space>
</template>

<script setup>
import { ref, onMounted, onActivated, onDeactivated, inject } from 'vue';
import {
  NButton,
  useMessage,
  NSpace,
  NFormItem,
  NSelect,
  NInputGroup,
} from 'naive-ui';
// import HikerShowColType from '../components/HikerShowColType.vue';
import axios from 'axios';

const message = useMessage();
const allJsTitles = ref([]);
const jsTitle = ref('');
const jsData = ref('');
const ip = inject('ip');
onMounted(() => {
  if (!ip.value) {
    message.error('请先成功连接再使用！');
    return;
  }
  axios
    .get('http://' + ip.value + '/getAllJsTitles')
    .then((res) => {
      allJsTitles.value = res.data.map((value) => ({
        value,
      }));
      message.success('连接成功！');
    })
    .catch((error) => {
      message.error('请先成功连接再使用！');
    });
});

const selectJsTitle = async (v) => {
  const res = await (
    await fetch('http://' + ip.value + '/getJsContent?name=' + v)
  ).text();
  jsData.value = res;
};

const saveJs = () => {
  const data = { name: jsTitle.value, content: jsData.value };
  axios
    .post('http://' + ip.value + '/saveJs', JSON.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then((res) => {
      if (res.data.isSuccess) {
        message.success('保存成功！');
      } else {
        message.error('保存插件失败' + res.data.errorMsg);
      }
    })
    .catch((error) => {
      message.error('连接失败，请重新连接');
    });
};
const handleKeyOfSave = (e) => {
  if (/[s|S]/.test(e.key) && e.ctrlKey) {
    saveJs();
    e.preventDefault();
  }
};
onActivated((_) => {
  // console.log('激活js');
  document.addEventListener('keydown', handleKeyOfSave);
});
onDeactivated((_) => {
  // console.log('取消监听');
  document.removeEventListener('keydown', handleKeyOfSave);
});
const reloadLoading = ref(false);
async function reload() {
  reloadLoading.value = true;
  try {
    const res = await axios.get('http://' + ip.value + '/getAllJsTitles');
    allJsTitles.value = res.data.map((value) => ({
      value,
    }));
    message.success('刷新成功！');
  } finally {
    reloadLoading.value = false;
  }
}
</script>
