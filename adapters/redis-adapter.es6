/**
 * Created by michaelsilvestre on 19/04/15
 */

import redis from "redis"
import * as config from "../config/adapters.js"
import AbsAdapter from "./absAdapter.js"
import url from "url"

export default class RedisAdapter extends AbsAdapter {
    constructor(callback) {
        super("memory");
        this.init();
        console.log('redis successfull connected');
        callback(this);
    }

    init() {
        let redisConfig = config.adapters.getConfig("memory");
        var redisURL = url.parse(redisConfig.defaultUrl());

        this._redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

        if (redisURL.auth) {
            this._redisClient.auth(redisURL.auth.split(":")[1]);
        }

        this._redisClient.on('error', function(err) {
            "use strict";

            console.log('Error '+ err);
            log.info('Error '+ err);
        });
    }

    get client() {
        return this._redisClient;
    }

}
