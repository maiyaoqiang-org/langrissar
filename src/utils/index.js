// 异步加载脚本并执行代码
export function loadScript(url, callback) {
  // 检查脚本是否已经加载
  if (document.querySelector(`script[src="${url}"]`)) {
    callback();
    return;
  }

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

export function loadBot(botId, token) {
  return new Promise((resolve, reject) => {
    loadScript(
      "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/cn/index.js",
      function () {
        const cozeWebSDK = new CozeWebSDK.WebChatClient({
          type: "app",
          config: {
            bot_id: botId,
          },
          componentProps: {
            title: "Coze",
          },
          auth: {
            type: "token",
            token: token,
            onRefreshToken: function () {
              return token;
            },
          },
          ui: {
            base: {
              lang: "zh-CN",
            },
            asstBtn: {
              isNeed: false,
            },
          },
        });

        cozeWebSDK.showChatBot();
        // cozeWebSDK.hideChatBot()
        resolve(cozeWebSDK);

      }
    );
  });
}
