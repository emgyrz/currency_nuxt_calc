<template lang="pug">
input(v-model="valueStr" @change="handleChange")
</template>

<script lang="ts">
import { Ref } from "vue";

export default {
  props: ['isFloat', 'value'],
  emits: ['change'],

  setup(props, { emit }) {
    const valueStr = ref('')

    function handleChange() {
      clearValue(valueStr)
      if (props.value === null) {
        valueStr.value = ''
      }
    }

    watchEffect(() => {
      const v = parseValue(valueStr.value, props.isFloat)
      if (v !== props.value) emit('change', v)
    })

    watch(() => props.value, (val) => {
      valueStr.value = val === null ? '' : val.toString()
    })

    return { valueStr, handleChange }
  },
}

function clearValue(strRef: Ref<string>) {
  const val = strRef.value
  const clearedVal = val.replace(/[^\d.]+/g, "")
  if (clearedVal !== val) { strRef.value = clearedVal }
}

function parseValue(str: string, isFloat?: boolean): null | number {
  const n = isFloat === true
      ? parseFloat(str.replace(',', '.'))
      : parseInt(str)
  return Number.isFinite(n) ? n : null
}
</script>
