<template>
  <n-form
    label-placement="left"
    label-width="auto"
    require-mark-placement="left"
  >
  <n-form-item label="频道链接：">
    <n-input
      v-model:value="ruleData.url"
      placeholder="频道链接（可不填，可只填搜索相关内容）"
      type="textarea"
      :autosize="{
        maxRows: 5
      }"
    />
  </n-form-item>
  <n-form-item label="显示样式：">
    <n-cascader
      v-model:value="ruleData.col_type"
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
  <n-form-item label="解析规则：（列表;标题;图片;描述;链接）" label-placement="top" >
    <MonacoEditor v-model="ruleData.find_rule" />
  </n-form-item>
  <n-form-item label="二级样式：">
    <n-cascader
      v-model:value="ruleData.detail_col_type"
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
  <n-form-item label="二级解析：（列表;标题;图片;描述;链接）" label-placement="top" >
    <MonacoEditor v-model="ruleData.detail_find_rule" />
  </n-form-item>
</n-form>
</template>

<script setup>
  import { col_type } from '../../../assets/defineConst.js'
  import { NForm, NFormItem, NCascader, NInput } from 'naive-ui'
  defineProps(['ruleData'])
</script>
