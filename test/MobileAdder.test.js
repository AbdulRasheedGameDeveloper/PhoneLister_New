const { assert } = require("chai")

const MobileAdder = artifacts.require('./MobileAdder.sol')

contract('MobileAdder', (accounts) => {
    before(async () => {
        this.mobileAdder = await MobileAdder.deployed()
    })

    it('Add Mobile', async () => {
        const result = await this.mobileAdder.addMobile('samsung', 9999)
        const phonecount = await this.mobileAdder.phonecount()
        assert.equal(phonecount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.name, 'samsung')
        assert.equal(event.price, 9999)
        
    })

    
    it('Removes Mobile', async () => {
        const result = await this.mobileAdder.removeMobile(1)
        const phonecount = await this.mobileAdder.phonecount()
        assert.equal(phonecount.toNumber(), 0)
//        const event = result.logs[0].args
//        assert.equal(event.id.toNumber(), 1)
//        assert.equal(event.name, 'samsung')
//        assert.equal(event.price, 9999)
        
    })
})