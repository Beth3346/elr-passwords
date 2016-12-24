import elrUtlities from 'elr-utility-lib';
import elrUI from 'elr-ui';
const $ = require('jquery');

let elr = elrUtlities();
let ui = elrUI();

const passwordValidator = function({
    fieldClass = 'elr-password',
    buttonClass = 'elr-show-password',
    reqLength = 10,
    showButtonText = 'Show Password',
    hideButtonText = 'Hide Password'
} = {}) {
    const self = {
        createMessage(results, passwordLength, $field) {
            const $passwordMessage = $('.password-message');
            const messageClass = 'password-message';

            if (passwordLength === 0 || results.status === 'success') {
                $passwordMessage.remove();
            } else if ($passwordMessage.length === 0 && results.message !== null) {
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
        removeStatusClass(elementClass) {
            const $element = $(`.${elementClass}`);

            $element.removeClass(`${elementClass}-danger`);
            $element.removeClass(`${elementClass}-warning`);
            $element.removeClass(`${elementClass}-success`);
        },
        setStatusBlacklist() {
            return {
                'strength': 'weak',
                'message': 'please do not use a common password',
                'status': 'danger'
            };
        },
        setStatusLength(reqLength) {
            return {
                'strength': 'weak',
                'message': `password should be at least ${reqLength} characters`,
                'status': 'danger'
            };
        },
        setStatusComplexity(results) {
            let status;

            if (results.complexity === 'weak') {
                status = 'danger';
            } else if (results.complexity === 'medium') {
                status = 'warning';
            } else if (results.complexity === 'strong') {
                status = 'success';
            } else {
                console.log('complexity: unknown status');
            }

            return {
                'strength' : results.complexity,
                'message' : 'use a combination of uppercase and lowercase letters, numbers, and special characters',
                'status': status
            };
        },
        setStatusSuccess() {
            return {
                'strength': 'strong',
                'message': 'great password',
                'status': 'success'
            };
        },
        clearStatus() {
            return {
                'message': null,
                'strength': null,
                'status': null
            };
        },
        getStatus(results) {
            if (results.blacklist !== -1) {
                return this.setStatusBlacklist;
            } else if (results.length) {
                return this.setStatusLength(reqLength);
            } else if (results.complexity) {
                return this.setStatusComplexity(results);
            }

            return this.setStatusSuccess();
        }
    };

    return self;
};

export default passwordValidator;