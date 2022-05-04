
;(function(){
	var currentUrl= location.protocol + "//" +location.host + location.pathname;
	var proxy_redirect_uri = "";
	var jumpUrl = "";
	var wxPcOauthUrl = "https://open.weixin.qq.com/connect/qrconnect?appid={{appid}}&redirect_uri={{redirect_uri}}&response_type={{response_type}}&scope={{scope}}&state={{state}}#wechat_redirect";
	var wxH5OauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid={{appid}}&redirect_uri={{redirect_uri}}}&response_type={{response_type}}&scope={{scope}}&state={{state}}#wechat_redirect";

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
		return s.replace(new RegExp("\\{\\{" + k + "\\}\\}", "g"), v)
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
	
	function getQuery(name, isEscape) {
		var sUrl = window.location.search.substr(1);
		var r = sUrl.match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
		if(!isEscape){
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
		var r = trim(getQuery("r", true));
		var code = trim(getQuery("code", false));
		var state = getQuery("state", true);
		if(!checkNullEmpty(code) && !checkNullEmpty(r)) {
			jumpUrl = appendParamToUrl(r, "code=" + code);
			if(!checkNullEmpty(state)) {
				jumpUrl = appendParamToUrl(jumpUrl, "state=" + state);
			}
			replaceUrl(jumpUrl);
			return
		}

		var proxy_type = trim(getQuery("proxy_type", false)); // 代理方式：wxpc、wxh5
		if(checkNullEmpty(proxy_type) && checkNullEmpty(code)) {
			getId("tipsId").innerHTML = "代理方式参数proxytype不能为空";
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
		var scope = getQuery("scope", false);
		if(checkNullEmpty(scope)) {
			scope = "snsapi_base";
			if(proxy_type == 'wxpc') {
				scope = "snsapi_login";
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
		proxyInit();
	}
	
})()	
