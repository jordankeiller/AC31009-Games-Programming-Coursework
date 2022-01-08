// Decoupling Pattern: Component - reused component in all files that sends/receives events to and from the backend (i.e. the server)
// Import the client from socket.io which can be further imported into all files that require a socket connection
import { io } from "socket.io-client";
const BrowserSocket = io("http://localhost:3001");

export default BrowserSocket;
