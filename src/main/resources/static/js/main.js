function renderAll() {
    $(".layer-container").html('');
    for (let drawable of drawables) {
        $(drawable.element).prop("id", drawable.id).appendTo('.layer-container');
    }
    $(".layer").click(onLayerClick);

    toggleMove(activeTool === Tools.MOVE);
    toggleEdit(activeTool === Tools.TEXT || activeTool === Tools.NOTE);

    console.log("Rerender was called.");
}

function addDrawable(element) {
    stompClient.send("/send/add", {}, JSON.stringify({'str': element}));
}

function delDrawable(id) {
    stompClient.send("/send/del", {}, JSON.stringify({'id': id}));
}


function toggleMove(val) {

    let layers = $(".layer");
    layers.draggable({
        cursor: "move",
        containment: ".layer-container",
        scroll: false,
        stop: function (event, ui) {
            $(event.target).resizable("disable");
            let id = event.target.id;
            let element = event.target.outerHTML;
            delDrawable(id);
            addDrawable(element);
        }
    });

    let notes = $(".post-it-note");
    notes.resizable();

    layers.draggable("option", "disabled", !val);
}

let isCurrentlyEditing = false;

function toggleEdit(val){
    let tt = $(".tools-text");
    tt.prop("contenteditable", val);
    if (val) {
        tt.on('focus', (event)=>{
            isCurrentlyEditing = true;
        })
        tt.on('blur', (event) => {
            let id = event.target.id;
            let element = event.target.outerHTML;
            delDrawable(id);
            addDrawable(element);
        });
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

function onLayerClick(e) {
    let id = e.currentTarget.id;
    let element = e.currentTarget.innerHTML;

    if (activeTool === Tools.ERASER) {
        delDrawable(id);
    }
}

$(".layer-container").click(function (e) {
    if (e.target !== this)return; // Ignore any child clicks

    if (isCurrentlyEditing){
        isCurrentlyEditing = false;
        return;
    }

    let x = e.offsetX;
    let y = e.offsetY;
    if (activeTool === Tools.TEXT){
        addDrawable($("<div/>", {
            "class": "tools-text layer",
            css: {
                position: "absolute",
                top:y+"px",
                left:x+"px"
            },
            append: "Text..."
        }).prop("outerHTML"));
    }
    if (activeTool === Tools.NOTE){
        addDrawable($("<div/>", {
            "class": "tools-text layer post-it-note",
            css: {
                position: "absolute",
                top:y+"px",
                left:x+"px",
            },
            append: "Note..."
        }).prop("outerHTML"));
    }
})