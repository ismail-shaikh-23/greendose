pipeline{
    agent any 

    parameters{
        choice(choices:['Build_all','Build_backend','Build_frontend', 'Build_db'], description: 'Build parameter choices', name: 'build')
    }
   
    stages{
        stage("Checkout"){
            steps{
                sh "git --version"
                sh "docker -v"
                sh "echo Branch Name: ${GIT_BRANCH}"
            }
        }

        stage("Declare Variable"){
            steps{
            script{
                switch(env.GIT_BRANCH){
                    case 'origin/development':
                        env.DEPLOY_ENV = "dev"
                        break
                    case 'origin/qa':
                        env.DEPLOY_ENV = "qa"
                        break
                    default:
                       env.DEPLOY_ENV = "development"
                       break       
                    }

                }
                sh "echo ${DEPLOY_ENV}"
            }
        }

        stage("Build_stage"){
            environment{
                ENV_FILE = credentials("greendose-${DEPLOY_ENV}-env-file")
            }
            parallel{
                stage("Backend"){
                    when{
                        expression{params.build == "Build_backend" || params.build ==  "Build_all"}
                    }
                    steps{
                        sh "docker-compose -f docker-compose.yml -f docker/${DEPLOY_ENV}.yml build backend "
                    }
                }

                stage("db"){
                    when{
                        expression{params.build == "Build_db" || params.build ==  "Build_all"}
                    }
                    steps{
                        sh "docker-compose -f docker-compose.yml -f docker/${DEPLOY_ENV}.yml  build db"
                    }
                }

                stage("Frontend"){
                    when{
                        expression{params.build == "Build_frontend" || params.build == "Build_all"}
                    }
                    steps{
                        sh "docker-compose -f docker-compose.yml -f docker/${DEPLOY_ENV}.yml --env-file ${ENV_FILE} build frontend"
                    }
                }
            }
        }

        stage("Save Images"){
            parallel{
                stage("Save_backend"){
                    when{
                        expression{params.build == "Build_backend" || params.build == "Build_all"}
                    }
                    steps{
                        sh "docker save greendose-wellness-${DEPLOY_ENV}  -o greendose-wellness-${DEPLOY_ENV}.tar "
                    }
                }

                stage("Save_frontend"){
                    when{
                        expression{params.build == "Build_frontend" || params.build == "Build_all"}
                    }
                    steps{
                        sh "docker save greendose-wellness-frontend-${DEPLOY_ENV} -o greendose-wellness-frontend-${DEPLOY_ENV}.tar"
                    }
                }

                stage("Save_db"){
                    when{
                        expression{params.build == "Build_db" || params.build == "Build_all"} 
                    }
                    steps{
                        sh "docker save greendose-wellness:db-${DEPLOY_ENV} -o greendose-wellness-db-${DEPLOY_ENV}.tar"
                    }
                }
            }
        } 


        stage("Transfer_images"){
            environment{
                ENV_FILE = credentials("greendose-dev-env-file")
                REMOTE_HOST = credentials("greendose-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greendose-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greendose/${DEPLOY_ENV}/"
                PORT = 2134
            }

            parallel{
                stage("tranfer_backend"){
                    when{
                        expression{params.build == "Build_backend" || params.build == "Build_all"}
                    }
                    steps{
                        sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                        //  sh "ssh -p 24211 -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST}" 
                         sh "scp  -o StrictHostKeyChecking=no -P ${PORT} greendose-wellness-${DEPLOY_ENV}.tar ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"   
                        }
                    }
                }

                stage("tranfer_frontend"){
                    when {
                        expression { params.build == "Build_frontend" || params.build == "Build_all" }
                    }
                    steps {
                        sshagent(credentials: ["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]) {
                        // sh "ssh -p 24211 -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST}"   
                        sh """
                            scp -o StrictHostKeyChecking=no  -P ${PORT}  greendose-wellness-frontend-${DEPLOY_ENV}.tar ${REMOTE_USER}@${REMOTE_HOST}:${RWD}
                        """
                        }
                    }
                }

                stage("tranfer_db"){
                    when{
                        expression{params.build == "Build_db" || params.build == "Build_all"}
                    }
                    steps{
                        sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                         sh "scp  -o StrictHostKeyChecking=no  -P ${PORT} greendose-wellness-db-${DEPLOY_ENV}.tar ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"   
                        }
                    }
                }

                stage("tranfer env and compose file "){
                    when{
                        expression{params.build == "Build_db" || params.build == "Build_all" || params.build == "Build_frontend" || params.build == "Build_backend" }
                    }
                    steps{
                        sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                        //  sh "scp -o StrictHostKeyChecking=no -P 24211 ${ENV_FILE} ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"
                           sh "scp -o StrictHostKeyChecking=no  -P ${PORT} docker-compose.yml ${ENV_FILE}  docker/${DEPLOY_ENV}.yml ${REMOTE_USER}@${REMOTE_HOST}:${RWD}"     
                        }
                    }
                }
      
            }
        } 

        stage("loading_images"){
            environment{
                ENV_FILE = credentials("greendose-dev-env-file")
                REMOTE_HOST = credentials("greendose-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greendose-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greendose/${DEPLOY_ENV}/"
                PORT = 2134
            }

            parallel{
               stage("load_backend"){
                 when {
                   expression{params.build == "Build_backend" || params.build == "Build_all"}
                 }
                 steps {
                   sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                   sh "ssh -p ${PORT}  -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} ' cd ${RWD} && docker load -i greendose-wellness-${DEPLOY_ENV}.tar ' "
                   }
                 }
               }
           
                stage("load_frontend"){
                   when{
                     expression{params.build == "Build_frontend" || params.build == "Build_all"}
                    }
                   steps{
                      sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                       sh "ssh -p ${PORT}  -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} ' cd ${RWD} && docker load -i greendose-wellness-frontend-${DEPLOY_ENV}.tar' "
                      }
              }
            }

           stage("load_db"){
              when{
                expression{params.build == "Build_db" || params.build == "Build_all"}
              }
              steps{
                sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                sh "ssh -p ${PORT}  -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} ' cd ${RWD} && docker load -i  greendose-wellness-db-${DEPLOY_ENV}.tar' "
                }
              }
            }  
          }
        }
       


       stage('Deploy'){
            environment{
                ENV_FILE = credentials("greendose-dev-env-file")
                REMOTE_HOST = credentials("greendose-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("greendose-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/greendose/${DEPLOY_ENV}/"
                PORT = 2134
            }

            steps{
                sshagent(["greendose-${DEPLOY_ENV}-remote-server-ssh-creds"]){
                    sh "ssh -p ${PORT} -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} 'cd ${RWD} && docker compose -f docker-compose.yml -f ${DEPLOY_ENV}.yml -p greendose-wellness --env-file .env up -d --no-build '"

                } 
            }
        }   
         
    }
    
}