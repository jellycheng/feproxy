# feproxy
```
前端代理，中转，解决多域名、多环境问题

```

## 部署与打包
```
mkdir -p /data/www
cd /data/www
拉取代码：
	git clone https://github.com/jellycheng/feproxy.git
	cd feproxy/
	npm install
	npm run build
	cp public/index.html dist/index.html

配置nginx示例：
	location /feproxy {
	    alias /data/www/feproxy/dist/;
	    index index.html index.htm;
	}

```

## 参数说明
```

微信内h5授权： http://domain.com/feproxy/index.html?proxy_type=wxh5&appid=appid值&redirect_uri=跳转地址&scope=&state=
微信pc授权： http://domain.com/feproxy/index.html?proxy_type=wxpc&appid=appid值&redirect_uri=跳转地址&scope=&state=
企业微信授权： http://domain.com/feproxy/index.html?proxy_type=workpc&appid=企业ID&agentid=应用ID&redirect_uri=跳转地址&state=
钉钉授权： http://domain.com/feproxy/index.html?proxy_type=dingtalk&appid=钉钉的AppKey&scope=授权范围&redirect_uri=跳转地址&state=
	参数说明：
	  proxy_type： 代理类型，wxh5-微信h5、wxpc-微信pc、workpc-企业微信pc、dingtalk-钉钉
	  scope：授权范围，参数支持值 snsapi_base、snsapi_userinfo、snsapi_login、openid、openid corpid 
	  response_type：参数可选，默认response_type=code
	  state：参数可选，默认空
	  redirect_uri： 授权成功之后跳转地址，该地址会追加code和state值，格式： redirect_uri?code=CODE&state=STATE

```
