import AbstractDesignerController from "../../framework/core/AbstractDesignerController";
import {getModeByUrl, Mode} from "../../utils/URLUtil";
import {sendHttpRequest} from "../../utils/HttpUtil";
import AbstractController, {OperateType, UpdateOptions} from "../../framework/core/AbstractController";
import {ComponentBaseProps} from "../common-component/common-types";
import {Options, Plot} from "@antv/g2plot";
import ComponentUtil from "../../utils/ComponentUtil";
import {LoadError} from "../../lib/lc-loaderr/LoadError";
import ReactDOM from "react-dom";
import ObjectUtil from "../../utils/ObjectUtil";

export abstract class AntdBaseDesignerController<I extends Plot<any> = Plot<Options>,
    C extends ComponentBaseProps = ComponentBaseProps> extends AbstractDesignerController<I, C> {

    protected interval: NodeJS.Timer | null = null;
    //上一次数据连接状态 true：成功 false：失败
    protected lastReqState: boolean = true;
    //是否为断开后重新连接
    protected reConnect: boolean = false;

    /**
     * 默认都按照antd组件的data设置方式,如果有特殊的组件需要特殊处理，则重写此方法
     * @param data
     */
    setData(data: Object): void {
        this.config!.style!.data = data;
    }

    /**
     * 默认都读取静态数据设置中的data,如果有特殊的组件需要特殊处理，则重写此方法
     */
    getData(): Object {
        return this.config?.data?.staticData?.data;
    }

    public commonLoadData(ins: AbstractController): void {
        //设计模式下，始终从data设置中读取数据。预览模式下则根据数据源类型读取数据
        let mode = getModeByUrl();
        if (mode === Mode.VIEW) {
            //预览模式
            const {data} = ins.config!;
            const {dataSource} = data!;
            switch (dataSource) {
                case "static":
                    this.setData(this.config?.data?.staticData?.data);
                    this.update({} as C, {reRender: true, operateType: OperateType.DATA})
                    break;
                case "api":
                    const {url, method, params, header, flashFrequency = 5} = data?.apiData!;
                    this.interval = setInterval(() => {
                        sendHttpRequest(url!, method!, header!, params!).then((data: any) => {
                            if (data) {
                                this.update({data: {staticData: {data}}} as any, {
                                    reRender: true,
                                    operateType: OperateType.DATA
                                });
                                if (!this.lastReqState) {
                                    this.lastReqState = true;
                                    //如果上一次连接失败，则本次为断线重连
                                    this.reConnect = true;
                                } else {
                                    //上一次连接成功，则本次为正常连接
                                    this.reConnect = false;
                                }
                            } else
                                console.log('error')
                        }).catch(() => {
                            this.lastReqState = false;
                            this.update({} as any);
                        });
                    }, flashFrequency * 1000);
                    break;
            }
        } else {
            //编辑模式
            this.setData(this.config?.data?.staticData?.data!);
            this.update({} as C, {reRender: true, operateType: OperateType.DATA});
            return;
        }
    }

    public async commonCreate(container: HTMLElement, Clazz: new (...args: any[]) => I, config: C): Promise<this> {
        if (!this.config)
            this.config = config;
        if (!this.container)
            this.container = container;
        if (!this.instance)
            this.instance = new Clazz(container, this.config?.style! as C);
        this.commonLoadData(this);
        this.instance?.render();
        return this;
    }

    public commonUpdate(config: C, Clazz: new (...args: any[]) => I, upOp?: UpdateOptions,): void {
        if (!this.lastReqState) {
            //如果上一次（最近一次)请求失败，则展示错误提示信息
            ComponentUtil.createAndRender(this.container!, LoadError);
        } else {
            if (this.reConnect) {
                //如果为断线重连，则重新挂载组件并渲染，渲染前先清空错误信息提示组件
                ReactDOM.unmountComponentAtNode(this.container!);
                this.instance = new Clazz(this.container!, this.config?.style!);
                this.instance.render();
            } else {
                this.config = ObjectUtil.merge(this.config, config);
                upOp = upOp || {reRender: true, operateType: OperateType.OPTIONS};
                if (upOp.reRender) {
                    if (upOp.operateType === OperateType.DATA)
                        this.instance?.changeData(this.getData());
                    else
                        this.instance?.update(this.config?.style!);
                }
            }
        }
    }
}