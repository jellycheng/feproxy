# feproxy
```
前端代理，中转，解决多域名、多环境问题
```

## 打包
```
npm run build
cp public/index.html dist/index.html

```

## 参数说明
```

微信内h5授权：http://domain.com/feproxy/index.html?proxy_type=wxh5&appid=appid值&redirect_uri=跳转地址&scope=&state=
微信pc授权：	http://domain.com/feproxy/index.html?proxy_type=wxpc&appid=appid值&redirect_uri=跳转地址&scope=&state=
	参数说明：
	  proxy_type： 代理类型，wxh5、wxpc、workpc、dingdingtalk
	  scope参数支持：snsapi_base、snsapi_userinfo、snsapi_login 
	  response_type参数可选，默认response_type=code
	  state参数可选，默认空

```
