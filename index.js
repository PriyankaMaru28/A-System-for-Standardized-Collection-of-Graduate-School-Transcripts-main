
const http = require("http");

// Port Environment variable
const PORT = process.env.PORT || 1000;

// Creating the node server
const SERVER = http.createServer();


// Firing up the server on selected port
SERVER.listen(PORT,()=>{
    console.log(`Server is listening to ${PORT}`)
});

SERVER.on("listening", () => {
    console.log("[Server]::LISTEN:%s", PORT);
});

// Callback function for checking connecting or error
SERVER.on("error", error => {
    throw new Error(`[Server]::ERROR:${error.message}`);
});