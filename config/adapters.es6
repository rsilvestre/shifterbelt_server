/**
 * Created by michaelsilvestre on 19/04/15
 */
let defaultValue = {
    'database': 'mssql',
    'memory': 'redis',
    'queue': 'amqp',
    'websocket': 'socketIo'
};

let config = {
    mssql: {
        adapter: "mssqlAdapter",
        config: {
            user: 'shifterbelt@n8vsykqyzf',
            password: 'ascrt2bZ$',
            server: 'n8vsykqyzf.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
            database: 'shifterbelt',

            options: {
                encrypt: true // Use this if you're on Windows Azure
            }
        }
    },
    redis: {
        adapter: "redisAdapter",
        config: {
            connection: {
                type: 'redis',
                host: 'localhost',         // optional
                port: 6379,                // optional
                prefix: 'sess',            // optional
                ttl: 804600,               // optional
                timeout: 10000             // optional
            },
            defaultUrl: function () {
                "use strict";
                return process.env.REDISCLOUD_URL || this.connection.type + "://" + this.connection.host + ":" + this.connection.port;
            }
        }
    },
    rabbitmq: {
        adapter: "rabbitAdapter",
        config: {
            url: 'amqp://cutma1X1:aSSRFXC7_K5MvnwAGKrg3uZ7CMTCiTNt@swift-bluebell-30.bigwig.lshift.net:11068/0kFUqWJSIiki'
        }
    },
    amqp: {
        adapter: "amqpAdapter",
        config: {
            url: 'amqp://cutma1X1:aSSRFXC7_K5MvnwAGKrg3uZ7CMTCiTNt@swift-bluebell-30.bigwig.lshift.net:11068/0kFUqWJSIiki'
        }
    },
    socketIo: {
        adapter: "wsAdapter",
        config: {
            port: 3000,
            namespace: "ns"
        }
    }
};

export var adapters = {
    getAdapterConfig: function(name) {
        if (!defaultValue.hasOwnProperty(name)) {
            return new Error(`The adapter not contain a property name: ${name}`);
        }

        if (!config.hasOwnProperty(defaultValue[name])) {
            return new Error(`The adapter config don't containe a description for ${defaultValue[name]}`);
        }

        return config[defaultValue[name]];
    },
    getAdapter: function(name) {
        let adapter = this.getAdapterConfig(name);
        if (adapter instanceof Error) {
            return adapter;
        }
        return adapter.adapter;
    },
    getConfig: function(name) {
        let config = this.getAdapterConfig(name);
        if (config instanceof Error) {
            return config;
        }
        return config.config;
    }
};