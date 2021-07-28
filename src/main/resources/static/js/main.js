function renderAll(){
    $(".layer-container").html('');
    for (let drawable of drawables) {
        console.log(drawable)
        $("<div/>", {
            id: drawable.id,
            "class": "layer",
            append: drawable.element
        }).appendTo('.layer-container');
    }
    $(".layer").click(onLayerClick);
    console.log("Rerender was called.")
}

$(document).ready(() => {
    $.get("data", function (recvd) {
        drawables = recvd;
        renderAll();
    });
})

const Tools = {
    TEXT: 'text',
    NOTE: 'note',
    CURVE: 'curve',
    ERASER: 'eraser'
}
Object.freeze(Tools);

let activeTool = Tools.TEXT;

$("#text-btn").click(() => {
    activeTool = Tools.TEXT;
});
$("#note-btn").click(() => {
    activeTool = Tools.NOTE;
});
$("#curve-btn").click(() => {
    activeTool = Tools.CURVE;
});
$("#eraser-btn").click(() => {
    activeTool = Tools.ERASER;
});

function addDrawable(preDrawable) {
    stompClient.send("/send/add", {}, JSON.stringify(preDrawable));
}

function delDrawable(id) {
    stompClient.send("/send/del", {}, JSON.stringify({'id': id}));
}

function onLayerClick(e){
    let id = e.currentTarget.id;
    let element = e.currentTarget.innerHTML;
    if (activeTool === Tools.ERASER) delDrawable(id);
}
