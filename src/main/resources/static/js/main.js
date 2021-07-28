function addDrawable(preDrawable)
{
    preDrawable = {'name': 'test'};

    stompClient.send("/send/add", {}, JSON.stringify(preDrawable));
}

function delDrawable(drawable)
{
    drawable = {'id': 1, 'json':{'name': 'test'}};

    stompClient.send("/send/del", {}, JSON.stringify({'id': drawable.id}));
}

$("#add-btn").click(()=>addDrawable(""));
$("#del-btn").click(()=>delDrawable(""));
