const currenciesList = [
  'RUB',
  'AFN',
  'ALL',
  'DZD',
  'USD',
  'EUR',
  'AOA',
  'BOB',
  'BOV',
  'USD',
  'BAM',
  'BWP',
  'NOK',
  'BRL',
  'EUR'
]

const commissions = new Array(5).fill(0).map((_, i) => i + 1)

const getRandCommission = () => commissions[Math.floor(Math.random()*commissions.length)]
const getRandRate = () => Math.random() * (100 - 10) + 10


function eachPair(cb) {
  currenciesList.forEach( ( base) => {
    currenciesList.forEach( ( quote) => {
      if (base !== quote) {
        cb(base, quote)
      }
    })
  })
}


function genPairs() {
  const pairs = []
  eachPair((base_currency, quote_currency) => {
    pairs.push( {
      base_currency,
      quote_currency,
      commission: getRandCommission()
    } )
  })
  return pairs
}

function genRates() {
  const rates = []
  eachPair((base, quote) => {
    rates.push({
      pair: `${base}/${quote}`,
      rate: getRandRate()
    })
  })
  return rates
}

module.exports = {
  genPairs,
  genRates
}
