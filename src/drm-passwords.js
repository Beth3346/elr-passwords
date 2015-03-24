(function($) {
    window.drmPasswords = function(args) {
        var self = {},
            spec = args || {},
            bl = [
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
            fieldClass = spec.fieldClass || 'drm-password',
            buttonClass = spec.buttonClass || 'drm-show-password',
            blacklist = spec.blacklist || bl,
            reqLength = spec.reqLength || 8,
            showButtonText = spec.showButtonText || 'Show Password',
            hideButtonText = spec.hideButtonText || 'Hide Password';

        self.showPassword = function(field, button, showButtonText, hideButtonText) {
            var fieldType = field.attr('type');

            if ( fieldType === 'password' ) {
                field.attr('type', 'text');
                button.text(hideButtonText);
            } else {
                field.attr('type', 'password');
                button.text(showButtonText);
            }
        };

        self.getPassword = function(field) {
            return $.trim(field.val());
        };

        self.generatePassword = function() {

        };

        self.checkBlacklist = function(password, blacklist) {
            return $.inArray(password.toLowerCase(), blacklist);
        };

        self.checkLength = function(length, reqLength) {
            return (length < reqLength) ? true : false;
        };

        self.checkStrength = function(password) {
            // ensure that passwords contain a mixture of uppercase and lowercase letters, numbers, and special characters
            var patterns = {
                    number: new RegExp('[0-9]+','g'),
                    alphaLower: new RegExp('[a-z]+','g'),
                    alphaUpper: new RegExp('[A-Z]+','g'),
                    specialCharacters: new RegExp('[^a-zA-Z0-9_]','g'),
                    allNumbers: new RegExp('^[0-9]*$','g'),
                    allAlphaLower: new RegExp('^[a-z]*$','g'),
                    allAlphaUpper: new RegExp('^[A-Z]*$','g'),
                    allSpecialCharacters: new RegExp('^[^a-zA-Z0-9_]*$','g'),
                },
                results = {
                    containsNum: patterns.number.test(password),
                    containsAlphaLower: patterns.alphaLower.test(password),
                    containsAlphaUpper: patterns.alphaUpper.test(password),
                    containsSpecialCharacters: patterns.specialCharacters.test(password),
                    allNumbers: patterns.allNumbers.test(password),
                    allAlphaLower: patterns.allAlphaLower.test(password),
                    allAlphaUpper: patterns.allAlphaUpper.test(password),
                    allSpecialCharacters: patterns.allSpecialCharacters.test(password)
                }

            if ( results.allNumbers || results.allAlphaUpper || results.allAlphaLower || results.allSpecialCharacters ) {
                return 'weak';
            } else if ( results.containsNum && results.containsSpecialCharacters && results.containsAlphaUpper && results.containsAlphaLower ) {
                return 'strong';
            } else {
                return 'medium';
            }
        };

        self.createMessage = function(results, passwordLength, field) {
            var passwordMessage = $('small.password-message'),
                messageClass = 'password-message';

            if ( passwordLength === 0 ) {
                passwordMessage.remove();
            } else if ( passwordMessage.length === 0 && results.message !== null ) {
                $('<small></small>', {
                    text: results.message,
                    'class': 'password-message-' + results.status + ' ' + messageClass
                }).hide().insertAfter(field).show();
            } else {
                self.removeStatusClass(messageClass);
                passwordMessage.text(results.message);
                passwordMessage.addClass('password-message-' + results.status);
            }
        };

        self.createMeter = function(results, passwordLength, field) {
            var passwordMeter = $('p.password-meter'),
                meterClass = 'password-meter';

            if ( passwordLength === 0 ) {
                passwordMeter.remove();
            } else if ( passwordMeter.length === 0 ) {
                $('<p></p>', {
                    text: results.strength,
                    'class': 'password-meter-' + results.status + ' ' + meterClass 
                }).hide().insertAfter(field).show();
            } else {
                self.removeStatusClass(meterClass);
                passwordMeter.text(results.strength);
                passwordMeter.addClass('password-meter-' + results.status);
            }
        };

        self.removeStatusClass = function(elementClass) {
            var element = $('.' + elementClass);

            element.removeClass(elementClass + '-danger');
            element.removeClass(elementClass + '-warning');
            element.removeClass(elementClass + '-success');
        };

        self.getStatus = function(results) {
            var status = {
                message: null,
                strength: null,
                status: null
            }

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
        }

        var field = $('.' + fieldClass),
            button = $('button.' + buttonClass);

        button.on('click', function(e) {
            e.preventDefault();
            self.showPassword(field, $(this), showButtonText, hideButtonText);
        });

        field.on('keyup', function() {
            var password = self.getPassword(field),
                passwordLength = password.length,
                results = {
                    blacklist: null,
                    length: null,
                    complexity: null
                },
                status;

            results.blacklist = self.checkBlacklist(password, blacklist);
            results.length = self.checkLength(passwordLength, reqLength);
            results.complexity = self.checkStrength(password);
            
            status = self.getStatus(results);

            self.createMessage(status, passwordLength, field);
            self.createMeter(status, passwordLength, field);
        });

        return self;
    };
})(jQuery);