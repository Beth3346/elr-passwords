// import elrUI from 'elr-ui'
import elrUtilities from 'elr-utility-lib'
import passwordUtilties from '../src/password-utilities.js'
import passwordGenerator from '../src/password-generator.js'
import passwordValidator from '../src/password-validator.js'

const elr = elrUtilities()
// const ui = elrUI()
const utils = passwordUtilties()
const gen = passwordGenerator()
const valid = passwordValidator()
const expect = require('chai').expect
const chai = require('chai')
const assertArrays = require('chai-arrays')
const chaiSubset = require('chai-subset')
const chaiObject = require('chai-shallow-deep-equal')

chai.use(assertArrays)
chai.use(chaiSubset)
chai.use(chaiObject)

describe('passwordUtilties', function() {
    describe('#checkStrength', function() {
        it('should return strong if the password passes all tests', function() {
            expect(utils.checkStrength('sDe&425Hye&')).to.equal('strong')
        })
        it('should return medium if the password contains some combination of character types', function() {
            expect(utils.checkStrength('rger88300')).to.equal('medium')
        })
        it('should return weak if the password is all lowercase letters', function() {
            expect(utils.checkStrength('bethrogers')).to.equal('weak')
        })
        it('should return weak if the password is all uppercase letters', function() {
            expect(utils.checkStrength('BETHROGERS')).to.equal('weak')
        })
        it('should return weak if the password is all numbers', function() {
            expect(utils.checkStrength('4378572')).to.equal('weak')
        })
        it('should return weak if the password is all special characters', function() {
            expect(utils.checkStrength('&$#*%()@')).to.equal('weak')
        })
    })
    describe('#checkBlacklist', function() {
        it('should return weak if the password is in the blacklist', function() {
            expect(utils.checkBlacklist('letmein')).to.equal('weak')
        })
        it('should return strong if the password in not in the blacklist', function() {
            expect(utils.checkBlacklist('Str0n$P@$$Wd')).to.equal('strong')
        })
    })
    describe('#checkLength', function() {
        it('should return weak if the password is not long enough', function() {
            expect(utils.checkLength('letmein', 10)).to.equal('weak')
        })
        it('should return strong if the password is long enought', function() {
            expect(utils.checkLength('longpassword', 10)).to.equal('strong')
        })
    });
    describe('#containsNum', function() {
        it('should be true if the string contains a numeric character', function() {
            expect(utils.containsNum('ehir93')).to.be.true
        })
        it('should be false if the string does not contain a numeric character', function() {
            expect(utils.containsNum('ehirrgdf')).to.be.false
        })
    })
    describe('#containsAlphaLower', function() {
        it('should be true if the string contains a lowercase alpha character', function() {
            expect(utils.containsAlphaLower('ehir93')).to.be.true
        })
        it('should be false if the string does not contain a lowercase alpha character', function() {
            expect(utils.containsAlphaLower('KJOU898')).to.be.false
        })
    })
    describe('#containsAlphaUpper', function() {
        it('should be true if the string contains an uppercase alpha character', function() {
            expect(utils.containsAlphaUpper('ehJIKir93')).to.be.true
        })
        it('should be false if the string does not contain an uppercase alpha character', function() {
            expect(utils.containsAlphaUpper('ehirrgdf')).to.be.false
        })
    })
    describe('#containsSpecialCharacters', function() {
        it('should be true if the string contains a special character', function() {
            expect(utils.containsSpecialCharacters('e*&5hir93')).to.be.true
        })
        it('should be false if the string does not contain a special character', function() {
            expect(utils.containsSpecialCharacters('ehirrgdf')).to.be.false
        })
    })
    describe('#allNum', function() {
        it('should be true if the string all numeric characters', function() {
            expect(utils.allNum('536253')).to.be.true
        })
        it('should be false if the string contains something other than numeric characters', function() {
            expect(utils.allNum('6453yg43')).to.be.false
        })
    })
    describe('#allAlphaLower', function() {
        it('should be true if the string is all lowercase alpha characters', function() {
            expect(utils.allAlphaLower('gsgrrsth')).to.be.true
        })
        it('should be false if the string contains something other than lowercase alpha characters', function() {
            expect(utils.allAlphaLower('KJOU898')).to.be.false
        })
    })
    describe('#allAlphaUpper', function() {
        it('should be true if the string is all uppercase alpha characters', function() {
            expect(utils.allAlphaUpper('KJOUJEIJ')).to.be.true
        })
        it('should be false if the string contains something other than uppercase alpha characters', function() {
            expect(utils.allAlphaUpper('ehGR6rrgdf')).to.be.false
        })
    })
    describe('#allSpecialCharacters', function() {
        it('should be true if the string is all special characters', function() {
            expect(utils.allSpecialCharacters('&(&#$@)%&')).to.be.true
        })
        it('should be false if the string contains something other than special characters', function() {
            expect(utils.allSpecialCharacters('eh$#irrgdf')).to.be.false
        })
    })
})

describe('passwordGenerator', function() {
    describe('#createPassword', function() {
        it('should create a password string', function() {
            expect(gen.createPassword(10)).to.be.a('string')
        })
        it('should be at least 10 characters', function() {
            expect(gen.createPassword(10)).to.have.lengthOf(10)
        })
        it('should be a strong password', function() {
            expect(utils.checkStrength(gen.createPassword(10))).to.equal('strong')
        })
    })
    describe('#generatePassword', function() {
        it('should generate a password string', function() {
            expect(gen.generatePassword(10)).to.be.a('string')
        })
        it('should be at least 10 characters', function() {
            expect(gen.generatePassword(10)).to.have.lengthOf(10)
        })
        it('should be a strong password', function() {
            expect(utils.checkStrength(gen.generatePassword(10))).to.equal('strong')
        })
    })
})

describe('passwordValidator', function() {
    describe('#validate', function() {
        it('should validate the password', function() {
            const results = {
                'blacklist': 'weak',
                'length': 'weak',
                'strength': 'weak'
            }

            expect(valid.validate('letmein', 10)).to.shallowDeepEqual(results)
        })
    })
    describe('#setStatusBlacklist', function() {
        it('should set the password blacklist status', function() {
            const blacklistTrue = {
                'strength': 'weak',
                'message': 'please do not use a common password',
                'status': 'danger'
            }
            const blacklistFalse = {
                'strength': 'strong',
                'message': 'your password is not in the list of common passwords',
                'status': 'success'
            }
            expect(valid.setStatusBlacklist({'blacklist': 'weak'})).to.shallowDeepEqual(blacklistTrue)
            expect(valid.setStatusBlacklist({'blacklist': 'strong'})).to.shallowDeepEqual(blacklistFalse)
        })
    })
    describe('#setStatusLength', function() {
        it('should set the password length status', function() {
            const length = 10
            const lengthTrue = {
                'strength': 'weak',
                'message': `your password should be at least ${length} characters`,
                'status': 'danger'
            }
            const lengthFalse = {
                'strength': 'strong',
                'message': `your password has at least ${length} characters`,
                'status': 'success'
            }

            expect(valid.setStatusLength({'length': 'weak'}, length)).to.shallowDeepEqual(lengthTrue)
            expect(valid.setStatusLength({'length': 'strong'}, length)).to.shallowDeepEqual(lengthFalse)
        })
    })
    describe('#setStatusStrength', function() {
        it('should set the password strength status', function() {
            const strengthWeak = {
                'strength': 'weak',
                'message': 'use a combination of uppercase and lowercase letters, numbers, and special characters',
                'status': 'danger'
            }
            const strengthMedium = {
                'strength': 'medium',
                'message': 'use a combination of uppercase and lowercase letters, numbers, and special characters',
                'status': 'warning'
            }
            const strengthStrong = {
                'strength': 'strong',
                'message': 'strong password',
                'status': 'success'
            }
            expect(valid.setStatusStrength({'strength': 'weak'})).to.shallowDeepEqual(strengthWeak)
            expect(valid.setStatusStrength({'strength': 'medium'})).to.shallowDeepEqual(strengthMedium)
            expect(valid.setStatusStrength({'strength': 'strong'})).to.shallowDeepEqual(strengthStrong)
        })
    })
});