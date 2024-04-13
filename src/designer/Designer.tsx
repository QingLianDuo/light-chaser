import {useEffect} from 'react';
import './style/DesignerGlobalStyle.less';
import DesignerLeft from "./left/DesignerLeft";
import DesignerRight from "./right/DesignerRight";
import DesignerFooter from "./footer/DesignerFooter";
import contextMenuStore from "./operate-provider/right-click-menu/ContextMenuStore";
import eventOperateStore from "./operate-provider/EventOperateStore";
import DesignerHeader from "./header/DesignerHeader";
import DesignerCanvas from "./canvas/DesignerCanvas";
import {observer} from "mobx-react";
import Loading from "../json-schema/ui/loading/Loading";
import DesignerLoaderFactory from "./loader/DesignerLoaderFactory";
import FrameLayout from "../json-schema/ui/frame-layout/FrameLayout";
import {DesignerMode, SaveType} from "./DesignerType.ts";
import designerManager from "./manager/DesignerManager.ts";


/**
 * 绑定事件到dom元素
 */
function bindEventToDom() {
    document.addEventListener("click", clickHandler);
    document.addEventListener("contextmenu", contextMenuHandler);
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);
}

/**
 * 卸载dom元素上的事件
 */
function unbindEventToDom() {
    document.removeEventListener("click", clickHandler);
    document.removeEventListener("contextmenu", contextMenuHandler);
    document.removeEventListener("pointerdown", pointerDownHandler);
    document.removeEventListener("pointerup", pointerUpHandler);
}

/*****************事件处理*****************/
const clickHandler = (event: MouseEvent) => {
    const {visible, updateVisible} = contextMenuStore;
    if (visible && event.button === 0) {
        //这里添加异步处理的原因：必须要在操作菜单执行点击事件执行之后才能卸载dom元素，不然操作菜单的点击事件会失效。
        const tempTimer = setTimeout(() => {
            updateVisible(false);
            clearTimeout(tempTimer);
        });
    }
}

const contextMenuHandler = (event: MouseEvent) => {
    event.preventDefault();
    const {mouseDownTime, mouseUpTime, setPosition, updateVisible} = contextMenuStore;
    const {targetIds} = eventOperateStore;
    const targetArr = ['lc-comp-item', 'moveable-area', 'layer-item', 'layer-name', 'group-header', 'group-left', 'group-icon', 'group-name'];
    if (targetIds && targetIds.length > 0
        && targetArr.some((item: string) => (event.target as HTMLElement)?.classList.contains(item))
        && mouseUpTime - mouseDownTime < 200) {
        updateVisible && updateVisible(true);
        setPosition([event.clientX, event.clientY]);
    } else {
        updateVisible && updateVisible(false);
    }
}

const pointerDownHandler = () => {
    const {setMouseDownTime} = contextMenuStore;
    setMouseDownTime(Date.now());
}

const pointerUpHandler = (event: PointerEvent) => {
    const {setMouseUpTime} = contextMenuStore;
    setMouseUpTime(Date.now());
    const {setPointerTarget} = eventOperateStore;
    setPointerTarget(event.target as HTMLElement);
}


export interface DesignerProps {
    id: string;
    type: SaveType;
}

const Designer = (props: DesignerProps) => {
    const {id, type} = props;
    useEffect(() => {
        //加载设计器
        DesignerLoaderFactory.getLoader(DesignerMode.EDIT).load(id, type);
        //绑定事件到dom元素
        bindEventToDom();
        return () => unbindEventToDom();//卸载dom元素上的事件
    }, []);

    const {loaded} = designerManager;
    if (!loaded)
        return <Loading/>;
    return (
        <div style={{backgroundColor: '#1f1f1f'}}>
            <FrameLayout header={<DesignerHeader/>}
                         left={<DesignerLeft/>}
                         content={<DesignerCanvas/>}
                         right={<DesignerRight/>}
                         footer={<DesignerFooter/>}/>
        </div>
    );
}

export default observer(Designer);

