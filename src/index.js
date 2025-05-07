;(function(){
	var currentUrl= location.protocol + "//" +location.host + location.pathname;
	var proxy_redirect_uri = "";
	var jumpUrl = "";
	var wxPcOauthUrl = "https://open.weixin.qq.com/connect/qrconnect?appid={{appid}}&redirect_uri={{redirect_uri}}&response_type={{response_type}}&scope={{scope}}&state={{state}}#wechat_redirect";
	var wxH5OauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={{appid}}&redirect_uri={{redirect_uri}}&response_type={{response_type}}&scope={{scope}}&state={{state}}#wechat_redirect";
	var workPcOauthUrl = "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid={{cropid}}&agentid={{agentid}}&redirect_uri={{redirect_uri}}&state={{state}}";
	var workWebOauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={{cropid}}&agentid={{agentid}}&redirect_uri={{redirect_uri}}&response_type={{response_type}}&scope={{scope}}&state={{state}}#wechat_redirect";
	var wwLoginUrl = "https://login.work.weixin.qq.com/wwlogin/sso/login?login_type={{login_type}}&appid={{cropid}}&redirect_uri={{redirect_uri}}&state={{state}}";
	var dingtalkOauthUrl = "https://login.dingtalk.com/oauth2/auth?redirect_uri={{redirect_uri}}&response_type=code&client_id={{client_id}}&scope={{scope}}&state={{state}}&prompt=consent";

	function getId(id) {
		return document.getElementById(id);
	}
	function trim(str) {
		if(checkNullEmpty(str)) {
			return str;
		}
        return str.replace(/^\s+|\s+$/g, "");
 	}
	function redirectUrl(url) {
		window.location.href = url;
	}

	function replaceUrl(url) {
		window.location.replace(url);
	}
	function formatStr(s, k, v) {
		return s.replace(new RegExp("\\{\\{" + k + "\\}\\}", "g"), v);
	}
	function encodeUri4me(s) {
		if(typeof encodeURIComponent == "function") {
			return encodeURIComponent(s);
		} else if(typeof encodeURI == "function") {
			return encodeURI(s);
		} else if(typeof escape == "function") {
			return escape(s);
		}
		return s;
	}
	function decodeUri4me(s) {
		if(typeof decodeURIComponent == "function") {
			return decodeURIComponent(s);
		} else if(typeof decodeURI == "function") {
			return decodeURI(s);
		} else if(typeof unescape == "function") {
			return unescape(s);
		}
		return s;
	}
	
	function getQuery(name, isUnescape) {
		var sUrl = window.location.search.substr(1);
		var r = sUrl.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
		if(!isUnescape){
			return (r == null ? null : r[2]);
		}else{
			return (r == null ? null : decodeUri4me(r[2]));
		}
	}

	function checkNullEmpty(s) {
		if(s == null || s == "") {
			return true;
		}
		return false;
	}

	function appendParamToUrl(tmpUrl, param) {
		var retUrl = "";
		if(checkNullEmpty(tmpUrl)){
			return retUrl;
		}
		var questionMarkPos = tmpUrl.indexOf("?");
		if(questionMarkPos == -1) {
			retUrl = tmpUrl + "?" + param;
		} else {
			retUrl = tmpUrl + "&" + param;
		}

		return retUrl;
	}

	function proxyStart() {
		var isIntercept = false;
		var r = trim(getQuery("r", true));
		var code = trim(getQuery("code", false));
		var authCode = trim(getQuery("authCode", false))
		var state = getQuery("state", true);
		if(!checkNullEmpty(code) && !checkNullEmpty(r)) {
			isIntercept = true;
		} else if(!checkNullEmpty(authCode) && !checkNullEmpty(r)) {
			isIntercept = true;
			code = authCode;
		}
		if(isIntercept){
			jumpUrl = appendParamToUrl(r, "code=" + code);
			if(!checkNullEmpty(state)) {
				jumpUrl = appendParamToUrl(jumpUrl, "state=" + state);
			}
			replaceUrl(jumpUrl);
			return
		}

		var proxy_type = trim(getQuery("proxy_type", false)); 
		if(checkNullEmpty(proxy_type) && checkNullEmpty(code)) {
			getId("tipsId").innerHTML = "proxy_type不能为空";
			return
		}
		var appid = getQuery("appid", false);
		if(checkNullEmpty(appid)) {
			getId("tipsId").innerHTML = "appid不能为空";
			return
		}
		var redirect_uri = getQuery("redirect_uri", true);
		if(checkNullEmpty(redirect_uri)) {
			getId("tipsId").innerHTML = "redirect_uri不能为空";
			return
		}
		proxy_redirect_uri = currentUrl + "?r=" + encodeUri4me(redirect_uri);

		var response_type = getQuery("response_type", false);
		if(checkNullEmpty(response_type)) {
			response_type = "code";
		}
		var scope = getQuery("scope", true);
		if(checkNullEmpty(scope)) {
			scope = "snsapi_base";
			if(proxy_type == 'wxpc') {
				scope = "snsapi_login";
			} else if(proxy_type == 'dingtalk') {
				scope = "openid corpid";
			}
		}
		
		if(checkNullEmpty(state)) {
			state = "";
		} else {
			proxy_redirect_uri = proxy_redirect_uri + "&state=" + state;
		}
		switch(proxy_type) {
			case 'wxpc':
				jumpUrl = formatStr(wxPcOauthUrl, "appid", appid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "response_type", response_type);
				jumpUrl = formatStr(jumpUrl, "scope", scope);
				jumpUrl = formatStr(jumpUrl, "state", state);
			break;
			case 'wxh5':
				jumpUrl = formatStr(wxH5OauthUrl, "appid", appid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "response_type", response_type);
				jumpUrl = formatStr(jumpUrl, "scope", scope);
				jumpUrl = formatStr(jumpUrl, "state", state);
			break;
			case 'workpc':
				var agentid = getQuery("agentid", false);
				jumpUrl = formatStr(workPcOauthUrl, "cropid", appid);
				jumpUrl = formatStr(jumpUrl, "agentid", agentid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "state", state);	
			break;
			case 'workweb':
				var agentid = getQuery("agentid", false);
				jumpUrl = formatStr(workWebOauthUrl, "cropid", appid);
				jumpUrl = formatStr(jumpUrl, "agentid", agentid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "response_type", response_type);
				jumpUrl = formatStr(jumpUrl, "scope", scope);
				jumpUrl = formatStr(jumpUrl, "state", state);
			break;
			case 'wwlogin':
				var agentid = getQuery("agentid", false);
				var login_type = getQuery("login_type", false);
				if(checkNullEmpty(login_type)) {
					login_type="CorpApp";
				}
				jumpUrl = formatStr(wwLoginUrl, "cropid", appid);
				//jumpUrl = formatStr(jumpUrl, "agentid", agentid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "login_type", login_type);
				jumpUrl = formatStr(jumpUrl, "state", state);
				var lang = getQuery("lang", false);
				if(!checkNullEmpty(lang)) {
					jumpUrl+="&lang="+encodeUri4me(lang);
				}
				if(!checkNullEmpty(agentid)) {
					jumpUrl+="&agentid="+encodeUri4me(agentid);
				}
			break;
			case 'dingtalk':
				jumpUrl = formatStr(dingtalkOauthUrl, "client_id", appid);
				jumpUrl = formatStr(jumpUrl, "redirect_uri", encodeUri4me(proxy_redirect_uri));
				jumpUrl = formatStr(jumpUrl, "scope", encodeUri4me(scope));
				jumpUrl = formatStr(jumpUrl, "state", state);

			break;
		}
		if(!checkNullEmpty(jumpUrl)){
			replaceUrl(jumpUrl);
		}
		
	}

	if (window.addEventListener) {
		window.addEventListener("load", proxyStart, false);
	} else if(window.attachEvent) {
		window.attachEvent("load", proxyStart);
		window.attachEvent("onload", proxyStart);
	} else {
		proxyStart();
	}
	
})()
