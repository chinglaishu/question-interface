import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col} from "antd";

type LargeBlockTitleProps = {
  Icon: any,
  title: string,
  color: string,
};

type LargeBlockTitleState = {

};

class LargeBlockTitle extends React.Component<LargeBlockTitleProps, LargeBlockTitleState> {
  constructor(props: any) {
    super(props);
    this.state = {

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
    const {title, Icon, color} = this.props;
    const {sizeObj, theme} = utilObj;
    return (
      <Row style={{paddingLeft: 0, paddingTop: 0,
        marginBottom: 10}}>
        <Icon style={{fontSize: 20, color}} />
        <span style={{fontSize: 18, color: theme.value, fontWeight: 600, marginTop: -4,
          marginLeft: 6}}>{title}</span>
      </Row>
    );
  }
}

export default LargeBlockTitle;
