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
                'length': utils.checkLength(password),
                'strength': utils.checkStrength(password, length)
            }
        },
        setStatus(results) {
            const status = {
                'blacklist': null,
                'length': null,
                'strength': null
            }

            if (results.blacklist) {
                status.blacklist: this.setStatusBlacklist()
            }

            if (results.length) {
                status.length: this.setStatusLength(length)
            }

            if (results.strength) {
                status.strength: this.setStatusStrength(results)
            }
        },
        setStatusBlacklist() {
            return {
                'strength': 'weak',
                'message': 'please do not use a common password',
                'status': 'danger'
            }
        },
        setStatusLength(length) {
            return {
                'strength': 'weak',
                'message': `password should be at least ${length} characters`,
                'status': 'danger'
            }
        },
        setStatusStrength(results) {
            let status

            if (results.strength === 'weak') {
                status = 'danger'
            } else if (results.strength === 'medium') {
                status = 'warning'
            } else if (results.strength === 'strong') {
                status = 'success'
            } else {
                console.log('strength: unknown status')
            }

            return {
                'strength' : results.strength,
                'message' : 'use a combination of uppercase and lowercase letters, numbers, and special characters',
                'status': status
            }
        },
        // createMessage(results) {
        //     return results.message
        // },
        // createStatusClass(results) {
        //     const messageClass = 'password-message'

        //     return `password-message-${results.status} ${messageClass}`
        // }
    }

    return self
}

export default passwordValidator