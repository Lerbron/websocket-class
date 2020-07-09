const status = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
}
const RECONNECT_TIMER_DURATION = 30 * 1000
const PING_TIMER_DURATION = 30 * 1000
const PONG_TIMER_DURATION = 30 * 1000
const RECONNECT_MAX_COUNT = 10

export default class WebSocketClass {
  constructor({
    url,
    pingMsg = 'ping',
    reconnectTimerDuration = RECONNECT_TIMER_DURATION,
    pingTimerDuration = PING_TIMER_DURATION,
    pongTimerDuration = PONG_TIMER_DURATION
  }) {
    this.url = url
    this.pingMsg = pingMsg
    this.instance = null
    this.status = status.CONNECTING
    this.pingTimer = null
    this.pongTimer = null
    this.reconnectTimer = null
    this.needDestroy = false
    this.isReconnecting = false
    this.pingTimerDuration = pingTimerDuration
    this.pongTimerDuration = pongTimerDuration
    this.reconnectTimerDuration = reconnectTimerDuration
    this.reconnectCount = 0

    this.create()
  }

  create() {
    if (!('WebSocket' in window)) {
      new Error('当前浏览器暂不支持不支持');
      return null
    }
    if (!this.url) {
      new Error('WebSocket url不存在')
      return null
    }

    this.instance = new WebSocket(this.url);

    this._onopen()
    this._onmessage()
    this._onclose()
    this._onerror()
  }

  reconnect() {
    if (this.needDestroy || this.isReconnecting || this.reconnectCount > RECONNECT_MAX_COUNT) return null
    clearTimeout(this.reconnectTimer)
    this.isReconnecting = true
    this.reconnectCount += 1
    this.reconnectTimer = setTimeout(() => {
      this.create()
      this.isReconnecting = false
    }, this.reconnectTimerDuration)
  }

  sendPing() {
    this.send(this.pingMsg)
  }

  _onopen() {
    this.instance.onopen = e => {
      clearTimeout(this.RECONNEC_TTIMER)
      this.status = status.OPEN;
      this.onopen && typeof this.onopen === 'function' && this.onopen(e)
    }
  }

  _onmessage() {
    this.instance.onmessage = e => {
      this.onmessage && typeof this.onmessage === 'function' && this.onmessage(e)
      this.resetPing()
      this.createPing()
    }
  }

  _onclose() {
    this.instance.onclose = e => {
      this.resetPing()
      this.onclose && typeof this.onclose === 'function' && this.onclose(e)
      this.reconnect()
    }
  }

  _onerror() {
    this.instance.onerror = e => {
      this.resetPing()
      this.onerror && typeof this.onerror === 'function' && this.onerror(e)
      this.reconnect()
    }
  }

  send(data) {
    if (this.instance.readyState === status.OPEN) {
      this.instance.send(JSON.stringify(data))
    } else if (this.instance.readyState === status.CONNECTING) {
      setTimeout(() => {
        this.instance.send(JSON.stringify(data))
      }, 1000)
    } else if (this.instance.readyState === status.CLOSED || this.instance.readyState === status.CLOSING) {
      return null
    }
  }

  destroy() {
    this.resetPing()
    this.instance.close()
    this.needDestroy = true
  }

  createPing() {
    this.pingTimer = setTimeout(() => {
      this.send(this.pingMsg)
      this.pongTimer = setTimeout(() => {
        this.instance.close()
      }, this.pongTimerDuration)
    }, this.pingTimerDuration)
  }

  resetPing() {
    clearTimeout(this.pingTimer)
    clearTimeout(this.pongTimer)
  }
}