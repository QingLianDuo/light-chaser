import {Component} from 'react';
import {ThemeColors, ThemeItemType} from "../../../../designer/DesignerType";
import ThemeItem from "../theme-item/ThemeItem";
import {observer} from "mobx-react";
import themeManager from "../../../../designer/header/items/theme/ThemeManager.ts";

interface ThemeListProps {
    data?: ThemeItemType[];
    onSelected?: (data: ThemeItemType) => void;
    showOperator?: boolean;
    onDel?: (id: string) => void;
}

type ThemeListState = {
    activeId: string;
}

class ThemeList extends Component<ThemeListProps, ThemeListState> {

    state: ThemeListState = {
        activeId: '',
    }

    onDel = (id: string) => {
        const {onDel} = this.props;
        const {themeConfig, updateThemeConfig} = themeManager;
        const newThemes = themeConfig!.filter((item: ThemeItemType) => item.id !== id);
        updateThemeConfig(newThemes);
        onDel && onDel(id);
    }


    onSelected = (data: ThemeItemType) => {
        this.setState({activeId: data.id})
        const {onSelected} = this.props;
        onSelected && onSelected(data);
    }

    render() {
        const {activeId} = this.state;
        const {showOperator} = this.props;
        const {themeConfig} = themeManager;
        const themeList = [];
        for (let i = 0; i < themeConfig!.length; i++) {
            themeList.push(<ThemeItem key={i} id={themeConfig![i].id} selected={themeConfig![i].id === activeId}
                                      name={themeConfig![i].name}
                                      showOperator={showOperator}
                                      onDel={this.onDel}
                                      onSelected={this.onSelected}
                                      colors={themeConfig![i].colors as ThemeColors}/>)
        }
        return (
            <div className={'lc-theme-list'} style={{width: '100%'}}>
                {themeList}
            </div>
        );
    }
}

export default observer(ThemeList);