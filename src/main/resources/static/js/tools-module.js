export default class Tool {
    constructor($button, onActivate=()=>{}, onDeactivate=()=>{}) {
        let tool = this;

        this.$button = $button;
        this.onDeactivate = onDeactivate;
        this.onActivate = function (e) {
            tool.onLayerClickSetter();
            tool.onLayerContainerClickSetter();

            Tool.activeTool.onDeactivate();
            Tool.activeTool = tool;

            for (let tool of Tool.tools) {
                tool.$button.css("background", "#EFEFEF");
            }
            $(tool.$button).css("background", "#BBB");
            onActivate();
        };

        this.setOnLayerClickSetter(() => {
        });
        this.setOnLayerContainerClickSetter(() => {
        });
        $button.click(this.onActivate);

        Tool.tools.push(this);
    };

    setOnLayerContainerClickSetter(onLayerContainerClick) {
        this.onLayerContainerClickSetter = function () {
            $(Tool.layerContainerQuery).off("click");
            $(Tool.layerContainerQuery).click(
                function (e) {
                    if (e.target !== this) return;
                    onLayerContainerClick(e);
                }
            );
        }
        return this;
    };

    setOnLayerClickSetter(onLayerClick) {
        this.onLayerClickSetter = function () {
            $(Tool.layerQuery).off("click");
            $(Tool.layerQuery).click(onLayerClick);
        }
        return this;
    };

};
Tool.tools = [];
Tool.activeTool = null;
Tool.init = function (layerContainerQuery, layerQuery) {
    Tool.layerContainerQuery = layerContainerQuery
    Tool.layerQuery = layerQuery;
}
Tool.activateActive = function () {
    if (Tool.activeTool)
        Tool.activeTool.onActivate();
}