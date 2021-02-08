import React from "react";
import UtilContext from "../context/utilcontext";
import {Modal} from "antd";

type DoQuestionModalProps = {
  questionObj: any,
  clickButtonNum: number,
};

type DoQuestionModalState = {
  visible: boolean,
};

class DoQuestionModal extends React.Component<DoQuestionModalProps, DoQuestionModalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
    }
  }
  public componentDidUpdate(prevProps: DoQuestionModalProps) {
    if (prevProps.clickButtonNum !== this.props.clickButtonNum) {
      this.setState({visible: true});
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
      <Modal
        title={this.getTitle(theme)}
        visible={this.state.visible}
        onOk={() => this.clickOk()}
        onCancel={() => this.clickCancel()}
        centered={true}
        bodyStyle={{}}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
  private getTitle(theme: any) {
    return (
      <span>
        {"Title"}
      </span>
    )
  }
  private clickOk() {

  }
  private clickCancel() {
    this.setState({visible: false});
  }
}

export default DoQuestionModal;
