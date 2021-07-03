# Overview
The purpose of this project is to provide serverless solution for below functions, triggered by scheduled CloudWatch events

## Housekeeping of EC2 instances with code from expired feature branches
The lambda function finds all available EC2 instances under AWS account. The EC2 instanced are expected to be _tagged_ with _git_repo_ and _git_branch_. It hen connects to Git source server to verify if the commit is older than N days, if yes, terminate the EC2 instance.

# Future Improvements
1. Currently the code is hightly coupled with Github URL and APIs. Let's make it more flexible in the future.
2. AWS SDK _ec2.terminateInstances_ doesn't work on stopped instances, let's address this issue if the API updated or when a workaround is available.


# How to deploy the code
We use AWS SAM (serverless enabled Cloudformation) to deploy the lambda function. 
You can either deploy the code with Jenkinsfile OR run below AWSCLIs.

sam package --profile user001 --output-template-file packaged.yaml --s3-bucket $cloudformation_stack_name}
sam deploy --profile user001 --template-file packaged.yaml --stack-name ${cloudformation_stack_name}
