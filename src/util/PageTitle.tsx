import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col} from "antd";

type PageTitleProps = {
  Icon: any,
  title: string,
  description: string,
};

type PageTitleState = {

};

class PageTitle extends React.Component<PageTitleProps, PageTitleState> {
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
    const {title, Icon, description} = this.props;
    const {sizeObj, theme} = utilObj;
    return (
      <Row style={{height: "75px", padding: 25, paddingLeft: 0, paddingTop: 0,
        margin: 25, marginBottom: 30,
        borderBottom: `2px solid ${theme.divider}`}}>
        <Col style={{width: "50px", height: "50px"}} >
          <Icon style={{fontSize: 40, color: theme.secondary}} />
        </Col>
        <Col style={{height: "100%"}}>
          <Row style={{height: "50%"}}>
            <span style={{fontSize: 20, color: theme.value, fontWeight: 600, marginTop: -4}}>{title}</span>
          </Row>
          <Row style={{height: "50%"}}>
            <span style={{fontSize: 13, color: theme.subText, marginTop: 1}}>{description}</span>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default PageTitle;
