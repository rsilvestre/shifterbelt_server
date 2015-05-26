/**
 * Created by michaelsilvestre on 25/04/15
 */

import { identityInit } from "./identify.js"
import { authenticateInit } from "./authenticate.js"
import { messageInit } from "./message.js"

export default class Controller {
  constructor() {
    messageInit();
    identityInit();
    authenticateInit();
  }
}