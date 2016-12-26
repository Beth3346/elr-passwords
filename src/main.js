import elrUtlities from 'elr-utility-lib'
import elrUI from 'elr-ui'
import passwordGenerator from '../src/password-generator.js'
import passwordUtilties from '../src/password-utilities.js'
import passwordValidator from '../src/password-validator.js'
import jQuery from 'jquery'

// const $ = require('jquery')

const $ = jQuery()
const elr = elrUtlities()
const ui = elrUI()
const gen = passwordGenerator()
const utils = passwordUtilties()
const validator = passwordValidator()

const elrPasswords = function({
    fieldClass = 'elr-password',
    buttonClass = 'elr-show-password',
    reqLength = 10,
    showButtonText = 'Show Password',
    hideButtonText = 'Hide Password'
} = {}) {
    const self = {
        togglePassword($field, $button, showButtonText, hideButtonText) {
            const fieldType = $field.attr('type')

            if (fieldType === 'password') {
                $field.attr('type', 'text')
                $button.text(hideButtonText)
            } else {
                $field.attr('type', 'password')
                $button.text(showButtonText)
            }
        },
        createMessage(status, passwordLength, $field) {
            const $passwordMessage = $('.password-message')
            const messageClass = 'password-message'

            if (passwordLength === 0 || status.status === 'success') {
                $passwordMessage.remove()
            } else if ($passwordMessage.length === 0 && status.message !== null) {
                ui.createElement('small', {
                    text: status.message,
                    'class': `password-message-${status.status} ${messageClass}`
                }).hide().insertAfter($field).show()
            } else {
                this.removeStatusClass(messageClass)
                $passwordMessage.text(status.message)
                $passwordMessage.addClass(`password-message-${status.status}`)
            }
        },
        removeStatusClass(elementClass) {
            const $element = $(`.${elementClass}`)

            $element.removeClass(`${elementClass}-danger`)
            $element.removeClass(`${elementClass}-warning`)
            $element.removeClass(`${elementClass}-success`)
        },
    }

    const $field = $(`.${fieldClass}`)
    const $showButton = $(`.${buttonClass}`)
    const $generateButton = $('.elr-generate-password')

    $showButton.on('click', function(e) {
        e.preventDefault()
        self.togglePassword($field, $(this), showButtonText, hideButtonText)
    })

    $field.on('keyup', elr.throttle(function() {
        const password = $(this).val();
        // const passwordLength = (password) ? password.length : 0
        const results = validator.getResults(password, reqLength)
        const status = validator.getStatus(results)

        // validator.createMessage(status, passwordLength, $field)
        // createMeter(status, passwordLength, $field)
    }, 500))

    $generateButton.on('click', function() {
        const $passHolder = $('.password-holder').empty()
        const newPassword = gen.generatePassword(reqLength)

        ui.createElement('p', {
            text: newPassword
        }).appendTo($passHolder)
    })

    return self
}

export default elrPasswords