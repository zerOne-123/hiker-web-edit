<template>
  <n-form
    label-placement="left"
    label-width="auto"
    require-mark-placement="left"
  >
    <n-form-item label="搜索链接：">
      <n-input
        v-model:value="ruleData.search_url"
        placeholder="搜索链接（search_url，用**作为占位符，支持/开头不写域名）"
        type="textarea"
        :autosize="{
          maxRows: 5
        }"
      />
    </n-form-item>
    <n-form-item label="搜索解析：（列表;标题;链接;描述;详情;图片）" label-placement="top" >
      <MonacoEditor v-model="ruleData.searchFind" />
    </n-form-item>
    <n-form-item label="搜二样式：">
      <n-cascader
        v-model:value="ruleData.sdetail_col_type"
        expand-trigger="hover"
        :options="col_type"
        check-strategy="child"
        :cascade="false"
        :show-path="false"
        :filterable="true"
        style="max-width: 260px;"
        label-field="value"
      />
    </n-form-item>
    <n-form-item label="搜二解析：（列表;标题;图片;描述;链接）" label-placement="top" >
      <MonacoEditor v-model="ruleData.sdetail_find_rule" />
    </n-form-item>
    </n-form>
</template>

<script setup>
  import { col_type } from '../../../assets/defineConst.js'
  import {NForm, NFormItem, NCascader, NInput } from 'naive-ui'
  defineProps(['ruleData'])
</script>