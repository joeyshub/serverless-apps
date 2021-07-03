def WK_CLOUDFORMATION_STACK = "DEVOPS-serverless-apps"
def WK_LAMBDA_BUILD_LIST = "00_DEVOPS-housekeeping"
def WK_LAMBDA_PATHS = []

/*
* Usage notes:
* This Jenkins pipeline is written to build/test/deploy AWS serverless lambda
* functions. 
* 
* For adding new lambda functions, please following guidlines in the README.md to 
* configure the AWS resource deployment. The only thing you should modify in this file
* should be adding the 'lambda function directory' to above varaible 'WK_LAMBDA_BUILD_LIST'.
*/
pipeline {

    agent {
        node {
            label 'docker'
        }
    }

    stages {
        //checkout scm in defined through Jenkins console

        stage('Init'){
            steps {
                echo "[STAGE] Init..."
 
                script {
                    // prepare lambda list to build/deploy
                    def tempList = splitStringWithComma(WK_LAMBDA_BUILD_LIST)
                    for(String tmpPath: tempList) {
                        def var_lambda_dir = "${env.WORKSPACE}/${tmpPath}"

                        // add checked lambda path to WK_LAMBDA_PATHS
                        if (fileExists(var_lambda_dir)) {
                            WK_LAMBDA_PATHS.add(var_lambda_dir)
                        }else{
                            println("[WARNING]"+ var_lambda_dir +" does not exist.")
                        }
                    }
                    println("WK_LAMBDA_PATHS: "+WK_LAMBDA_PATHS)
                }
            }
        }
        stage('Build') {
            steps {
                echo '[STAGE] Building...'

                script {
                    for(String lambdaPath: WK_LAMBDA_PATHS) {
                        //switch to each lambda sub-folder as working directory 
			            dir (lambdaPath) {
			                buildNodejsProject()
			            }
		            }
		        }
	        }
        }
        stage('Test') {
            steps {
                echo '[STAGE] Testing...'
                
                script {
                    for(String lambdaPath: WK_LAMBDA_PATHS) {
                        //switch to each lambda sub-folder as working directory
                        dir (lambdaPath) {
                            testNodejsProject()
                        }
                    }
                }
           }
        }
        stage('Deploy') {
            steps {
                echo '[STAGE] Deploying...'
                //switch to jenkins project home as working directory
                dir ("${env.WORKSPACE}") {
                    deployAllProject(WK_CLOUDFORMATION_STACK)
                }
            }
        }
    }
}

/*
 * Transform a comma delimited String into a String list/array
*/
def splitStringWithComma(projects){
    println ("splitStringWithComma() - result: "+projects.split(","))
    return projects.split(",")
}

/*
 * Build lambda functions
*/
void buildNodejsProject(){
    sh """
        npm prune
        npm install
    """
}

/*
 * Test lambda functions
*/
void testNodejsProject(){
    //sh 'npm test'
    echo '[TODOs] implement testings by npm test ....'
}

/*
 * Deploy lambda functions
*/
void deployAllProject(stackname){
    sh """
        sam package  --output-template-file packaged.yaml --s3-bucket yuming-lambda-midway
        sam deploy --template-file packaged.yaml --stack-name ${stackname}
    """
}
