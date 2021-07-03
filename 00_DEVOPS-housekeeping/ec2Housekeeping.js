let AWS = require('aws-sdk')
let ec2 = new AWS.EC2({apiVersion: '2016-11-15'})
let axios = require('axios')

exports.isNumValid = function(num) {
    if (num > 70) {
        return false
    } else if (num < 10) {
        return false
    } else {
        return true
    }
}

/**
 * Prepare list of ec2 instances to be removed if source branch at GitHub has commit > 3 days
 * 
 * param: 
 *   ec2TagArr - ec2 tag objects that contains repo/branch information for N days
 *   list - an array to be populated with ec2 resource ids
 */
exports.prepareExpiredEc2List = function(ec2TagsArr, list){
  const DAYS = 3
  let config = {
    method: 'get',
    baseURL: 'https://api.github.com/repos/aws-samples',
    url: 'DUMMY',
    proxy:false,
  }
  
  return new Promise((resolve, reject) => {
    //prepare variables
    let repo
    let branch
    let ec2RsrcId
    for (let i = 0; i < ec2TagsArr.length; i++) {
      if ("git_branch" === ec2TagsArr[i].Key){
        branch = ec2TagsArr[i].Value
        ec2RsrcId = ec2TagsArr[i].ResourceId
      } else if ("git_repo" === ec2TagsArr[i].Key){
        repo = ec2TagsArr[i].Value
      }
    }
    
    config.method = 'get'
    config.url = '/'+repo+'/branches/'+branch

    axios.request(config)
    .then( resp => {
      let commitIsoDate = resp.data.commit.commit.committer.date   
      if(this.checkExpiredCommit(commitIsoDate)){
        list.push(ec2RsrcId)
      }
      resolve("Success")
    })
    .catch(err => console.log(err))

  })
}

exports.checkExpiredCommit = function(commitIsoDate){
  const RETENTION_DAYS = 3

  let today = new Date()
  let commitDate = new Date(commitIsoDate)
  let diffInTime = today.getTime() - commitDate.getTime()
  let diffInDay = diffInTime / (1000 * 3600 * 24)

  if(diffInDay > RETENTION_DAYS){
    return true
  } else {
    return false
  }
}

/**
 * Get Tags from list of EC2 instances
 * Note: the result object contains EC2 resource id, we take advantage to run housekeeping check base on the result.
 * 
 * param: ec2 resource id
 * 
 * Returns array of Tag objects:  
 * {"Key":"git_branch","ResourceId":"i-0f2ea5baf8f2e5830","ResourceType":"instance","Value":"webapp-tutorial"}
 */
exports.getInstancesTags = function(wk_instance_id){
  return new Promise((resolve) => {
    //create filter 
    let params = {
      Filters: [
        {
          Name: 'resource-id',
          Values: [wk_instance_id],
        }, 
      ] 
    }

    ec2.describeTags(params, function(err, data) {
      let arr_tags = []
      
      if (err) {
        console.log(err, err.stack)
      } else {
        arr_tags.push(data)
      }

      resolve(arr_tags)
    })
  })
}


/**
 * List all ec2 instances
 * 
 * Returns array of instance resource id:
 *  [i-0758dabc428161045,i-0f2ea5baf8f2e5830]
 */
exports.getInstances = function(){
  return new Promise((resolve) => {
    let params = {} //filter
  
    ec2.describeInstances(params, function(err, data) {
      let arr_instances = []
          
      if (err) {
        console.log(err, err.stack)
      } else {
        for (let i = 0; i < data.Reservations.length; i++) {
          let obj = data.Reservations[i].Instances[0]
          arr_instances.push(obj.InstanceId)
        }
      }
      resolve(arr_instances)
    })
  })
}


/**
 * Remove ec2 intances
 * param: 
 * instanceArr = [ 'i-0758dabc428161045', 'i-0f2ea5baf8f2e5830' ]
 */
exports.rmInstance = function(instanceArr){
  return new Promise((resolve, reject) => {
    var params = {
     InstanceIds: instanceArr
    }
    
    console.log("terminating:"+instanceArr)
    ec2.terminateInstances(params, function(err, data) {
      if (err) console.log(err, err.stack) // an error occurred
      else     console.log(data)           // successful response
    })
  })
}