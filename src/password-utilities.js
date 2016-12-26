import elrUtlities from 'elr-utility-lib'
import elrUI from 'elr-ui'

let elr = elrUtlities()
let ui = elrUI()

const passwordUtilities = function() {
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
        containsNum(password) {
            return elr.patterns.numeral.test(password)
        },
        containsAlphaLower(password) {
            return elr.patterns.alphaLower.test(password)
        },
        containsAlphaUpper(password) {
            return elr.patterns.alphaUpper.test(password)
        },
        containsSpecialCharacters(password) {
            return elr.patterns.specialCharacters.test(password)
        },
        allNum(password) {
            return elr.patterns.allNumbers.test(password)
        },
        allAlphaLower(password) {
            return elr.patterns.allAlphaLower.test(password)
        },
        allAlphaUpper(password) {
            return elr.patterns.allAlphaUpper.test(password)
        },
        allSpecialCharacters(password) {
            return elr.patterns.allSpecialCharacters.test(password)
        },
        getPasswordStrength(password) {
            return {
                'containsNum': this.containsNum(password),
                'containsAlphaLower': this.containsAlphaLower(password),
                'containsAlphaUpper': this.containsAlphaUpper(password),
                'containsSpecialCharacters': this.containsSpecialCharacters(password),
                'allNum': this.allNum(password),
                'allAlphaLower': this.allAlphaLower(password),
                'allAlphaUpper': this.allAlphaUpper(password),
                'allSpecialCharacters': this.allSpecialCharacters(password)
            }
        },
        checkStrength(password) {
            // ensure that passwords contain a mixture of uppercase and lowercase letters, numbers, and special characters
            const stats = this.getPasswordStrength(password)

            if (stats.allNum || stats.allAlphaUpper || stats.allAlphaLower || stats.allSpecialCharacters) {
                return 'weak'
            } else if (stats.containsNum && stats.containsSpecialCharacters && stats.containsAlphaUpper && stats.containsAlphaLower) {
                return 'strong'
            }

            return 'medium'
        },
        checkBlacklist(password) {
            if (elr.checkBlacklist(password, this.blacklist) !== -1) {
                return 'weak'
            }

            return 'strong'
        },
        checkLength(password, length) {
            if (elr.checkLength(password, length)) {
                return 'weak'
            }

            return 'strong'
        }
    }

    return self
}

export default passwordUtilities