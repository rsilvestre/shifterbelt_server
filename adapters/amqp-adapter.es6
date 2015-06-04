/**
 * Created by michaelsilvestre on 20/04/15
 */

import amqp from "amqplib"
import when from "when"
import * as config from "../config/config.js"
import AbsAdapter from "./absAdapter.js"

export default class AmqpAdapter extends AbsAdapter {
  constructor(callback) {
    super("queue");

    this._connPub = null;
    this._connSub = null;
    this._chPub = null;
    this._chSub = null;
    this.init(() => {
      callback(this);
    });
  }

  init(callback) {
    this.createSubChannel(callback, (...arg) => {
      this.createPubChannel(...arg);
    });

    process.once('SIGINT', () => {
      console.log('Got SIGINT.  Press Control-D to exit.');
      console.log('close channel pub');
      let ok = this._chPub.close();
      ok = ok.then((err) => {
        if (err) throw err;
        console.log('channel pub closed');
        console.log('close channel sub');
        return this._chSub.close();
      });
      ok = ok.then((err) => {
        if (err) throw err;
        console.log('channel sub closed');
        console.log('close connection pub');
        return this._connPub.close();
      });
      ok = ok.then((err) => {
        if (err) throw err;
        console.log('connection pub closed');
        console.log('close connection sub');
        return this._connSub.close();
      });
      ok.then((err) => {
        if (err) throw err;
        console.log('connection sub closed');
        process.exit(0);
      });


    });
  }

  createSubChannel(callback, next) {
    let amqpConfig = config.adapters.getConfig("queue");
    amqp.connect(amqpConfig.url).then((conn) => {
      this._connSub = conn;
      console.log("amqb sub connected successfull connected");
      return conn.createChannel().then((ch) => {
        this._chSub = ch;
        return next(callback);
      });
    }).then(null, console.warn);
  }

  createPubChannel(next) {
    let amqpConfig = config.adapters.getConfig("queue");
    amqp.connect(amqpConfig.url).then((conn) => {
      this._connPub = conn;
      console.log("amqb pub connected successfull connected");
      return when(conn.createChannel().then((ch) => {
        this._chPub = ch;
        next();
      }))/*.ensure(() => { console.log('closed!!!!!!!'); conn.close(); })*/;
    }).then(null, console.warn);
  }

  get chSub() {
    return this._chSub;
  }

  get chPub() {
    return this._chPub;
  }
}