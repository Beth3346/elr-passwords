###############################################################################
# Password utility
###############################################################################
"use strict"

class @DrmPasswords
    constructor: (@password = $(':input.drm-password')) ->
        self = @
        self.button = 'button.show-password'

        $('form').on 'click', self.button, self.showPassword
        @password.on 'keyup', self.evaluatePassword

    showPassword: (e) =>
        fieldType = @password.attr 'type'
        button = $ @button

        if fieldType is 'password'
            @password.attr 'type', 'text'
            button.text 'Hide Password'
        else
            @password.attr 'type', 'password'
            button.text 'Show Password'

        e.preventDefault()

    getPassword: =>
        $.trim @password.val()

    checkBlacklist: (password) ->
        blacklist = [
            'password'
            'pass'
            '1234'
            'shadow'
            '12345'
            '123456'
            'qwerty'
            '1234'
            'iloveyou'
            'abc123'
            '123456789'
            '1234567890'
            'adobe123'
            '123123'
            'admin'
            'letmein'
            'photoshop'
            'monkey'
            'sunshine'
            'princess'
            'password1'
            'azerty'
            'trustno1'
            '000000'
            'guest'
            'default'
        ]

        $.inArray password.toLowerCase(), blacklist

    checkLength: (length, reqLength) ->
        if length < reqLength
            true
        else
            false

    checkStrength: (password) ->
        patterns =
            number: new RegExp '^\\d*$','g'
            alphaLower: new RegExp '^[a-z]*$','g'
            alphaUpper: new RegExp '^[A-Z]*$','g'
            alphaNum: new RegExp '^[\\da-z]*$','ig'

        if patterns.number.test password
            'weak'
        else if patterns.alphaLower.test password
            'weak'
        else if patterns.alphaUpper.test password
            'weak'
        else if patterns.alphaNum.test password
            'medium'
        else
            null

    evaluatePassword: =>
        password = @getPassword()
        results =
            message: null
            strength: null
            status: null
            passwordLength: password.length
        blacklist = @checkBlacklist password
        length = @checkLength results.passwordLength, 8
        complexity = @checkStrength password

        if blacklist isnt -1
            results.strength = 'weak'
            results.message = 'please do not use a common password'
            results.status = 'danger'
        else if length
            results.strength = 'weak'
            results.message = 'not enough characters'
            results.status = 'danger'
        else if complexity
            results.strength = complexity
            results.message = 'use a combination of uppercase and lowercase letters, numbers, and special characters'
            results.status = switch
                when complexity == 'weak' then 'danger'
                when complexity == 'medium' then 'warning'
                when complexity == 'strong' then 'success'
        else
            results.strength = 'strong'
            results.message = 'great password'
            results.status = 'success'

        @createMessage results
        @createMeter results

    createMessage: (results) =>
        passwordMessage = $ 'small.password-message'
        messageClass = 'password-message'

        if results.passwordLength is 0
            passwordMessage.remove()
        else if passwordMessage.length is 0 and results.message isnt null
            passwordMessage = $ '<small></small>',
                text: "#{results.message}"
                class: "password-message-#{results.status} password-message"

            passwordMessage.hide().insertAfter(@password).show()
        else
            @removeStatusClass messageClass
            passwordMessage.text "#{results.message}"
            passwordMessage.addClass "password-message-#{results.status}"

    createMeter: (results) =>
        passwordMeter = $ 'p.password-meter'
        meterClass = 'password-meter'

        if results.passwordLength is 0
            passwordMeter.remove()
        else if passwordMeter.length is 0
            passwordMeter = $ '<p></p>',
                text: "#{results.strength}",
                class: "password-meter-#{results.status} password-meter"

            passwordMeter.hide().insertAfter(@password).show()
        else
            @removeStatusClass meterClass
            passwordMeter.text "#{results.strength}"
            passwordMeter.addClass "password-meter-#{results.status}"

    removeStatusClass: (elementClass) ->
        element = $ ".#{elementClass}"
        element.removeClass "#{elementClass}-danger"
        element.removeClass "#{elementClass}-warning"
        element.removeClass "#{elementClass}-success"

new DrmPasswords()