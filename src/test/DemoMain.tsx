import React from 'react';
import {observer, Observer} from "mobx-react";
import './DemoMain.less';
import demoStore from "./DemoStore";


class MyComponent extends React.Component {

    render() {
        const {student} = demoStore;
        return (
            <div>
                <Observer>
                    {() => (
                        <div>
                            <div>id:{student.id}</div>
                            <div>name:{student.name}</div>
                            <div>age:{student.age}</div>
                            <div>city
                                <ul>
                                    <li>city-name:{student.city?.name}</li>
                                    <li>city-code:{student.city?.code}</li>
                                    <li>city-position:{student.city?.position}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </Observer>
                <button onClick={() => {
                    const {updateStudent} = demoStore;
                    updateStudent({
                        id: '1000',
                        city: {
                            name: '北京xx',
                        }
                    });
                }}>更新
                </button>
            </div>
        )
    }

}

export default observer(MyComponent);
