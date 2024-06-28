import {
    ChangeEvent,
    Component,
    CSSProperties,
    ForwardedRef,
    forwardRef,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import {ComponentBaseProps} from "../../../common-component/CommonTypes.ts";
import './BaseIndicatorCardComponent.less';
import layerManager from "../../../../designer/manager/LayerManager.ts";
import layerListStore from "../../../../designer/left/layer-list/LayerListStore.ts";

export interface BaseIndicatorCardComponentStyle {
    color?: string;
    fontSize?: number;
    fontWeight?: number;
    fontFamily?: string;
    alignItems?: string;
    justifyContent?: string;
    strokeWidth?: number;
    strokeColor?: string;
    letterSpacing?: number;
    lineHeight?: number;
}

export interface BaseIndicatorCardComponentProps extends ComponentBaseProps {
    style?: BaseIndicatorCardComponentStyle;
}

export interface BaseIndicatorCardComponentRef {
    updateConfig: (newConfig: BaseIndicatorCardComponentProps) => void;
    setEventHandler: (eventMap: Record<string, Function>) => void;
}

export const BaseIndicatorCardComponent = forwardRef((props: BaseIndicatorCardComponentProps, ref: ForwardedRef<BaseIndicatorCardComponentRef>) => {
    const [config, setConfig] = useState<BaseIndicatorCardComponentProps>({...props});
    const {style, data} = config;
    const [edit, setEdit] = useState(false);
    const eventHandlerMap = useRef<Record<string, Function>>({});
    const textRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        updateConfig: (newConfig) => setConfig({...newConfig}),
        setEventHandler: (eventMap) => eventHandlerMap.current = eventMap,
    }));

    const onClick = () => {
        if ('click' in eventHandlerMap.current)
            eventHandlerMap.current['click']();
    }

    const strokeStyle: CSSProperties = {
        WebkitTextStrokeWidth: style?.strokeWidth,
        WebkitTextStrokeColor: style?.strokeColor,
    }

    /**
     * 只在编辑模式下有效
     * @param e
     */
    const changeContent = (e: ChangeEvent<HTMLInputElement>) => {
        data!.staticData = e.target.value;
        layerManager.layerConfigs[config.base?.id!].name = e.target.value;
        const {layerInstances} = layerListStore;
        const layerInstance = layerInstances[config.base?.id!];
        layerInstance && (layerInstance as Component).setState({name: e.target.value});
    }

    return (
        <div onDoubleClick={() => setEdit(true)}
             ref={textRef}
             className={'base-text-component'}
             style={{...style, ...strokeStyle}}
             onKeyDown={(e) => e.stopPropagation()}
             onClick={onClick}>
            {edit ? <input
                ref={(ref) => ref?.select()}
                onChange={changeContent}
                onBlur={() => setEdit(false)}
                autoFocus={true}
                type={'text'}
                defaultValue={data?.staticData}/> : data?.staticData}
        </div>
    );
});

export default BaseIndicatorCardComponent;
