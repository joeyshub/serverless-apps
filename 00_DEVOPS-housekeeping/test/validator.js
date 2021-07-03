const chai = require('chai')
const expect = chai.expect

const ec2 = require('../ec2Housekeeping.js')

describe("checkExpiredCommit()", () => {
    let currdate = new Date()

	it("should return true for date() object more than 3 days", ()=> {
        let checkdate = new Date(currdate)
        checkdate.setDate(currdate.getDate() - 4)
		expect(ec2.checkExpiredCommit(checkdate.toISOString())).to.be.true
	})

	it("should return false for date() object within 3 days", () => {
        let checkdate = new Date(currdate)
        checkdate.setDate(currdate.getDate() - 2)
		expect(ec2.checkExpiredCommit(checkdate.toISOString())).to.be.false
	})
})