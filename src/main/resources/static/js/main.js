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
            ctx.fillRect(e.offsetX - 2, e.offsetY - 2, 4, 4);

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
            $(event.target).resizable("destroy");
            $(event.target).draggable("destroy");
            let id = event.target.id;
            let element = event.target.outerHTML;
            delDrawable(id);
            addDrawable(element);
        }
    });
    if(!val)layers.draggable("destroy");
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

function getDimensions(curvePointsList){
    let res = {
        width: null,
        height: null,
        top: null,
        left: null,
        offsetPoints: []
    }

    let xs = [];
    let ys = [];

    for (let i=0; i < curvePointsList.length;){
        let x = curvePointsList[i];
        let y = curvePointsList[i+1];
        i += 2;
        xs.push(x);
        ys.push(y);
    }

    let min_x = xs.reduce(function (p, v) {
        return ( p < v ? p : v );
    });
    let max_x = xs.reduce(function (p, v) {
        return ( p > v ? p : v );
    });

    let min_y = ys.reduce(function (p, v) {
        return ( p < v ? p : v );
    });
    let max_y = ys.reduce(function (p, v) {
        return ( p > v ? p : v );
    });

    res.top = min_y;
    res.height = max_y - min_y;

    res.left = min_x;
    res.width = max_x - min_x;

    for (let i=0; i < curvePointsList.length;){
        let x = curvePointsList[i];
        let y = curvePointsList[i+1];
        i += 2;
        res.offsetPoints.push(x - res.left);
        res.offsetPoints.push(y - res.top);
    }

    return res;
}

function processCurvePointsList(curvePointsList) {

    let dimensions = getDimensions(curvePointsList);

    addDrawable($("<div/>", {
            "class": "layer",
            css:{
                width: dimensions.width + "px",
                height: dimensions.height + "px",
                top: dimensions.top + "px",
                left: dimensions.left + "px"
            },
            append: $("<svg/>", {
                css:{
                    width: dimensions.width + "px",
                    height: dimensions.height + "px",
                },
                append:  $("<polyline fill=\"none\" stroke=\"black\" points='" + dimensions.offsetPoints.join(" ") + "'/>")
        })
    }
    ).prop("outerHTML"));
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
