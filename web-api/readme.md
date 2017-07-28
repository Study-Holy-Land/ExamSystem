#### MAC OSX 系统安装 canvas失败的解决

因为要做图片验证码的功能，所以林老师给了一个github 库 https://github.com/napa3um/node-captcha/blob/master/Readme.md
，看上去 很6，可以直接生成一个验证码的图片

于是 执行
```
npm install canvas --save

```
但是会报错：
```
> canvas@1.3.12 install /Users/Thoughtworks/WorkSpace/recruiting-system/web-api/node_modules/canvas
> node-gyp rebuild

Package cairo was not found in the pkg-config search path.
Perhaps you should add the directory containing `cairo.pc'
to the PKG_CONFIG_PATH environment variable
No package 'cairo' found
gyp: Call to './util/has_lib.sh freetype' returned exit status 0 while in binding.gyp. while trying to load binding.gyp
gyp ERR! configure error
gyp ERR! stack Error: `gyp` failed with exit code: 1

```

分析： 应该是`cairo`这个库没有装，于是安装 cairo，但是这个是系统底层的库，于是 使用 brew 安装
```
  brew install cairo
```
结果很顺利，成功安装
再次执行
```
 npm install canvas --save 
```
这次会报一个不相同的错
```
> canvas@1.3.12 install /Users/Thoughtworks/WorkSpace/recruiting-system/web-api/node_modules/canvas
> node-gyp rebuild

  SOLINK_MODULE(target) Release/canvas-postbuild.node
  CXX(target) Release/obj.target/canvas/src/Canvas.o
In file included from ../src/Canvas.cc:20:
../src/JPEGStream.h:10:10: fatal error: 'jpeglib.h' file not
      found
#include <jpeglib.h>
         ^
1 error generated.
```

发现jpeglib.h 这个运行库貌似没有安装，于是开始 google

参考了如下的链接：
github ：[problem with cairo when npm install canvas #225](https://github.com/Automattic/node-canvas/issues/225)

按照上述的一个个执行，发现还是没有效果，于是
参考 github：[Installation Fails on OS-X 10.11 El Capitan #649](https://github.com/Automattic/node-canvas/issues/649)

文中 有提到的操作：
> xcode-select --install
> brew install pkgconfig
> brew install pixman
> brew install libjpeg
> brew install giflib 
> brew install cairo

ok，执行完上述命令后，再次执行
```
 npm install canvas --save 
```
会有新的错误
> canvas@1.3.12 install /Users/Thoughtworks/WorkSpace/recruiting-system/web-api/node_modules/canvas
> node-gyp rebuild
> SOLINK_MODULE(target) Release/canvas-postbuild.node
ld: library not found for -lgcc_s.10.5
clang: error: linker command failed with exit code 1 (use -v to see invocation)
make: *** [Release/canvas-postbuild.node] Error 1


这次貌似是因为  `-lgcc_s.10.5`  没有这个库导致

于是再次google 找到
github： [XCode 7: library not found for -lgcc_s.10.5 #2933](https://github.com/nodejs/node/issues/2933)

核心一句：
> See nodejs/node-gyp#734, you need to install both xcode 7 and the new command line tools. Closing, it's not an issue with node or node-gyp.

key：   `xcode7`   有没有！！瞬间感觉 一切都解决了

我在娇娇的电脑上试了一下，它的电脑版本是 10.10.5 ，xcode版本为7.4  
在她的电脑上 执行
```
   brew install cairo     //ok
   npm install canvas --save   //ok
```

没有一点问题，
结论：我的xcode 的版本太低了(版本6.4)，  升级到7.3就好了。


问题 2
场景:
在mac上pull完代码后,执行npm instal 可以安装 canvas,但是重启docker镜像后,依旧会报错. 

尝试进入docker web-api 的linux镜像中安装 canvas

注意此时node__module中已经存在 canvas, 并不会重新安装.

所以需要

```
npm uninstall canvas --save 
```

之后


```
npm install canvas --save 
```

即可.

原因分析: mac 和linux 的系统环境不同,虽然 npm的包 不依赖于特定系统,但安装后应该略有不同.

