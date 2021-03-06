# Overview
The purpose of this project is to provide serverless solution for below functions, triggered by scheduled CloudWatch events

## Housekeeping of EC2 instances with code from expired feature branches
The lambda function finds all available EC2 instances under AWS account. The EC2 instanced are expected to be `tagged` with `git_repo` and `git_branch`. It then connects to Git source server to verify if the commit is older than N days, if yes, terminate the EC2 instance.

# Future Improvements
1. Currently the code is hightly coupled with Github URL and APIs. Let's make it more flexible in the future.
2. AWS SDK `ec2.terminateInstances` doesn't work on stopped instances, let's address this issue if AWS API is updated or when a workaround is available.
3. We should use something like webpack to build our code, and upload code from built `dist` directory.
4. Update project structure to have code in `src` folder per convention.


# How to deploy the code
We use AWS SAM (serverless enabled Cloudformation) to deploy the lambda function. 
You can either deploy the code with 

## Jenkinsfile
The Jenkinsfile is from an old sample of mine, however, the style is outdated in my view, since now I prefer externalized implementation logics from Jenkinsfile.

## AWSCLIs.

```
sam package --profile user001 --output-template-file packaged.yaml --s3-bucket $cloudformation_stack_name}
sam deploy --profile user001 --template-file packaged.yaml --stack-name ${cloudformation_stack_name}
```