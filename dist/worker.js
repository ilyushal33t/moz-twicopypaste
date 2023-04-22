onmessage = (e) => {
    console.log("Message received from main script");
    postMessage(e);
};
