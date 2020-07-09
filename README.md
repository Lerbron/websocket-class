WebSocketClass是基于原生的基础上扩展的心跳和重连机制进行一次封装的，是基于ES6 class的方式,进行封装。

## 安装方式
yarn add websocket-class

## api
#### 实例化
```bash
import WebsocketClass from 'websocket-class'
const ws= new WebsocketClass(options)
```
options对象有以下属性：
- url 创建socket的url地址
- pingMsg 心跳信息
- reconnectTimerDuration 重连的间隔,
- pingTimerDuration 前端心跳间隔
- pongTimerDuration 服务端断开连接后，清除socket的间隔

#### 连接成功建立后的回调
```bash
ws.onopen= e => {}
```
#### 发送消息
```bash
ws.send(data)
```
- 消息会进行JSON.stringfy()

#### 消息收到后的处理
```bash
ws.onmessage= e => {}
```
#### 连接关闭时触发的回调
```bash
ws.onclose= e => {}
```
#### 连接error时触发的回调
```bash
ws.onerror= e => {}
```
#### 手动关闭连接
```bash
ws.destroy()
```

