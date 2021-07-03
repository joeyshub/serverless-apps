const hkeeper = require('./ec2Housekeeping.js')

exports.handler = async (event, context, callback) => {
  let rmEc2List = []
  let arrEc2 = await hkeeper.getInstances()
  for (let i = 0; i < arrEc2.length; i++) {
    let arrEc2tags = await hkeeper.getInstancesTags(arrEc2[i])
    for (let j = 0; j < arrEc2tags.length; j++) {
      await hkeeper.prepareExpiredEc2List(arrEc2tags[j].Tags, rmEc2List)
    }
  }
  hkeeper.rmInstance(rmEc2List)
  
  return "success"
}