import Tool from "./tools-module.js";

Tool.init(
    ".layer-container",
    ".layer"
)

new Tool($("#move-btn"),
    () => {
        toggleMove(true);
        toggleResize(true);
    },
    () => {
        toggleMove(false);
        toggleResize(false);
    }
);

new Tool($("#text-btn"),
    () => {
        toggleEdit(true);
    },
    () => {
        toggleEdit(false);
    }
).setOnLayerContainerClickSetter(function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        addDrawable($("<div/>", {
            "class": "tools-text layer",
            css: {
                position: "absolute",
                top: y + "px",
                left: x + "px"
            },
            append: "Text..."
        }).prop("outerHTML"));
    }
);

new Tool($("#note-btn"),
    () => {
        toggleEdit(true);
    },
    () => {
        toggleEdit(false);
    }
).setOnLayerContainerClickSetter(function (e) {
        let x = e.offsetX;
        let y = e.offsetY;
        addDrawable($("<div/>", {
            "class": "tools-text layer post-it-note",
            css: {
                position: "absolute",
                top: y + "px",
                left: x + "px",
            },
            append: "Note..."
        }).prop("outerHTML"));
    }
);

new Tool($("#curve-btn"));

new Tool($("#eraser-btn")).setOnLayerClickSetter(function (e) {
    let id = e.currentTarget.id;
    delDrawable(id);
});

Tool.activeTool = Tool.tools[0];


function renderAll() {
    $(".layer-container").html('');
    for (let drawable of drawables) {
        $(drawable.element).prop("id", drawable.id).appendTo('.layer-container');
    }

    Tool.activateActive();

    console.log("Rerender was called.");
}

function addDrawable(element) {
    Tool.activeTool.onDeactivate();
    stompClient.send("/send/add", {}, JSON.stringify({'str': element}));
}

function delDrawable(id) {
    Tool.activeTool.onDeactivate();
    stompClient.send("/send/del", {}, JSON.stringify({'id': id}));
}


function toggleMove(val) {

    let layers = $(".layer");
    layers.draggable({
        cursor: "move",
        containment: ".layer-container",
        scroll: false,
        stop: function (event, ui) {
            $(event.target).resizable();
            $(event.target).resizable("disable");
            let id = event.target.id;
            let element = event.target.outerHTML;
            delDrawable(id);
            addDrawable(element);
        }
    });
    layers.draggable("option", "disabled", !val);
}

function toggleEdit(val) {
    let tt = $(".tools-text");
    tt.prop("contenteditable", val);
    if (val) {
        tt.on('blur', (event) => {
            let id = event.target.id;
            let element = event.target.outerHTML;
            delDrawable(id);
            addDrawable(element);
        });
    }
}

function toggleResize(val) {
    let notes = $(".post-it-note");

    notes.resizable({
            stop: function (event, ui) {
                if ($(event.target).hasClass("post-it-note"))
                    $(event.target).resizable("disable");
                let id = event.target.id;
                let element = event.target.outerHTML;
                delDrawable(id);
                addDrawable(element);
            }
        }
    );
    notes.resizable("enable");
    if (!val) {
        notes.resizable("disable");
    }
}


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

$(document).ready(() => {
    $.get("data", function (recvd) {
        drawables = recvd;
        renderAll();
    });
    Particles.init({
        selector: '.background',
        maxParticles: 50,
        connectParticles: true
    });
})
