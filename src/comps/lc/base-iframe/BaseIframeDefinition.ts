import {
    AbstractDefinition,
    BaseInfoType,
    EventInfo,
    MenuToConfigMappingType
} from "../../../framework/core/AbstractDefinition";
import {ClazzTemplate} from "../../common-component/common-types";
import {MenuInfo} from "../../../designer/right/MenuType";
import baseIframeImg from './base-iframe.png';
import {BaseIframeController} from "./BaseIframeController";
import {BaseIframeComponentProps} from "./BaseIframeComponent";
import BaseInfo from "../../common-component/base-info/BaseInfo";
import {BaseIframeStyleConfig} from "./BaseIframeConfig";
import {AppstoreFilled, HighlightFilled} from "@ant-design/icons";

export default class BaseIframeDefinition extends AbstractDefinition<BaseIframeController, BaseIframeComponentProps> {
    getBaseInfo(): BaseInfoType {
        return {
            compName: "基础iframe",
            compKey: "BaseIframe",
            categorize: "web",
        };
    }

    getChartImg(): string | null {
        return baseIframeImg;
    }

    getController(): ClazzTemplate<BaseIframeController> | null {
        return BaseIframeController;
    }

    getInitConfig(): BaseIframeComponentProps {
        return {
            base: {
                id: "",
                name: '基础iframe',
                type: 'BaseIframe',
            },
            style: {
                src: '',
            },
        };
    }

    getMenuList(): Array<MenuInfo> | null {
        return [
            {
                icon: AppstoreFilled,
                name: '基础',
                key: 'base',
            },
            {
                icon: HighlightFilled,
                name: '样式',
                key: 'style',
            }
        ];
    }

    getMenuToConfigContentMap(): MenuToConfigMappingType | null {
        return {
            base: BaseInfo,
            style: BaseIframeStyleConfig,
        };
    }

    getEventList(): EventInfo[] {
        const events = super.getEventList();
        return events.concat([
            {
                id: "load",
                name: "ifram加载完成时",
            }
        ]);
    }
}