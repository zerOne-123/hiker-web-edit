<template>
  <n-menu default-value="rule" :options="menuOptions" />
</template>

<script setup>
import { h } from 'vue';
import { NMenu } from 'naive-ui';
import { RouterLink } from 'vue-router';
const menuMap = [
  {
    name: 'rule',
    title: '编辑规则',
  },
  {
    name: 'js',
    title: '编辑插件',
  },
];

const menuOptions = menuMap.map((v) => ({
  label: () =>
    h(
      RouterLink,
      {
        to: {
          name: v.name,
        },
      },
      { default: () => v.title }
    ),
  key: v.name,
}));
</script>
