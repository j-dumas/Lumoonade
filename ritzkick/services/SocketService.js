class SocketService {
    constructor(socket) {
      this.socket = socket;
    }

    setSocket(socket) {
        this.socket = socket
    }

    getSocket() {
        return this.socket
    }
}

export default SocketService