const protocal = {
    protocol: "json",
    version: 1
  };
  
  const MessageType = {
    /** Indicates the message is an Invocation message and implements the {@link InvocationMessage} interface. */
    Invocation: 1,
    /** Indicates the message is a StreamItem message and implements the {@link StreamItemMessage} interface. */
    StreamItem: 2,
    /** Indicates the message is a Completion message and implements the {@link CompletionMessage} interface. */
    Completion: 3,
    /** Indicates the message is a Stream Invocation message and implements the {@link StreamInvocationMessage} interface. */
    StreamInvocation: 4,
    /** Indicates the message is a Cancel Invocation message and implements the {@link CancelInvocationMessage} interface. */
    CancelInvocation: 5,
    /** Indicates the message is a Ping message and implements the {@link PingMessage} interface. */
    Ping: 6,
    /** Indicates the message is a Close message and implements the {@link CloseMessage} interface. */
    Close: 7,
  }
  
  
  export class HubConnection {
    openStatus = false;
    methods: any = {};
    negotiateResponse: any = {};
    connection: any = {};
    url = "";
    invocationId = 0;
    callbacks = {};
  
    constructor() {
      this.openStatus = false;
      this.methods = {};
      this.negotiateResponse = {};
      this.connection = {};
      this.url = "";
      this.invocationId = 0;
      this.callbacks = {};
    }
  
  
    start(url: string, queryString: any) {
      var negotiateUrl = url + "/negotiate";
      if (queryString) {
        for (var query in queryString) {
          negotiateUrl += (negotiateUrl.indexOf("?") < 0 ? "?" : "&") + (`${query}=` + encodeURIComponent(queryString[query]));
        }
      }
      ;(wx as any).request({
        url: negotiateUrl,
        method: "post",
        async: false,
        success: (res: any) => {
          this.negotiateResponse = res.data;
          this.startSocket(negotiateUrl.replace("/negotiate", ""));
        },
        fail: (res: any) => {
          console.error(`requrst ${url} error : ${res}`);
          return;
        }
      });
  
    }
  
    startSocket(url: string) {
      url += (url.indexOf("?") < 0 ? "?" : "&") + ("id=" + this.negotiateResponse.connectionId);
      url = url.replace(/^http/, "ws");
      this.url = url;
      if (this.connection != null && this.openStatus) {
        return;
      }
  
  
      this.connection = (wx as any).connectSocket({
        url: url,
        method: "get"
      })
  
      this.connection.onOpen((res: any) => {
        console.log(`websocket connectioned to ${this.url}`);
        (this as any).sendData(protocal);
        this.openStatus = true;
        this.onOpen(res);
      });
  
      this.connection.onClose((res: any) => {
        console.log(`websocket disconnection`);
        this.connection = null;
        this.openStatus = false;
        this.onClose(res);
      });
  
      this.connection.onError((res: any) => {
        console.error(`websocket error msg: error`);
        this.close({
          reason: 'error'
        });
        this.onError(res)
      });
  
      this.connection.onMessage((res: any) => this.receive(res));
    }
  
  
    on(method: string, fun: Function) {
  
      let methodName = method.toLowerCase();
      if (this.methods[methodName]) {
        this.methods[methodName].push(fun);
      } else {
        this.methods[methodName] = [fun];
  
      }
    }
  
    onOpen(data: any) {
      console.log(data)
    }
  
    onClose(msg: any) {
      console.log(msg)
    }
  
    onError(msg: any) {
      console.log(msg)
    }
  
  
    close(data: any) {
      if (data) {
        this.connection.close(data);
      } else {
        this.connection.close();
      }
  
      this.openStatus = false;
    }
  
    sendData(data: any, success: any, fail: any, complete: any) {
      this.connection.send({
        data: JSON.stringify(data) + "", //
        success: success,
        fail: fail,
        complete: complete
      });
    }
  
  
    receive(data: any) {
      if (data.data.length > 3) {
        data.data = data.data.replace('{}', "")
      }
  
      var messageDataList = data.data.split("");
  
      //循环处理服务端信息
      for (let serverMsg of messageDataList) {
        if (serverMsg) {
          var messageData = serverMsg.replace(new RegExp("", "gm"), "")
          var message = JSON.parse(messageData);
  
          switch (message.type) {
            case MessageType.Invocation:
              this.invokeClientMethod(message);
              break;
            case MessageType.StreamItem:
              break;
            case MessageType.Completion:
              var callback = (this as any).callbacks[message.invocationId];
              if (callback != null) {
                delete (this as any).callbacks[message.invocationId];
                callback(message);
              }
              break;
            case MessageType.Ping:
              // Don't care about pings
              break;
            case MessageType.Close:
              console.log("Close message received from server.");
              this.close({
                reason: "Server returned an error on close"
              });
              break;
            default:
              console.warn("Invalid message type: " + message.type);
          }
        }
      }
    }
  
  
    send(functionName: any) {
  
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
  
      ;(this as any).sendData({
        target: functionName,
        arguments: args,
        type: MessageType.Invocation,
        invocationId: this.invocationId.toString()
      });
      this.invocationId++;
    }
  
  
    invoke(functionName: any) {
      var args: Array<any> = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
  
      var _this: any = this;
      var id = this.invocationId;
      var p = new Promise(function (resolve, reject) {
  
        _this.callbacks[id] = function (message: any) {
          if (message.error) {
            reject(new Error(message.error));
          } else {
            resolve(message.result);
          }
        }
  
        _this.sendData({
          target: functionName,
          arguments: args,
          type: MessageType.Invocation,
          invocationId: _this.invocationId.toString()
        }, null, function (e: any) {
          reject(e);
        });
  
      });
      this.invocationId++;
      return p;
  
    }
  
    invokeClientMethod(message: any) {
      var methods = this.methods[message.target.toLowerCase()];
      if (methods) {
        methods.forEach((m: any) => m.apply(this, message.arguments));
        if (message.invocationId) {
          // This is not supported in v1. So we return an error to avoid blocking the server waiting for the response.
          var errormsg = "Server requested a response, which is not supported in this version of the client.";
          console.error(errormsg);
          this.close({
            reason: errormsg
          });
        }
      } else {
        console.warn(`No client method with the name '${message.target}' found.`);
      }
    }
  }
  