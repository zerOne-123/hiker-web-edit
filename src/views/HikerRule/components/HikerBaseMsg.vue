<template>
  <n-form
    label-placement="left"
    label-width="auto"
    require-mark-placement="left"
  >
    <n-form-item label="小程序名称：" >
      <n-input placeholder="小程序名称（title）" v-model:value="ruleData.title" />
    </n-form-item>
    <n-form-item label="小程序类别：">
      <n-select v-model:value="ruleData.type" :options="typeOptions" />
    </n-form-item>
    <n-form-item label="小程序作者：">
      <n-input placeholder="小程序作者（author）" v-model:value="ruleData.author" />
    </n-form-item>
    <n-form-item label="小程序版本：">
      <n-input-number placeholder="小程序版本（version）" v-model:value="ruleData.version" :min="0" style="width: 260px;"/>
    </n-form-item>
    <n-form-item label="小程序分组：">
      <n-input placeholder="小程序分组（名称前加①、②等序号可排序）" v-model:value="ruleData.group" />
    </n-form-item>
    <n-form-item label="图标地址：">
      <n-input placeholder="小程序图标地址（支持色值）" v-model:value="ruleData.icon" />
    </n-form-item>
    <n-form-item label="全局 UA：">
      <n-select v-model:value="ruleData.ua" :options="uaOptions" :render-option="renderOption" label-field="value" style="width: 260px;"/>
    </n-form-item>
    <n-form-item label="请求代理：">
      <n-input
        v-model:value="ruleData.proxy"
        placeholder="网络请求代理（一行一个，替换词=>代理）"
        type="textarea"
        :autosize="{ maxRows: 5 }"
      />
    </n-form-item>
    <n-form-item label=" JS 预 处 理：（在解析规则和搜索解析规则执行前执行）" label-placement="top" >
      <MonacoEditor v-model="ruleData.preRule" />
    </n-form-item>
    <n-form-item label="最 新 章 节：（解析规则)" label-placement="top" >
      <MonacoEditor v-model="ruleData.last_chapter_rule" />
    </n-form-item>
  </n-form>
</template>

<script setup>
  import { h } from "vue";
  import { NForm, NTooltip, NFormItem, NInput, NInputNumber, NSelect } from "naive-ui";
  defineProps(['ruleData'])

  const typeOptions = [
    {
      value: 'all',
      label: '聚合'
    },{
      value: 'video',
      label: '视频'
    },{
      value: 'music',
      label: '音频'
    },{
      value: 'live',
      label: '直播'
    },{
      value: 'cartoon',
      label: '漫画'
    },{
      value: 'read',
      label: '阅读'
    },{
      value: 'picture',
      label: '图集'
    },{
      value: 'news',
      label: '资讯'
    },{
      value: 'tool',
      label: '工具'
    },{
      value: 'other',
      label: '其他'
    }
  ]
  const renderOption = ({ node, option }) => h(NTooltip, null, {
      trigger: () => node,
      default: () => option.tip
    })
  const uaOptions = [
    {
      value: "auto",
      tip: "自动提取（不建议使用）"
    },
    {
      value: "mobile",
      tip: "移动端（mobile、Android）"
    },
    {
      value: "pc",
      tip: "电脑端（pc、Windows）"
    },
  ]
</script>