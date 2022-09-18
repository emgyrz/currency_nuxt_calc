
export type CurrenciesPairs = Record<string, Record<string, number>>

export function convertCurrenciesPairsResp(pairsArr): CurrenciesPairs {
  const result = {}
  pairsArr.forEach(({ base_currency, quote_currency, commission }) => {
    result[base_currency] ??= {}
    result[base_currency][quote_currency] = commission
  })
  return result
}

export function convertCurrenciesRatesResp(rates): Record<string, number> {
  const ratesObj = {}
  rates.forEach((rateObj) => {
    ratesObj[rateObj.pair] = rateObj.rate
  })
  return ratesObj
}
