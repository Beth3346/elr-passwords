import elrUtlities from 'elr-utility-lib'
import elrUI from 'elr-ui'
import passwordUtilties from '../src/password-utilities.js'
const $ = require('jquery')

let elr = elrUtlities()
let ui = elrUI()
const utils = passwordUtilties()

const passwordValidator = function() {
    const self = {
        validate(password, length) {
            return {
                'blacklist': utils.checkBlacklist(password),
                'length': utils.checkLength(password, length),
                'strength': utils.checkStrength(password)
            }
        },
        setStatus(results) {
            const status = {
                'blacklist': null,
                'length': null,
                'strength': null
            }

            if (results.blacklist) {
                status.blacklist = this.setStatusBlacklist()
            }

            if (results.length) {
                status.length = this.setStatusLength(length)
            }

            if (results.strength) {
                status.strength = this.setStatusStrength(results)
            }

            return status
        },
        setStatusBlacklist(results) {
            if (results.blacklist === 'weak') {
                return {
                    'strength': 'weak',
                    'message': 'please do not use a common password',
                    'status': 'danger'
                }
            }

            return {
                'strength': 'strong',
                'message': 'your password is not in the list of common passwords',
                'status': 'success'
            }
        },
        setStatusLength(results, length) {
            if (results.length === 'weak') {
                return {
                    'strength': 'weak',
                    'message': `your password should be at least ${length} characters`,
                    'status': 'danger'
                }
            }

            return {
                'strength': 'strong',
                'message': `your password has at least ${length} characters`,
                'status': 'success'
            }
        },
        setStatusStrength(results) {
            let status
            let message

            if (results.strength === 'weak') {
                status = 'danger'
                message = 'use a combination of uppercase and lowercase letters, numbers, and special characters'
            } else if (results.strength === 'medium') {
                status = 'warning'
                message = 'use a combination of uppercase and lowercase letters, numbers, and special characters'
            } else if (results.strength === 'strong') {
                status = 'success'
                message = 'strong password'
            }

            return {
                'strength' : results.strength,
                'message' : message,
                'status': status
            }
        }
    }

    return self
}

export default passwordValidator