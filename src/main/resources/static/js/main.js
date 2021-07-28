let socket = new SockJS('/gs-guide-websocket');
let stompClient = Stomp.over(socket);
stompClient.connect({}, function (frame) {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/recv/add', function (drawable) {
        console.log("got a message!")
        console.log(JSON.parse(drawable.body));
    });
});

$("#btn").click(()=>{
    stompClient.send("/send/add", {}, JSON.stringify({'name': 'test'}));
    console.log("i work!");
});
