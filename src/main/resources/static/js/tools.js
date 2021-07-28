const Tools = {
    MOVE: 'move',
    TEXT: 'text',
    NOTE: 'note',
    CURVE: 'curve',
    ERASER: 'eraser'
}
Object.freeze(Tools);

let activeTool;

$("#move-btn").click(() => {
    activeTool = Tools.MOVE;
    toggleMove(true);
    toggleEdit(false);
});
$("#text-btn").click(() => {
    activeTool = Tools.TEXT;
    toggleMove(false);
    toggleEdit(true);
});
$("#note-btn").click(() => {
    activeTool = Tools.NOTE;
    toggleMove(false);
    toggleEdit(true);
});
$("#curve-btn").click(() => {
    activeTool = Tools.CURVE;
    toggleMove(false);
    toggleEdit(false);
});
$("#eraser-btn").click(() => {
    activeTool = Tools.ERASER;
    toggleMove(false);
    toggleEdit(false);
});
$(".btn").click((e)=>{
    $(".btn").css("background", "#EFEFEF");
    $(e.target).css("background", "#BBB");
    isCurrentlyEditing = false;
});