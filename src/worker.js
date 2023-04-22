onmessage = (e) => {
    try {
        e.data.args.forEach((arg, i) => {
            e.data.args[i] = JSON.parse(arg);
        })
    } catch (e) {
        console.error(e);
    }
    let response = $[e.data.method](...e.data.args)

    postMessage(response);
};

const $ = {
    splice: function (t, s, e) {
        t.splice(s, e)
    }
}
