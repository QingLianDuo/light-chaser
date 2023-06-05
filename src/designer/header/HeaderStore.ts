import {makeAutoObservable} from "mobx";
import React from "react";
import {HeaderItemProps} from "./HeaderTypes";

class HeaderStore {
    constructor() {
        makeAutoObservable(this);
    }

    headerInfoArr: Array<HeaderItemProps> = [];
    canvasVisible: boolean = false;
    projectVisible: boolean = false;
    themeVisible: boolean = false;

    setCanvasVisible = (visible: boolean) => {
        this.canvasVisible = visible;
    }

    setProjectVisible = (visible: boolean) => {
        this.projectVisible = visible;
    }

    setThemeVisible = (visible: boolean) => {
        this.themeVisible = visible;
    }

    doInit = (headersClazz: { [key: string]: React.Component | React.FC | any } = {}) => {
        let headerInfoArr: Array<HeaderItemProps> = [];
        let clazzNames = Object.keys(headersClazz);
        if (clazzNames && clazzNames.length > 0) {
            for (let i = 0; i < clazzNames.length; i++) {
                const headerInfo = new headersClazz[clazzNames[i]]().getHeaderItemInfo();
                headerInfoArr.push(headerInfo);
            }
        }
        this.headerInfoArr = headerInfoArr.sort((a, b) => {
            const aOrder = a.order || 0, bOrder = b.order || 0;
            return aOrder - bOrder
        });
    }

}

const headerStore = new HeaderStore();
export default headerStore;
