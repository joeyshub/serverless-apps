# Overview
This repository contains the lambda functions (ie. tasks) that Bioclinica devops team used to manage, maintain and monitor AWS resources. A separate README.md is available for each task in each tasks's directory. Only Nodejs based lambda function is allowed under this repo.

# Usage
Each devop task (eg. a lambda function manages the daily backup of EBS volumes) should be under it's own directory. A separate README.md should be available for each task. DO NOT contaminate the top-level README.md  with devop tasks' information or details.

# Directory Naming Convention
The Lambda functions serving the same task/purpose should be grouped in one directory. Please follow below directory naming convention.

Example: **00_DEVOPS-dailybackup-ebs-volumes**  
${two digit number}_${TYPES}-${task-name-in-kebab-case}  

${two digit number} - nothing but a task type number for ease of task ordering
${TYPES} - the task type in captial cases
${task-name-in-kebab-case} - the task name/purpose in kebab case  

# CI/CD
We use Jenkins Declarative Pipeline for the CI/CD works. The steps can be found in _Jenkinsfile_ under the repository root.

Only the lambda function diretories explicitly specified in _Jenkinsfile_ will go through the CI/CD process.

The deployment uses AWS SAM framework, which process the template.yaml and deploy the required resources through AWS CloudFormation.
sss