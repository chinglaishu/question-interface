import React from "react";
import UtilContext from "../context/utilcontext";
import {Row} from "antd";

type CustomTabProps = {
  currentTab: string,
  changeTab: (tab: string) => void,
  keyList: string[],
  titleList: string[],
};

type CustomTabState = {
  mouseOverKey: string,
};

class CustomTab extends React.Component<CustomTabProps, CustomTabState> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseOverKey: "",
    }
  }
  public render() {
    return (
      <UtilContext.UtilConsumer>
        {(utilObj: UtilObj) => {
          return this.getContent(utilObj);
        }}
      </UtilContext.UtilConsumer>
    );
  }
  private getContent(utilObj: UtilObj) {
    const {sizeObj, theme} = utilObj;
    const {keyList, titleList, currentTab, changeTab} = this.props;
    const {mouseOverKey} = this.state;
    return (
      <Row style={{width: "100%", height: "40px", color: theme.title,
        borderBottom: `2px solid ${theme.subDivider}`, marginTop: 20, fontSize: 16,
        marginBottom: 30}}>
        {keyList.map((key: string, index: number) => {
          const style = (key === currentTab)
            ? {borderBottom: `2px solid ${theme.secondary}`}
            : {};
          const color = (currentTab === key || mouseOverKey === key)
            ? theme.value : theme.subText;
          return (
            <span style={{...style, paddingRight: 5, paddingLeft: 5, marginLeft: 20, color}}
              className="hover-pointer"
              onClick={() => changeTab(key)}
              onMouseEnter={() => this.setState({mouseOverKey: key})}
              onMouseLeave={() => this.setState({mouseOverKey: ""})}>{titleList[index]}</span>
          );
        })}
      </Row>
    );
  }
}

export default CustomTab;
