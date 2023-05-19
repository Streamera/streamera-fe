import { getWsUrl } from '../common/utils';
import { io, Socket } from 'socket.io-client';

//dont auto connect cause react will connect it immediately upon loading
const socket = io(getWsUrl(), { autoConnect: false});

// upon connection
socket.on("connect", () => {
    console.log("connected");
});

// upon disconnection
socket.on("disconnect", (reason) => {
    console.log(`disconnected due to ${reason}`);
});

// on crud update
socket.on('update', (data: any) => {
    console.log(data);
});

// on init setup
socket.on('init', (data: any) => {
    console.log(data);
});

export default socket;