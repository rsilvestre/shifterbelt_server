/**
 * Created by michaelsilvestre on 20/04/15
 */



export default class Device {
    constructor(macAddress) {
        this._macAddress = macAddress;
    }

    get macAddress() {
        return this._macAddress;
    }

    set application(value) {
        this._application = value;
    }

    get application() {
        return this._application;
    }

    set password(value) {
        this._password = value;
    }

    get password() {
        return this._password;
    }

    set keyName(value) {
        this._keyName = value;
    }

    get keyName() {
        return this._keyName;
    }
}