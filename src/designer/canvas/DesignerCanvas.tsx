import {MouseEvent, PureComponent} from 'react';
import {observer} from "mobx-react";
import designerStore, {DesignerStore} from "../store/DesignerStore";
import rightStore from "../right/RightStore";
import DesignerRuler from "./DesignerRuler";
import DesignerContainer from "../operate-provider/DesignerContainer";
import GroupMovable from "../operate-provider/movable/DesignerMovable";
import GroupSelectable from "../operate-provider/movable/DesignerSelectable";
import ContextMenu from "../operate-provider/right-click-menu/ContextMenu";
import HotKey from "../operate-provider/hot-key/HotKey";
import {hotkeyConfigs} from "../operate-provider/hot-key/HotKeyConfig";
import {DesignerDragScaleContainer} from "./DesignerDragScaleContainer";
import layerBuilder from "../float-configs/layer-list/LayerBuilder";
import eventOperateStore from "../operate-provider/EventOperateStore";
import LayerUtil from "../float-configs/layer-list/util/LayerUtil";

/**
 * 设计器画布
 */
class DesignerCanvas extends PureComponent<DesignerStore | any> {

    updateActive = (e: MouseEvent<HTMLDivElement>) => {
        const {targetIds} = eventOperateStore;
        const {layerConfigs} = designerStore!;
        if (targetIds.length === 0) return;
        const layerIds = LayerUtil.findTopGroupLayer(targetIds, true);
        if (layerIds.length !== 1) return;
        const layerId = layerIds[0];
        const layer = layerConfigs[layerId];
        const {activeElem, activeConfig} = rightStore;
        if (layerId === activeElem.id) return;
        activeConfig(layerId, layer.type!);
    }

    render() {
        const {layerConfigs} = designerStore!;
        return (
            <>
                <DesignerContainer>
                    <GroupSelectable>
                        <DesignerRuler>
                            <DesignerDragScaleContainer onDoubleClick={this.updateActive}>
                                <GroupMovable>
                                    {layerBuilder.buildCanvasComponents(layerConfigs)}
                                </GroupMovable>
                            </DesignerDragScaleContainer>
                        </DesignerRuler>
                    </GroupSelectable>
                </DesignerContainer>
                <ContextMenu/>
                <HotKey handlerMapping={hotkeyConfigs}/>
            </>
        );
    }
}

export default observer(DesignerCanvas);

