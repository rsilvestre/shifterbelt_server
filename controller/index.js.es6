/**
 * Created by michaelsilvestre on 25/04/15
 */

import { identityInit } from "./identify.js"
import { authenticateInit, messageClose } from "./authenticate.js"
import { logger } from "../lib/logger.js"

export default class Controller {
  constructor() {
    identityInit();
    authenticateInit();
  }

  close(next) {
    logger.info("Controller stop send message by closing websocket");
    messageClose(next);
  }
}