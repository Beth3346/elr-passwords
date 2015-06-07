(function($) {
    window.elrPasswords = function(params) {
        var self = {};
        var spec = params || {};
        var bl = [
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
        ];
        var fieldClass = spec.fieldClass || 'elr-password';
        var buttonClass = spec.buttonClass || 'elr-show-password';
        var blacklist = spec.blacklist || bl;
        var reqLength = spec.reqLength || 8;
        var showButtonText = spec.showButtonText || 'Show Password';
        var hideButtonText = spec.hideButtonText || 'Hide Password';

        var showPassword = function($field, $button, showButtonText, hideButtonText) {
            var fieldType = $field.attr('type');

            if ( fieldType === 'password' ) {
                $field.attr('type', 'text');
                $button.text(hideButtonText);
            } else {
                $field.attr('type', 'password');
                $button.text(showButtonText);
            }
        };

        var generatePassword = function(length) {
            var createPassword = function(length) {
                    var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+?~.,/{}[]+=_-';
                    var pass = elr.generateRandomString(length, charset);
                    var strength = checkStrength(pass);

                    if ( strength !== 'strong' || pass.length !== length ) {
                        return createPassword(length);
                    } else {
                        return pass;
                    }
                };

            return createPassword(length);
        };

        var checkStrength = function(password) {
            // ensure that passwords contain a mixture of uppercase and lowercase letters, numbers, and special characters
            var stats = {};

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
        };

        var createMessage = function(results, passwordLength, $field) {
            var $passwordMessage = $('small.password-message');
            var messageClass = 'password-message';

            if ( passwordLength === 0 ) {
                $passwordMessage.remove();
            } else if ( $passwordMessage.length === 0 && results.message !== null ) {
                $('<small></small>', {
                    text: results.message,
                    'class': 'password-message-' + results.status + ' ' + messageClass
                }).hide().insertAfter($field).show();
            } else {
                removeStatusClass(messageClass);
                $passwordMessage.text(results.message);
                $passwordMessage.addClass('password-message-' + results.status);
            }
        };

        var createMeter = function(results, passwordLength, $field) {
            var $passwordMeter = $('p.password-meter');
            var meterClass = 'password-meter';

            if ( passwordLength === 0 ) {
                $passwordMeter.remove();
            } else if ( $passwordMeter.length === 0 ) {
                $('<p></p>', {
                    text: results.strength,
                    'class': 'password-meter-' + results.status + ' ' + meterClass 
                }).hide().insertAfter($field).show();
            } else {
                removeStatusClass(meterClass);
                $passwordMeter.text(results.strength);
                $passwordMeter.addClass('password-meter-' + results.status);
            }
        };

        var removeStatusClass = function(elementClass) {
            var $element = $('.' + elementClass);

            $element.removeClass(elementClass + '-danger');
            $element.removeClass(elementClass + '-warning');
            $element.removeClass(elementClass + '-success');
        };

        var getStatus = function(results) {
            var status = {
                message: null,
                strength: null,
                status: null
            };

            if ( results.blacklist !== -1 ) {
                status.strength = 'weak';
                status.message = 'please do not use a common password';
                status.status = 'danger';
            } else if ( results.length ) {
                status.strength = 'weak';
                status.message = 'not enough characters';
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
        };

        var $field = $('.' + fieldClass);
        var $showButton = $('button.' + buttonClass);
        var $generateButton = $('button.elr-generate-password');

        $showButton.on('click', function(e) {
            e.preventDefault();
            showPassword($field, $(this), showButtonText, hideButtonText);
        });

        $field.on('keyup', elr.throttle(function() {
            var password = elr.getValue($field);
            var passwordLength = password.length;
            var results = {
                    blacklist: null,
                    length: null,
                    complexity: null
                };
            var status;

            results.blacklist = elr.checkBlacklist(password, blacklist);
            results.length = elr.checkLength(password, reqLength);
            results.complexity = checkStrength(password);
            
            status = getStatus(results);

            createMessage(status, passwordLength, $field);
            createMeter(status, passwordLength, $field);
        }, 500));

        $generateButton.on('click', function() {
            var $passHolder = $('.password-holder').empty();
            var newPassword = generatePassword(reqLength);

            $('<p></p>', {
                text: newPassword
            }).appendTo($passHolder);
        });

        return self;
    };
})(jQuery);