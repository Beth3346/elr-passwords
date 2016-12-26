import elrUI from 'elr-ui'
import elrUtilities from 'elr-utility-lib'
import passwordUtilties from '../src/password-utilities.js'
import passwordGenerator from '../src/password-generator.js'

const elr = elrUtilities()
const ui = elrUI()
const utils = passwordUtilties()
const gen = passwordGenerator()
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