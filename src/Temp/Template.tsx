import React from "react";
import UtilContext from "../context/utilcontext";

type PageHeaderProps = {

};

type PageHeaderState = {

};

class PageHeader extends React.Component<PageHeaderProps, PageHeaderState> {
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
    const {sizeObj, theme} = utilObj;
    return (
      <div>
      </div>
    );
  }
}

export default PageHeader;
