const Tools = {
    MOVE: 'move',
    TEXT: 'text',
    NOTE: 'note',
    CURVE: 'curve',
    ERASER: 'eraser'
}
Object.freeze(Tools);

let activeTool;

function renderAll() {
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
    if (activeTool === Tools.MOVE) {
        toggleMove(true);
    }
    console.log("Rerender was called.");
}

function addDrawable(element) {
    stompClient.send("/send/add", {}, JSON.stringify({'str': element}));
}

function delDrawable(id) {
    stompClient.send("/send/del", {}, JSON.stringify({'id': id}));
}

function onLayerClick(e) {
    let id = e.currentTarget.id;
    let element = e.currentTarget.innerHTML;
    if (activeTool === Tools.ERASER) {
        delDrawable(id);
    }
    if (activeTool === Tools.TEXT && $(element).hasClass("tools-text")) {
        // delDrawable(id);
        // addDrawable(element);
    }
}

function toggleMove(val) {
    if (val) {
        let layers = $(".draggable");
        layers.draggable({
            cursor: "move",
            containment: ".layer-container",
            scroll: false,
            stop: function (event, ui) {
                let id = event.target.parentNode.id;
                let element = event.target.parentNode.innerHTML;
                delDrawable(id);
                addDrawable(element);
            }
        });
        layers.draggable("option", "disabled", false);
    } else {

        let layers = $(".draggable");

        layers.draggable("option", "disabled", true);

    }
}


$(document).ready(() => {
    $.get("data", function (recvd) {
        drawables = recvd;
        renderAll();
        activeTool = Tools.MOVE;
        toggleMove(true);
    });
    Particles.init({
        selector: '.background',
        maxParticles: 50,
        connectParticles: true});
})

$("#move-btn").click(() => {
    activeTool = Tools.MOVE;
    toggleMove(true);
});
$("#text-btn").click(() => {
    activeTool = Tools.TEXT;
    toggleMove(false);
});
$("#note-btn").click(() => {
    activeTool = Tools.NOTE;
    toggleMove(false);
});
$("#curve-btn").click(() => {
    activeTool = Tools.CURVE;
    toggleMove(false);
});
$("#eraser-btn").click(() => {
    activeTool = Tools.ERASER;
    toggleMove(false);
});


$(".layer-container").click(() => {

})