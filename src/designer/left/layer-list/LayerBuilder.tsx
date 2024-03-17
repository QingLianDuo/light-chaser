import {ReactElement} from "react";
import LayerItem from "./item/LayerItem";
import LayerGroupItem from "./item/LayerGroupItem";
import eventOperateStore from "../../operate-provider/EventOperateStore";
import {cloneDeep} from "lodash";
import layerListStore from "./LayerListStore";
import ComponentContainer from "../../../framework/core/ComponentContainer";
import {ILayerItem} from "../../DesignerType";
import GroupLayer from "../../../comps/group-layer/GroupLayer";
import designerStore from "../../store/DesignerStore.ts";

export enum LayerOrder {
    ASC,
    DESC,
}

class LayerBuilder {

    /**
     * 解析函数
     */
    public parser = (layerMap: Record<string, ILayerItem>, order: LayerOrder = LayerOrder.DESC): ILayerItem[] => {
        layerMap = cloneDeep(layerMap);
        let sourceLayerArr = [];
        const {layerHeader, layerTail} = designerStore;
        if (order === LayerOrder.DESC) {
            let layer = layerMap[layerHeader!];
            if (layer) {
                sourceLayerArr.push(layer);
                while (layer?.next) {
                    layer = layerMap[layer.next];
                    sourceLayerArr.push(layer);
                }
            }
        } else {
            let layer = layerMap[layerTail!];
            if (layer) {
                sourceLayerArr.push(layer);
                while (layer?.prev) {
                    layer = layerMap[layer.prev];
                    sourceLayerArr.push(layer);
                }
            }
        }
        // 构建树结构
        const resData: ILayerItem[] = [];
        for (const layerItem of sourceLayerArr) {
            if (!layerItem?.pid) {
                // 根节点
                resData.push(layerItem);
            } else {
                // 非根节点，将其加入父节点的 children 中
                const parent = layerMap[layerItem.pid];
                if (parent) {
                    parent.children = parent.children || [];
                    parent.children.push(layerItem);
                }
            }
        }
        return resData;
    };


    /**
     * 构建图层组件
     */
    public buildLayerList = (layerMap: Record<string, ILayerItem>): ReactElement[] => {
        const res: ReactElement[] = [];
        this.parser(layerMap, LayerOrder.DESC).forEach((item: ILayerItem) => {
            res.push(this.buildLayer(item));
        });
        return res;
    }


    private buildLayer = (layer: ILayerItem): ReactElement => {
        const {type, children} = layer;
        const {targetIds} = eventOperateStore;
        const {layerInstances} = layerListStore;
        const _props = {
            key: layer.id,
            name: layer.name,
            lock: layer.lock,
            hide: layer.hide,
            compId: layer.id,
            type: layer.type,
            selected: targetIds.includes(layer.id!)
        }
        if (type === 'group') {
            //先生成子元素再包裹groupItem
            const childDomArr: ReactElement[] = [];
            children?.forEach((item: ILayerItem) => {
                childDomArr.push(this.buildLayer(item));
            });
            return <LayerGroupItem {..._props} ref={ref => layerInstances[layer.id!] = ref!}>
                {childDomArr}
            </LayerGroupItem>;
        } else {
            //直接生成layerItem
            return <LayerItem {..._props} ref={ref => layerInstances[layer.id!] = ref!}/>;
        }
    }

    private order: number = 1;

    /**
     * 构建设计器主画布组件
     * @param layerMap
     */
    public buildCanvasComponents = (layerMap: Record<string, ILayerItem>): ReactElement[] => {
        const res: ReactElement[] = [];
        this.parser(layerMap, LayerOrder.ASC).forEach((item: ILayerItem) => {
            res.push(this.buildComponents(item));
        });
        //重置排序编号
        this.order = 1;
        return res;
    }

    private buildComponents = (layer: ILayerItem): ReactElement => {
        const {type, children} = layer;
        const {layerConfigs} = designerStore;
        const targetLayer = layerConfigs[layer.id!];
        //给每个图层重新设置排序编号,用于在图层移动的过程中提供更好的体验
        if (targetLayer)
            targetLayer.order = this.order++;
        if (type === 'group') {
            //先生成子元素再包裹groupItem
            const childDomArr: ReactElement[] = [];
            children?.forEach((item: ILayerItem) => {
                childDomArr.push(this.buildComponents(item));
            });
            return <GroupLayer layer={layer} key={layer.id}>{childDomArr}</GroupLayer>;
        } else {
            return <ComponentContainer layer={layer} key={layer.id}/>;
        }
    }

}

const layerBuilder = new LayerBuilder();
export default layerBuilder;