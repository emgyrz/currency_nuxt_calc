<template lang="pug">
section
  div.card(v-if="isPairsFetched && isCodesFilled")
    h2.title Exchange {{ baseCurrency.code }} to {{ quoteCurrency.code }}

    CurrencyInput(
      label="You Pay" :currency="baseCurrency" :codesList="baseCurrenciesCodes"
      @update:amount="handleBaseCurrencyAmountChange" @update:code="handleBaseCurrencyCodeChange"
    )

    CurrencyInput(
      label="You Got" :currency="quoteCurrency" :codesList="quoteCurrenciesCodes"
      @update:amount="handleQuoteCurrencyAmountChange" @update:code="handleQuoteCurrencyCodeChange"
    )

    button(@click="useRouter().push('/success')" :disabled="!isNumsFilled") Exchange
</template>

<script lang="ts">
import {convertCurrenciesPairsResp, convertCurrenciesRatesResp} from "~/utils/convertCurrenciesResp";
import {IntervalFetcher} from "~/utils/IntervalFetcher";
import CurrencyInput from "~/components/currencyInput.vue";

export default {
  data() {
    return {
      baseCurrency: { code: null, amount: null },
      quoteCurrency: { code: null, amount: null },
      isPairsFetched: false,
      rates: {},
    }
  },

  mounted() {
    this.pairs = {}
    $fetch('/api/currency/pairs')
        .then((pairs) => {
          this.pairs = convertCurrenciesPairsResp(pairs)
          this.handleBaseCurrencyCodeChange(this.baseCurrenciesCodes[0] ?? null)
          this.isPairsFetched = true
        })

    this.intervalRatesFetcher = new IntervalFetcher(
        '/api/currency/rates', (rates) => {
          this.rates = convertCurrenciesRatesResp(rates)
          this.calcQuoteCurrencyAmount()
        }, 30000
    )
  },

  unmounted() {
    this.intervalRatesFetcher.destroy()
  },

  computed: {
    baseCurrenciesCodes() { return Object.keys(this.pairs) },
    quoteCurrenciesCodes() { return Object.keys(this.pairs[this.baseCurrency.code] ?? {}) },
    isNumsFilled() { return this.baseCurrency.amount !== null && this.quoteCurrency.amount !== null },
    isCodesFilled() { return this.baseCurrency.code !== null && this.quoteCurrency.code !== null },
    isFactorsFilled() { return this.currentRate !== null && this.currentCommission !== null },
    currentRate(): null | number {
      if (!this.isCodesFilled) return null
      return this.rates[`${this.baseCurrency.code}/${this.quoteCurrency.code}`] ?? null
    },
    currentCommission(): null | number {
      if (!this.isCodesFilled) return null
      return this.pairs[this.baseCurrency.code][this.quoteCurrency.code] ?? null
    },
  },


  methods: {
    handleBaseCurrencyAmountChange(am) {
      this.baseCurrency.amount = am
      this.calcQuoteCurrencyAmount()
    },
    handleQuoteCurrencyAmountChange(am) {
      this.quoteCurrency.amount = am
      this.calcBaseCurrencyAmount()
    },
    ///
    handleBaseCurrencyCodeChange(code) {
      this.baseCurrency.code = code
      if (code === this.quoteCurrency.code || this.quoteCurrency.code === null) {
        const another = this.quoteCurrenciesCodes.find((q) => q !== code)
        this.quoteCurrency.code = another ?? null
      }
      this.calcBaseCurrencyAmount()
    },
    handleQuoteCurrencyCodeChange(code) {
      this.quoteCurrency.code = code
      this.calcQuoteCurrencyAmount()
    },
    ///
    calcQuoteCurrencyAmount() {
      const val = this.baseCurrency.amount
      if (val === null || !this.isFactorsFilled) { this.quoteCurrency.amount = null; return }
      const toGet = val * this.currentRate
      this.quoteCurrency.amount = toGet - (toGet * this.currentCommission / 100)
    },
    calcBaseCurrencyAmount() {
      const val = this.quoteCurrency.amount
      if (val === null || !this.isFactorsFilled) { this.baseCurrency.amount = null; return }
      const toGetWithoutCommission = val * 100 / (100 - this.currentCommission)
      this.baseCurrency.amount = toGetWithoutCommission / this.currentRate
    }
  },

  components: { CurrencyInput }
}
</script>
