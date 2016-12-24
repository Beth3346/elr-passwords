import elrUtlities from 'elr-utility-lib';
import elrUI from 'elr-ui';
import passwordGenerator from 'password-generator.js';
import passwordUtilties from 'password-utilities.js';
import passwordValidator from 'password-validator.js';

const $ = require('jquery');

const elr = elrUtlities();
const ui = elrUI();
const generator = passwordGenerator();
const utils = passwordUtilties();
const validator = passwordValidator();

const elrPasswords = function({
    fieldClass = 'elr-password',
    buttonClass = 'elr-show-password',
    reqLength = 10,
    showButtonText = 'Show Password',
    hideButtonText = 'Hide Password'
} = {}) {
    const self = {
        showPassword($field, $button, showButtonText, hideButtonText) {
            const fieldType = $field.attr('type');

            if (fieldType === 'password') {
                $field.attr('type', 'text');
                $button.text(hideButtonText);
            } else {
                $field.attr('type', 'password');
                $button.text(showButtonText);
            }
        }
    };

    const $field = $(`.${fieldClass}`);
    const $showButton = $(`.${buttonClass}`);
    const $generateButton = $('.elr-generate-password');

    $showButton.on('click', function(e) {
        e.preventDefault();
        self.showPassword($field, $(this), showButtonText, hideButtonText);
    });

    $field.on('keyup', elr.throttle(function() {
        const password = elr.getValue(this);
        const passwordLength = (password) ? password.length : 0;
        const results = {
            blacklist: null,
            length: null,
            complexity: null
        };

        results.blacklist = elr.checkBlacklist(password, self.blacklist);
        results.length = elr.checkLength(password, reqLength);
        results.complexity = validator.checkStrength(password);

        const status = validator.getStatus(results);

        validator.createMessage(status, passwordLength, $field);
        // createMeter(status, passwordLength, $field);
    }, 500));

    $generateButton.on('click', function() {
        const $passHolder = $('.password-holder').empty();
        const newPassword = generator.generatePassword(reqLength);

        ui.createElement('p', {
            text: newPassword
        }).appendTo($passHolder);
    });

    return self;
};

export default elrPasswords;