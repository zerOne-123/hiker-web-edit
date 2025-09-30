<template>
  <n-tabs
    v-model:value="activeKey"
    type="card"
    :addable="true"
    :closable="true"
    @close="close"
    @add="add"
    tab-style="min-width: 80px;"
  >
    <n-tab-pane v-for="(page,index) in ruleData.pageList" :key="page.name" :name.number="index" :tab='page.name' :closable="activeKey===index">
      <n-form-item label="子页面名称：" label-placement="left">
        <n-input placeholder="子页面名称（name）" v-model:value="page.name" />
      </n-form-item>
      <n-form-item label="子页面标识：" label-placement="left">
        <!-- <n-input placeholder="子页面标识：" v-model:value="page.path" /> -->
        <n-input-group>
          <n-input-group-label>hiker://page/</n-input-group-label>
          <n-input placeholder="子页面标识(path，如：detal.html)" v-model:value="page.path"/>
        </n-input-group>
      </n-form-item>
      <n-form-item label="显 示 样 式：" label-placement="left" >
        <n-cascader
          v-model:value="page.col_type"
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
      <n-form-item label="解 析 规 则：（列表;标题;图片;描述;链接）" label-placement="top" >
        <MonacoEditor v-model="page.rule" />
      </n-form-item>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>

  
  import { nextTick, ref } from 'vue'
  import { col_type } from '../../../assets/defineConst.js'
  import { useDialog, useMessage, NTabs, NTabPane, NFormItem,NCascader, NInput, NInputGroup, NInputGroupLabel } from 'naive-ui'
  const message = useMessage()
  const dialog = useDialog()

  const props = defineProps(['ruleData'])

  const activeKey = ref(0);

  const add = () => {
    let name = '新页面'
    if(props.ruleData?.pageList) {
       for (const page of props.ruleData.pageList) {
        if(page.name === name){
          message.error('请勿重复创建相同子页面')
          return
        }
      }
      props.ruleData.pageList.push({ name, col_type: 'movie_3'});
      nextTick(_ => {
        activeKey.value = props.ruleData.pageList.length-1
      })
    }
  };

  const close = (targetKey) => {
    // console.log(targetKey);
    const name = props.ruleData.pageList[targetKey].name;
    dialog.warning({
      title: '警告',
      content: `你确定要删除【${name}】子页面？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        props.ruleData.pageList.splice(targetKey, 1);
        if(!props.ruleData.pageList.length) {
          activeKey.value = 0
        } else if(targetKey === props.ruleData.pageList.length) {
          activeKey.value = props.ruleData.pageList.length - 1
        }
      }
    })
  };
</script>
