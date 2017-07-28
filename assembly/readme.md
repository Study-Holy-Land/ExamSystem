##jenkins deploy script

###api

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker stop assembly_jetty-api_1'

scp -i /var/jenkins_home/.ssh/twars.pem $WORKSDIRECTORY/assembly/assemble/jetty-api.war ubuntu@54.222.191.27:/home/ubuntu/works/recruiting-system/assembly/assemble/jetty-api

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'cp /home/ubuntu/works/recruiting-system/assembly/conf/gradle.properties /home/ubuntu/works/recruiting-system/api'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'rm -rf /home/ubuntu/works/recruiting-system/api/src/test'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'cd /home/ubuntu/works/recruiting-system&&git pull&&gradle flywayMigrate'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker start assembly_jetty-api_1'


###app

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker stop assembly_node-app_1'

scp -i /var/jenkins_home/.ssh/twars.pem $WORKSDIRECTORY/assembly/assemble/nodeapp.zip ubuntu@54.222.191.27:/tmp/node-app.zip

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'rm -rf /home/ubuntu/works/recruiting-system/assembly/assemble/node-app'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'unzip -q /tmp/node-app.zip -d /home/ubuntu/works/recruiting-system/assembly/assemble'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker start assembly_node-app_1'

###task-queue

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker stop assembly_node-task-queue_1'

scp -i /var/jenkins_home/.ssh/twars.pem $WORKSDIRECTORY/assembly/assemble/task-queue.zip ubuntu@54.222.191.27:/tmp

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'rm -rf /home/ubuntu/works/recruiting-system/assembly/assemble/task-queue'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'unzip -q /tmp/task-queue.zip -d /home/ubuntu/works/recruiting-system/assembly/assemble'

ssh -T -i /var/jenkins_home/.ssh/twars.pem ubuntu@54.222.191.27 'docker start assembly_node-task-queue_1'