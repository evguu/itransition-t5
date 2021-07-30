import Tool from "./tools-module.js";
import drawCurve from "./curve-module.js"

Tool.init(
    ".layer-container, .curve-preview, .pre-curve-preview",
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

let hasCurveStarted = false;
let curvePointsList = [];
let ctx = $(".curve-preview").get(0).getContext("2d");
new Tool($("#curve-btn"),
    function () {
        hasCurveStarted = false;
        curvePointsList = [];
        $(".pre-curve-preview").css("z-index", 100);
    },
    function () {
        $(".pre-curve-preview").css("z-index", -100);
        if (hasCurveStarted) {
            hasCurveStarted = false;
            processCurvePointsList(curvePointsList);
            curvePointsList = [];
        }
    }
).setOnLayerContainerClickSetter(function (e) {
        hasCurveStarted = !hasCurveStarted;
        if (!hasCurveStarted) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            processCurvePointsList(curvePointsList);
            curvePointsList = [];
        }
    }
).setOnLayerContainerMouseMoveSetter(function (e) {
        if (hasCurveStarted) {
            ctx.fillRect(e.offsetX - 2,e.offsetY - 2,4,4);

            curvePointsList.push(e.offsetX);
            curvePointsList.push(e.offsetY);
        }
    }
);

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
                $(event.target).resizable("enable");
                $(event.target).resizable("disable");
                let id = event.target.id;
                let element = event.target.outerHTML;

                delDrawable(id);
                addDrawable(element);
            }
        }
    );
    if (val)
        notes.resizable("enable");
    if (!val) {
        notes.resizable("destroy");
    }
}

function processCurvePointsList(curvePointsList) {
    drawCurve(ctx, curvePointsList);
    console.log(curvePointsList);
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
