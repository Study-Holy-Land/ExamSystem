## ansible

1. 可以指定不同hosts：show-case，staging，production

2. variable根据hosts不同而不同

  ```sh
  # 指定host执行命令
  ansible-playbook site.yml -i inventory -v --extra-vars "variable_host=staging"
  ```

3. variable文件需要ignore

4. task需要分为本地和远程

5. 部署
   1. 本地：
   2. 远程：

6. flywaymigrate时要本地执行gradle还是远程执行gradle

7. 远程环境是否需要假数据

8. 启动web-api时canvas的安装策略是什么样的：测试




1. Myphpadmin
   1. Docker 启动
   2. 在docker-compose中配置
   3. 设置访问权限
2. 更新jenkins相关任务
3. 给staging和production提供的变量文件要从对应环境上拷贝
4. 从安全性和复用性上考虑variables




1. Webpack部署时候需要压缩JS和css

   ```
   http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
   ```

   ​

2. 初始化的ansible任务
   1. 刷一个admin进去
   2. 刷50个编程题

3. 将nginx作为其中的一个服务
   1. 仅暴露80或者80**接口
4. Web版的mongo管理工具
