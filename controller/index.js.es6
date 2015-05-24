/**
 * Created by michaelsilvestre on 25/04/15
 */

import { identityInit } from "./identify.js"
import { authenticateInit } from "./authenticate.js"

export default class Controller {
  constructor() {
    identityInit();
    authenticateInit();
  }
}