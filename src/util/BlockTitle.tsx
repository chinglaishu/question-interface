import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col} from "antd";

type BlockTitleProps = {
  Icon: any,
  title: string,
  color: string,
  style?: any,
};

type BlockTitleState = {

};

class BlockTitle extends React.Component<BlockTitleProps, BlockTitleState> {
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
    const {title, Icon, color, style} = this.props;
    const {sizeObj, theme} = utilObj;
    return (
      <Row style={{paddingLeft: 0, paddingTop: 0,
        marginBottom: 15, ...style}}>
        <Icon style={{fontSize: 18, color}} />
        <span style={{fontSize: 16, fontWeight: 600, marginTop: -4,
          marginLeft: 5}}>{title}</span>
      </Row>
    );
  }
}

export default BlockTitle;
