import {AbstractConfig} from "../../../interf/AbstractConfig";
import {getDefaultMenuList} from "../../../designer/right/util";
import {ClassType} from "react";
import BaseInfo from "../../../lib/config/info/BaseInfo";
import {MenuInfo} from "../../../types/MenuType";
import AntdBaseBarConfigStyle from "./AntdBaseBarConfigStyle";
import AntdBaseBarConfigData from "./AntdBaseBarConfigData";
import AntdBaseBarConfigAnimation from "./AntdBaseBarConfigAnimation";
import AntdBaseBarConfigTheme from "./AntdBaseBarConfigTheme";

export default class AntdBaseBarConfig extends AbstractConfig {
    getMenuList(): Array<MenuInfo> {
        return getDefaultMenuList();
    }

    getMenuToConfigContentMap(): { [key: string]: ClassType<any, any, any> } {
        return {
            'info': BaseInfo,
            'style': AntdBaseBarConfigStyle,
            'data': AntdBaseBarConfigData,
            'animation': AntdBaseBarConfigAnimation,
            'theme': AntdBaseBarConfigTheme
        };
    }
}