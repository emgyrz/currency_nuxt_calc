import { genPairs } from '../../_data'

export default defineEventHandler((_ev) => {
  return genPairs()
})
