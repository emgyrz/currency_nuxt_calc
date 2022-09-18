<template lang="pug">
.input-with-select
  label {{ label }}
  div
    NumberInput(:isFloat="true" :value="currency.amount" @change="(am) => $emit('update:amount', am)")
    select(:value="currency.code" @input="(ev) => $emit('update:code', ev.target.value)")
      option(v-for="baseCurr in currenciesList" :key="baseCurr" :value="baseCurr") {{ baseCurr }}
</template>

<script lang="ts">
import NumberInput from './numberInput.vue'
export default {
  emits: ['update:code', 'update:amount'],
  props: ['currency', 'currenciesList', 'label'],
  components: { NumberInput },
}
</script>
