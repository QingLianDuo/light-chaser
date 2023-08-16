import React, {Component} from 'react';
import './ColorMode.less';
import Select from "../lc-select/Select";
import CfgItemBorder from "../lc-config-item/CfgItemBorder";
import BaseColorPicker from "../lc-color-picker/BaseColorPicker";
import GroupColorPicker from "../lc-color-picker/GroupColorPicker";

export interface ColorModeValue {
    mode: string;
    value: string | string[];
}

export interface ColorModeProps {
    data?: ColorModeValue

    onChange?(data: ColorModeValue): void;
}

class ColorMode extends Component<ColorModeProps, ColorModeValue> {

    singleValue: string = '#fff';
    multiValue: string[] = ['#fff'];
    gradientValue: string[] = ['#fff', '#fff'];

    state: ColorModeValue = {
        value: '',
        mode: ''
    }

    constructor(props: ColorModeProps) {
        super(props);
        const {data} = props;
        this.state = {mode: data?.mode || 'single', value: data?.value || '#fff'};
    }

    modeChange = (_mode: string) => {
        let {value} = this.state;
        switch (_mode) {
            case 'single':
                value = this.singleValue;
                break;
            case 'multi':
                value = this.multiValue;
                break;
            case 'gradient':
                value = this.gradientValue;
                break;
        }
        this.setState({mode: _mode, value});
        const {onChange} = this.props;
        onChange && onChange({mode: _mode, value});
    }

    colorChange = (_value: string | string[]) => {
        const {mode} = this.state;
        this.setState({value: _value});
        const {onChange} = this.props;
        onChange && onChange({mode, value: _value});
    }

    render() {
        const {mode, value} = this.state;
        return (
            <div className={"lc-color-mode"}>
                <div className={'mode-select'} style={{width: 70}}>
                    <Select defaultValue={mode || 'single'}
                            onChange={this.modeChange}
                            options={[
                                {value: 'single', label: '单色'},
                                {value: 'multi', label: '多色'},
                                {value: 'gradient', label: '渐变'},
                            ]}/>
                </div>
                {
                    mode === 'single' && <CfgItemBorder width={'100px'}>
                        <BaseColorPicker
                            defaultValue={value as string}
                            onChange={this.colorChange}
                            style={{width: '100px', height: '15px', borderRadius: 2}}
                            showText={true}/>
                    </CfgItemBorder>
                }
                {mode === 'multi' && <GroupColorPicker onChange={this.colorChange} canAdd={true}
                                                       value={(value as string[]) || ['#00bcff']}/>}
                {mode === 'gradient' && <div style={{display: 'flex'}}>
                    <CfgItemBorder width={'100%'}>
                        <BaseColorPicker showText={true}
                                         onChange={(value) => {
                                             this.gradientValue[0] = value;
                                             this.colorChange(this.gradientValue);
                                         }}
                                         style={{width: '80px', height: '15px', borderRadius: 2}}
                                         defaultValue={(value as string[])[0]}/>
                    </CfgItemBorder>
                    <CfgItemBorder width={'100%'}>
                        <BaseColorPicker showText={true} style={{width: '80px', height: '15px', borderRadius: 2}}
                                         onChange={(value) => {
                                             this.gradientValue[1] = value;
                                             this.colorChange(this.gradientValue);
                                         }}
                                         defaultValue={(value as string[])[1]}/>
                    </CfgItemBorder>
                </div>}
            </div>
        );
    }
}

export default ColorMode;