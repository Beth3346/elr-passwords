import elrUtlities from 'elr-utilities';
const $ = require('jquery');

let elr = elrUtlities();

const elrPasswords = function({
    fieldClass = 'elr-password',
    buttonClass = 'elr-show-password',
    reqLength = 10,
    showButtonText = 'Show Password',
    hideButtonText = 'Hide Password'
} = {}) {
    const self = {
        blacklist: [
            'password',
            'pass',
            '1234',
            'shadow',
            '12345',
            '123456',
            'qwerty',
            '1234',
            'iloveyou',
            'abc123',
            '123456789',
            '1234567890',
            'adobe123',
            '123123',
            'admin',
            'letmein',
            'photoshop',
            'monkey',
            'sunshine',
            'princess',
            'password1',
            'azerty',
            'trustno1',
            '000000',
            'guest',
            'default'
        ],
        showPassword($field, $button, showButtonText, hideButtonText) {
            const fieldType = $field.attr('type');

            if ( fieldType === 'password' ) {
                $field.attr('type', 'text');
                $button.text(hideButtonText);
            } else {
                $field.attr('type', 'password');
                $button.text(showButtonText);
            }
        },
        createPassword(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+?~.,/{}[]+=_-';
            let pass = elr.generateRandomString(length, charset);
            const strength = this.checkStrength(pass);

            // keep calling create password until the generated password
            // satisfies the strength requirements
            if ( strength === 'strong' || pass.length >= length ) {
                return pass;
            } else {
                return this.createPassword(length);
            }
        },
        generatePassword(length) {
            return this.createPassword(length);
        },
        checkStrength(password) {
            // ensure that passwords contain a mixture of uppercase and lowercase letters, numbers, and special characters
            const stats = {};

            stats.containsNum = elr.patterns.numeral.test(password);
            stats.containsAlphaLower = elr.patterns.alphaLower.test(password);
            stats.containsAlphaUpper = elr.patterns.alphaUpper.test(password);
            stats.containsSpecialCharacters = elr.patterns.specialCharacters.test(password);
            stats.allNumbers = elr.patterns.allNumbers.test(password);
            stats.allAlphaLower = elr.patterns.allAlphaLower.test(password);
            stats.allAlphaUpper = elr.patterns.allAlphaUpper.test(password);
            stats.allSpecialCharacters = elr.patterns.allSpecialCharacters.test(password);

            if ( stats.allNumbers || stats.allAlphaUpper || stats.allAlphaLower || stats.allSpecialCharacters ) {
                return 'weak';
            } else if ( stats.containsNum && stats.containsSpecialCharacters && stats.containsAlphaUpper && stats.containsAlphaLower ) {
                return 'strong';
            } else {
                return 'medium';
            }
        },
        createMessage(results, passwordLength, $field) {
            const $passwordMessage = $('.password-message');
            const messageClass = 'password-message';

            if ( passwordLength === 0 || results.status === 'success' ) {
                $passwordMessage.remove();
            } else if ( $passwordMessage.length === 0 && results.message !== null ) {
                $('<small></small>', {
                    text: results.message,
                    'class': `password-message-${results.status} ${messageClass}`
                }).hide().insertAfter($field).show();
            } else {
                this.removeStatusClass(messageClass);
                $passwordMessage.text(results.message);
                $passwordMessage.addClass(`password-message-${results.status}`);
            }
        },
        createMeter(results, passwordLength, $field) {
            const $passwordMeter = $('p.password-meter');
            const meterClass = 'password-meter';

            if ( passwordLength === 0 ) {
                $passwordMeter.remove();
            } else if ( $passwordMeter.length === 0 ) {
                $('<p></p>', {
                    text: results.strength,
                    'class': `password-meter-${results.status} ${meterClass}`
                }).hide().insertAfter($field).show();
            } else {
                this.removeStatusClass(meterClass);
                $passwordMeter.text(results.strength);
                $passwordMeter.addClass(`password-message-${results.status}`);
            }
        },
        removeStatusClass(elementClass) {
            const $element = $(`.${elementClass}`);

            $element.removeClass(`${elementClass}-danger`);
            $element.removeClass(`${elementClass}-warning`);
            $element.removeClass(`${elementClass}-success`);
        },
        getStatus(results) {
            const status = {
                message: null,
                strength: null,
                status: null
            };

            if (results.blacklist !== -1) {
                status.strength = 'weak';
                status.message = 'please do not use a common password';
                status.status = 'danger';
            } else if ( results.length ) {
                status.strength = 'weak';
                status.message = `password should be at least ${reqLength} characters`;
                status.status = 'danger';
            } else if ( results.complexity ) {
                status.strength = results.complexity;
                status.message = 'use a combination of uppercase and lowercase letters, numbers, and special characters';

                if ( results.complexity === 'weak' ) {
                    status.status = 'danger';
                } else if ( results.complexity === 'medium' ) {
                    status.status = 'warning';
                } else if ( results.complexity === 'strong' ) {
                    status.status = 'success';
                } else {
                    console.log('complexity: unknown status');
                }

            } else {
                status.strength = 'strong';
                status.message = 'great password';
                status.status = 'success';
            }

            return status;
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
        results.complexity = self.checkStrength(password);

        const status = self.getStatus(results);

        self.createMessage(status, passwordLength, $field);
        // createMeter(status, passwordLength, $field);
    }, 500));

    $generateButton.on('click', function() {
        const $passHolder = $('.password-holder').empty();
        const newPassword = self.generatePassword(reqLength);

        $('<p></p>', {
            text: newPassword
        }).appendTo($passHolder);
    });

    return self;
};

export default elrPasswords;