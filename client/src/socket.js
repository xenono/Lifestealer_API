import { io } from "socket.io-client";

let socket;
const URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_URL_DEV : "");
socket = io(URL, { autoConnect: false, transports: ['websocket']});

export default socket