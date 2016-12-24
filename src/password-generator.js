import elrUtlities from 'elr-utility-lib';
import elrUI from 'elr-ui';
const $ = require('jquery');

let elr = elrUtlities();
let ui = elrUI();

const passwordGenerator = function({
    reqLength = 10
} = {}) {
    const self = {
        createPassword(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+?~.,/{}[]+=_-';
            let pass = elr.generateRandomString(length, charset);
            const strength = this.checkStrength(pass);

            // keep calling create password until the generated password
            // satisfies the strength requirements
            if (strength === 'strong' || pass.length >= length) {
                return pass;
            }

            return this.createPassword(length);
        },
        generatePassword(length) {
            return this.createPassword(length);
        }
    };

    return self;
};

export default passwordGenerator;