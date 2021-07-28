let socket = new SockJS('/gs-guide-websocket');

let drawables = [];

let stompClient = Stomp.over(socket);
stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/recv/add', function (drawable) {
        drawables.push(JSON.parse(drawable.body));
        renderAll();
        // TODO: render only a new one
    });
    stompClient.subscribe('/recv/del', function (idWrapper) {
        let id = JSON.parse(idWrapper.body).id;
        drawables = drawables.filter(item => item.id !== id);
        renderAll();
        // TODO: delete only a specified one
    });
});