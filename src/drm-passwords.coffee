###############################################################################
# Password utility
###############################################################################
"use strict"

$ = jQuery
class @DrmPasswords
    constructor: (@password = $(':input.drm-password')) ->
        self = @
        self.button = 'button.show-password'

        $('form').on 'click', self.button, self.showPassword
        @password.on 'keyup', self.evaluatePassword

    showPassword: (e) =>
        _fieldType = @password.attr 'type'
        _button = $ @button

        if _fieldType is 'password'
            @password.attr 'type', 'text'
            _button.text 'Hide Password'
        else
            @password.attr 'type', 'password'
            _button.text 'Show Password'

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
        _patterns =
            number: new RegExp '^\\d*$','g'
            alphaLower: new RegExp '^[a-z]*$','g'
            alphaUpper: new RegExp '^[A-Z]*$','g'
            alphaNum: new RegExp '^[\\da-z]*$','ig'

        if _patterns.number.test password
            'weak'
        else if _patterns.alphaLower.test password
            'weak'
        else if _patterns.alphaUpper.test password
            'weak'
        else if _patterns.alphaNum.test password
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
        _blacklist = @checkBlacklist password
        _length = @checkLength results.passwordLength, 8
        _complexity = @checkStrength password

        if _blacklist isnt -1
            results.strength = 'weak'
            results.message = 'please do not use a common password'
            results.status = 'danger'
        else if _length
            results.strength = 'weak'
            results.message = 'not enough characters'
            results.status = 'danger'
        else if _complexity
            results.strength = _complexity
            results.message = 'use a combination of uppercase and lowercase letters, numbers, and special characters'
            results.status = switch
                when _complexity == 'weak' then 'danger'
                when _complexity == 'medium' then 'warning'
                when _complexity == 'strong' then 'success'
        else
            results.strength = 'strong'
            results.message = 'great password'
            results.status = 'success'

        @createMessage results
        @createMeter results

    createMessage: (results) =>
        _passwordMessage = $ 'small.password-message'
        messageClass = 'password-message'

        if results.passwordLength is 0
            _passwordMessage.remove()
        else if _passwordMessage.length is 0 and results.message isnt null
            _passwordMessage = $ '<small></small>',
                text: "#{results.message}"
                class: "password-message-#{results.status} password-message"

            _passwordMessage.hide().insertAfter(@password).show()
        else
            @removeStatusClass messageClass
            _passwordMessage.text "#{results.message}"
            _passwordMessage.addClass "password-message-#{results.status}"

    createMeter: (results) =>
        _passwordMeter = $ 'p.password-meter'
        meterClass = 'password-meter'

        if results.passwordLength is 0
            _passwordMeter.remove()
        else if _passwordMeter.length is 0
            _passwordMeter = $ '<p></p>',
                text: "#{results.strength}",
                class: "password-meter-#{results.status} password-meter"

            _passwordMeter.hide().insertAfter(@password).show()
        else
            @removeStatusClass meterClass
            _passwordMeter.text "#{results.strength}"
            _passwordMeter.addClass "password-meter-#{results.status}"

    removeStatusClass: (elementClass) ->
        _element = $ ".#{elementClass}"
        _element.removeClass "#{elementClass}-danger"
        _element.removeClass "#{elementClass}-warning"
        _element.removeClass "#{elementClass}-success"

new DrmPasswords()