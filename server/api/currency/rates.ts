import { genRates } from '../../_data'

export default defineEventHandler((_ev) => {
  return genRates()
})
