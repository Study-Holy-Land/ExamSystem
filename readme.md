# ThoughtWorks Recruiting System

## Fully clone the project
```
$ git clone git@github.com:thoughtworks-academy/recruiting-system.git
$ cd recruiting-system
$ git submodule init
$ git submodule update
```



## Setup containers
```
$ cd recruting-system/assembly
$ docker-compose up -d
```
> It takes a long time to pull images from docker registry.
> Use a cable can save lots of time.

In `assembly` directory, run command `./show-case.sh`, your'll see help information 
```
========= TWARS ===========

  0--0^^^^^^^^^^^^\________
  \__/||-------||---------~
      ``       ``

用法：(init|jk)
- command：
init 重启所有服务
jk 初始化 Jenkins
```

You need to run command  `./show-case.sh init` to initialize all services.

## The tricky part
Edit `web-api/app.js`:
Comment two lines related to captcha:
```
var captcha = require('./middleware/captcha');
app.use(captcha(params));
```
Then run `npm install canvas` in `web-api` container:
* Get a shell to `web-api`
```
$ docker exec -it $(docker ps | grep 'node' | cut -d' ' -f1) bash
```
* Install **canvas** dependency
```
$ cd /var/app && npm install canvas
```
Exit the shell, uncomment the TWO lines of code.

- Restart the `web-api` container.

```
$ docker-compose restart web-api    # in recruting-system/assembly/
```



> NOTE:  reference https://www.npmjs.com/package/canvas to install canvas when encounter problems.

## Check result
visit <http://localhost:8888/api/inspector>
The response should look like below:
```
{
  "app": "connected",
  "mysql": "connected",
  "api": "connected",
  "mongodb": "connected"
  }
}
```

## Visit Homepage
Visit <http://localhost:8888>[](http://localhost:8888)
