/**
 * Created by michaelsilvestre on 4/06/15
 */

import * as adapters from "./adapters.js"

export default {
  root: `${__dirname}/..`,
  adapters: adapters,
  stikySession: {
    num: 8,
    proxy: true,
    header: 'x-forwarded-for',
    sync: {
      isSyncable: true,
      event: 'mySyncEventCall'
    }
  }
};