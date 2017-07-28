#!/usr/bin/env bash

set -eo pipefail


BASE_DIR=$(dirname $0)

function logo() {
  echo -e "\033[35m"
  cat $BASE_DIR/logo
  echo -e "\033[0m"
}

function updateApi() {
  dir=$1;

  if [[ -d $dir ]]; then
    cd $dir
	./gradlew clean
    ./gradlew flywaymigrate
    ./gradlew war
    cd -
  fi
}

function updateNodeApp() {
  dir=$1;
  shift;
  if [[ -d $dir ]]; then
    cd $dir
    if [[ $# -gt 0 ]]; then
      $@
    else
      npm install
    fi
    cd -
  fi
}

function initAllService() {
  docker-compose kill
  docker-compose up -d

  updateApi "$BASE_DIR/../paper-api";
#  updateNodeApp "$BASE_DIR/../web-api";
  updateNodeApp "$BASE_DIR/../web";
  updateNodeApp "$BASE_DIR/../web" ./node_modules/.bin/webpack;
  updateNodeApp "$BASE_DIR/../teacher-admin-web";
  updateNodeApp "$BASE_DIR/../teacher-admin-web" ./node_modules/.bin/webpack;
  
  
  docker-compose up -d nginx
  initJenkins
}

function initJenkins() {
  
  docker-compose up -d jenkins-dind
  sleep 5s # 创建容器时，即使开始运行了，也需要时间创建目录结构，不 sleep 会导致下面 mkdir 失败

  jenkins='assembly_jenkins-dind_1'

  # job copy
  docker exec $jenkins mkdir '/var/jenkins_home/jobs/ADD_IMAGE'
  docker cp $BASE_DIR/jenkins/ADD_IMAGE/config.xml $jenkins:/var/jenkins_home/jobs/ADD_IMAGE/

  docker exec $jenkins mkdir '/var/jenkins_home/jobs/HOMEWORK_SCORING'
  docker cp $BASE_DIR/jenkins/HOMEWORK_SCORING/config.xml $jenkins:/var/jenkins_home/jobs/HOMEWORK_SCORING/

  docker exec $jenkins mkdir '/var/jenkins_home/jobs/ADD_HOMEWORK'
  docker cp $BASE_DIR/jenkins/ADD_HOMEWORK/config.xml $jenkins:/var/jenkins_home/jobs/ADD_HOMEWORK/

  # plugins copy
  for i in $(ls $BASE_DIR/jenkins/plugins/*.hpi); do
      docker cp $i $jenkins:/var/jenkins_home/plugins/
  done

  docker restart $jenkins
}


action=$1

case $action in
  init)
    initAllService
    ;;
  jk)
    initJenkins;
	;;
  *)
    logo
    echo "用法：(init|jk)"
    echo "- command："
    echo "init 初始化所有服务"
	echo "jk 初始化 Jenkins"
    echo ""
    ;;
esac


