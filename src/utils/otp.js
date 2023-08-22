export class OTPCode {
    constructor() {
        this.code = this.generateCode();
        this.expiration = this.generateExpiration();
    }

    generateCode() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    generateExpiration() {
        return new Date().getTime() + 600000;
    }
}