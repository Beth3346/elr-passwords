import elrUtlities from 'elr-utility-lib'
import passwordUtilties from '../src/password-utilities.js'
import elrUI from 'elr-ui'

const elr = elrUtlities()
const ui = elrUI()
const utils = passwordUtilties()

const passwordGenerator = function() {
    const self = {
        createPassword(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+?~.,/{}[]+=_-'
            let pass = elr.generateRandomString(length, charset)
            const strength = utils.checkStrength(pass)

            // keep calling create password until the generated password
            // satisfies the strength requirements
            if (strength === 'strong' && pass.length >= length) {
                return pass
            }

            return this.createPassword(length)
        },
        generatePassword(length) {
            return this.createPassword(length)
        }
    }

    return self
}

export default passwordGenerator