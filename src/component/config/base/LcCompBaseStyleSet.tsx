import React, {Component} from 'react';
import './style/LCBaseConfig.less';
import {BaseStyle} from "../../../types/LcDesignerType";
import CfgGroup from "./CfgGroup";
import LcRadialButton from "../../base/LcRadialButton";
import BaseColorPicker from "../../base/BaseColorPicker";
import LCNumberInput from "../../base/LCNumberInput";

interface LcCompBaseStyleSetProps {
    baseStyle?: BaseStyle;
    updateBaseStyle?: (data: any) => void;
}

/**
 * lc组件基础样式
 */
export default class LcCompBaseStyleSet extends Component<LcCompBaseStyleSetProps> {

    paddingChanged = (padding: string) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({padding: padding});
    }

    backgroundColorChanged = (color: string | string[]) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({backgroundColor: color});
    }

    borderStyleChanged = (style: string) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({borderStyle: style});
    }

    borderWidthChanged = (width: number) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({borderWidth: `${width}px`});
    }

    borderColorChanged = (color: any) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({borderColor: color});
    }

    borderRadiusChanged = (radius: number) => {
        const {updateBaseStyle} = this.props;
        updateBaseStyle && updateBaseStyle({borderRadius: `${radius}px`});
    }

    generateBaseStyle = () => {
        const {baseStyle} = this.props;
        return [
            {
                label: '内边距',
                comp: "LcPadding",
                config: {
                    value: baseStyle?.padding,
                    onChange: this.paddingChanged,
                },
            },
            {
                label: '背景色',
                comp: "ColorPicker",
                config: {
                    value: baseStyle?.backgroundColor,
                    onChange: this.backgroundColorChanged,
                },
            },
            {
                label: '边框类型',
                comp: "LcSelect",
                config: {
                    value: baseStyle?.borderStyle,
                    onChange: this.borderStyleChanged,
                    options: [
                        {
                            content: '请选择',
                            value: 'no'
                        },
                        {
                            content: '点',
                            value: 'dotted'
                        },
                        {
                            content: '虚线',
                            value: 'dashed'
                        },
                        {
                            content: '实线',
                            value: 'solid'
                        },
                    ],
                },
            },
            {
                label: '边框颜色',
                comp: "ColorPicker",
                config: {
                    value: baseStyle?.borderColor,
                    onChange: this.borderColorChanged,
                },
            },
            {
                label: '边框宽度',
                comp: "LcNumberInput",
                config: {
                    value: baseStyle?.borderWidth?.replace('px', ''),
                    onChange: this.borderWidthChanged,
                },
            },
            {
                label: '边框圆角',
                comp: "LcNumberInput",
                config: {
                    value: baseStyle?.borderRadius?.replace('px', ''),
                    onChange: this.borderRadiusChanged,
                },
            },
        ]
    }

    render() {
        return (
            <div className={'lc-base-style'}>
                {/*<CfgGroup items={this.generateBaseStyle()}/>*/}
                <div className={'lc-cfg-item'}>
                    <div className={'item-name'}>背景</div>
                    <div className={'item-value'}>{}</div>
                </div>
                <div className={'lc-cfg-item lc-border'}>
                    <div className={'item-name'}>边框</div>
                    <div className={'item-value'}>
                        <div className={'lc-border-type'}>
                            <LcRadialButton>无</LcRadialButton>
                            <LcRadialButton>点</LcRadialButton>
                            <LcRadialButton>虚线</LcRadialButton>
                            <LcRadialButton>实线</LcRadialButton>
                        </div>
                        <div className={'lc-border-config-content'}>
                            <div className={'border-item'}>
                                <div className={'item-value'}><BaseColorPicker/></div>
                                <div className={'item-title'}>颜色</div>
                            </div>
                            <div className={'border-item'}>
                                <div className={'item-value'}><LCNumberInput value={3} width={40}/></div>
                                <div className={'item-title'}>宽度</div>
                            </div>
                            <div className={'border-item'}>
                                <div className={'item-value'}><LCNumberInput value={14} width={40}/></div>
                                <div className={'item-title'}>圆角</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
