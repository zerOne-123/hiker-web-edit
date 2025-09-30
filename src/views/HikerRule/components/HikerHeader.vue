<script setup>
import {
  NFormItem,
  NSelect,
  NInputGroup,
  NButton,
  NSpace,
  NInput,
  useMessage,
  NPopover,
  NDynamicInput,
  NCheckbox,
  NRadioGroup,
  NRadioButton,
  NPopconfirm,
} from "naive-ui";
import axios from "axios";
import { ref, onMounted, inject } from "vue";
import { useTemplate } from "../composables";
import { default_rule } from "../../../assets/defineConst.js";
const message = useMessage();
const ip = inject("ip");
const ruleData = inject("ruleData");
const {
  templateTitle,
  allTemplateTitles,
  rmTemplateShow,
  addTemplateShow,
  addTemplatePositiveClick,
  rmTemplatePositiveClick,
  addTemplate,
  rmTemplate,
  selectTemplateTitle,
} = useTemplate(ruleData, message);
const allRuleTitles = ref([]);
const ruleTitle = ref("");
const portOptions = [
  { value: 52020 },
  { value: 52021 },
  { value: 52022 },
  { value: 52023 },
  { value: 52024 },
  { value: 52025 },
];
onMounted(() => {
  init();
});

const loading = ref(false);
const getIps = () => {
  const ips = new Set();
  for (const { ip, port } of ipList.value.filter((v) => v.isCheck)) {
    if (regIp1.test(ip)) {
      ips.add(ip + ":" + port);
    } else if (regIp2.test(ip)) {
      const pre = ip.split("[")[0];
      // console.log(RegExp.$1);
      for (let i = +RegExp.$1; i <= +RegExp.$2; i++) {
        ips.add(pre + i + ":" + port);
      }
    } else {
      for (let i = 2; i <= 254; i++) {
        ips.add(ip.replace("*", i) + ":" + port);
      }
    }
  }
  return Array.from(ips);
};
const init = async () => {
  loading.value = true;
  const isProxy = getIps().map((v) =>
    axios.get("http://" + v + "/getAllRuleTitles", { timeout: 5000 })
  );
  try {
    const res = await Promise.any(isProxy);
    ip.value = res.config.url.match(/^http:\/\/(.*?)\//)[1];
    ipArr.value.push(ip.value);
    ipArr.value = Array.from(new Set(ipArr.value));
    allRuleTitles.value = res.data.map((value) => ({
      value,
    }));
    message.success("连接成功！", { closable: true });
  } catch (e) {
    // console.log(e);
  } finally {
    loading.value = false;
  }
};
const ips = JSON.parse(localStorage.getItem("ipList")) || [];
const ipList = ref(ips);
const regIp1 =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const regIp2 =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}\[(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\-(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\]$/;
const regIp3 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}\*$/;
function handleUpdateShow(show) {
  if (!show) {
    ipList.value = ipList.value.filter(
      (value) =>
        regIp1.test(value.ip) || regIp2.test(value.ip) || regIp3.test(value.ip)
    );
    localStorage.setItem("ipList", JSON.stringify(ipList.value));
    init();
  }
}
const ipArr = ref([]);
function handleTempIp(show) {
  if (!show) {
    ipArr.value = ipArr.value.filter((v) => regIp1.test(v.split(":")[0]));
    ipArr.value = Array.from(new Set(ipArr.value));
  }
}
const selectRuleTitle = (v) => {
  axios
    .get("http://" + ip.value + "/getRuleContent?title=" + encodeURI(v), {
      timeout: 2000,
    })
    .then((res) => {
      // console.log(res);
      ruleData.value = { ...default_rule, ...res.data };
    })
    .catch((e) => {
      message.error("选择出错，请确保连接成功！");
    });
};

const reloadLoading = ref(false);
async function reload() {
  reloadLoading.value = true;
  try {
    const res = await axios.get("http://" + ip.value + "/getAllRuleTitles");
    allRuleTitles.value = res.data.map((value) => ({
      value,
    }));
    message.success("刷新成功！");
  } finally {
    reloadLoading.value = false;
  }
}
</script>

<template>
  <n-space :wrap="false">
    <n-form-item label="规则：" label-placement="left">
      <n-input-group>
        <n-select
          v-model:value="ruleTitle"
          style="width: 200px"
          :options="allRuleTitles"
          filterable
          @update:value="selectRuleTitle"
          label-field="value"
        />
        <n-button type="primary" ghost :loading="reloadLoading" @click="reload">
          刷新
        </n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item label="模板：" label-placement="left">
      <n-input-group>
        <n-select
          v-model:value="templateTitle"
          style="width: 200px"
          :options="allTemplateTitles"
          filterable
          @update:value="selectTemplateTitle"
          label-field="value"
        />
        <n-popconfirm
          :negative-text="null"
          @positive-click="addTemplatePositiveClick"
          @clickoutside="addTemplateShow = false"
          :show="addTemplateShow"
        >
          <template #trigger>
            <n-button type="primary" ghost @click="addTemplate">增加</n-button>
          </template>
          你确定要覆盖模板【{{ ruleData.title }}】吗？
        </n-popconfirm>
        <n-popconfirm
          :negative-text="null"
          @positive-click="rmTemplatePositiveClick"
          @clickoutside="rmTemplateShow = false"
          :show="rmTemplateShow"
        >
          <template #trigger>
            <n-button type="error" ghost @click="rmTemplate">删除</n-button>
          </template>
          你确定要删除模板【{{ templateTitle }}】吗？
        </n-popconfirm>
      </n-input-group>
    </n-form-item>
    <n-input-group>
      <n-popover
        trigger="click"
        title="如：192.168.249.165、192.168.249.[50-249]、192.168.249.*"
        @update:show="handleUpdateShow"
      >
        <template #trigger>
          <n-button type="primary" :loading="loading">设置 IP</n-button>
        </template>
        <n-dynamic-input
          v-model:value="ipList"
          show-sort-button
          :on-create="() => ({ isCheck: true, port: 52020 })"
        >
          <template #default="{ value }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-checkbox
                v-model:checked="value.isCheck"
                style="margin-right: 12px"
              />
              <n-input
                :status="
                  regIp1.test(value.ip) ||
                  regIp2.test(value.ip) ||
                  regIp3.test(value.ip)
                    ? 'success'
                    : 'error'
                "
                v-model:value="value.ip"
                type="text"
                placeholder="请输入 ip"
                :allow-input="(v) => !v || /^[\d\*\-\.\[\]]+$/.test(v)"
              />
              <n-select
                style="width: 123px"
                v-model:value="value.port"
                label-field="value"
                :options="portOptions"
              />
            </div>
          </template>
        </n-dynamic-input>
      </n-popover>
    </n-input-group>
    <n-input-group>
      <n-popover trigger="click" @update:show="handleTempIp">
        <template #trigger>
          <n-button>临时 IP</n-button>
        </template>
        <n-dynamic-input
          v-model:value="ipArr"
          placeholder="请输入 ip"
          :max="3"
          :on-create="() => ip"
        />
      </n-popover>
      <n-radio-group v-model:value="ip">
        <n-radio-button v-for="ip in ipArr" :key="ip" :value="ip" :label="ip" />
      </n-radio-group>
    </n-input-group>
  </n-space>
</template>

<style></style>
