import React, {memo, useEffect} from "react";
import DragScaleProvider from "../../framework/drag-scale/DragScaleProvider";
import designerStore from "../store/DesignerStore";
import eventOperateStore from "../operate-provider/EventOperateStore";
import {observer} from "mobx-react";

export interface DesignerDragScaleContainerProps {
    children?: React.ReactNode;
    onDoubleClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const DesignerDragScaleContainer = memo(observer((props: DesignerDragScaleContainerProps) => {
    const {children, onDoubleClick} = props;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const {canvasConfig} = designerStore!;
    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (container && content) {
            const {setDsContentRef} = eventOperateStore;
            setDsContentRef(content)
            const dragScaleProvider = new DragScaleProvider({
                container,
                content,
                scaleCallback: (dsData) => {
                    const {scale, ratio} = dsData;
                    const {setScale, setRatio, rulerRef} = eventOperateStore;
                    setScale(scale);
                    setRatio(ratio);
                    rulerRef?.ruleWheel();
                },
                dragCallback: () => {
                    const {rulerRef} = eventOperateStore;
                    rulerRef?.ruleDrag();
                },
            });
            return () => {
                dragScaleProvider.destroy();
            }
        }
    }, []);
    return (
        <div className={'designer-ds-container'} ref={containerRef}
             style={{
                 overflow: "hidden",
                 height: window.innerHeight - 110,
                 width: window.innerWidth - 115,
                 backgroundColor: '#434343',
                 position: 'relative'
             }}>
            <div className={'designer-ds-content lc-drag-scale-provider'}
                 id={'designer-ds-content'}
                 ref={contentRef}
                 onDoubleClick={onDoubleClick}
                 style={{
                     width: canvasConfig?.width,
                     height: canvasConfig?.height,
                     background: '#1c1c1c',
                     position: 'absolute',
                 }}>
                {children}
            </div>
        </div>
    )
}))
