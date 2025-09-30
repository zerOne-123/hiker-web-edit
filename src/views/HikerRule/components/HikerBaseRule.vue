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
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="分类名称：">
      <n-input
        v-model:value="ruleData.class_name"
        placeholder="分类名称（class_name）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="分类替换：">
      <n-input
        v-model:value="ruleData.class_url"
        placeholder="分类替换词（class_url）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="地区名称：">
      <n-input
        v-model:value="ruleData.area_name"
        placeholder="地区名称（area_name）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="地区替换：">
      <n-input
        v-model:value="ruleData.area_url"
        placeholder="地区替换词（area_url）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="年代名称：">
      <n-input
        v-model:value="ruleData.year_name"
        placeholder="年代名称（year_name）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="年代替换：">
      <n-input
        v-model:value="ruleData.year_url"
        placeholder="年代替换词（year_url）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="排序名称：">
      <n-input
        v-model:value="ruleData.sort_name"
        placeholder="排序名称（sort_name）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
    <n-form-item label="排序替换：">
      <n-input
        v-model:value="ruleData.sort_url"
        placeholder="排序替换（sort_url）"
        type="textarea"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
    </n-form-item>
  </n-form>
</template>

<script setup>
import { NForm, NFormItem, NInput } from 'naive-ui';
defineProps(['ruleData']);
</script>
