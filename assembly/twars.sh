#!/usr/bin/env bash

set -eo pipefail

JENKINS_ADDR=local.twars:8888

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
  git submodule init
  git submodule update

  updateApi "$BASE_DIR/../paper-api";
  updateApi "$BASE_DIR/../user-api";
  #updateNodeApp "$BASE_DIR/../web-api";
  updateNodeApp "$BASE_DIR/../web";
  updateNodeApp "$BASE_DIR/../web" ./node_modules/.bin/webpack;

  eval $(docker-machine env default --shell bash)
  docker-compose -f $BASE_DIR/docker-compose.yml kill
  docker-compose -f $BASE_DIR/docker-compose.yml up -d
}

function initializeJenkins() {
  curl -X POST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins?token=4ae89c95673627619782d95bcd57e283 -d '<install plugin="git@current" />'
  curl -X POST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins --user admin:admin -d '<install plugin="EnvInject@current" />'
  curl -X POST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins --user admin:admin -d '<install plugin="flexible-publish@current" />'
  curl -X POST http://$JENKINS_ADDR/pluginManager/installNecessaryPlugins --user admin:admin -d '<install plugin="PostBuildScript@current" />'
  deployJenkins
}

function backupJenkins() {
  curl -X GET http://$JENKINS_ADDR/job/HOMEWORK-SCORING/config.xml --user admin:admin > "$BASE_DIR/.data/jenkins/config.xml"
}

function deployJenkins() {
  curl -X POST http://$JENKINS_ADDR/createItem?name\=HOMEWORK-SCORING --user admin:admin --data-binary "@$BASE_DIR/.data/jenkins/config.xml" -H "Content-Type:text/xml"
}

function initMysql() {
  eval $(docker-machine env default --shell bash)
  echo "the password of root:"
  sql=$(cat $BASE_DIR/mysql-init.sql)
  read -s password
  docker exec -it assembly_mysql_1 mysql -u root -p$password -e "$sql"
}

action=$1

case $action in
  jk)
    initializeJenkins;
    echo "jenkins启动过程缓慢,此过程可能需要一定时间"
    echo "请查看 http://$JENKINS_ADDR/updateCenter/"
    ;;
  rjk)
    deployJenkins
    ;;
  bkjk)
    backupJenkins
    ;;
  rs)
    initAllService
    ;;
  my)
    initMysql;
    ;;
  *)
    logo
    echo "用法：(jk|rjk|bkjk|my|rs)"
    echo "- command："
    echo "jk 初始化jenkins"
    echo "rjk 更新jenkins"
    echo "my 初始化数据库和用户"
    echo "rs 重启所有服务"
    echo "bkjk 备份jenkins"
    echo ""
    ;;
esac
