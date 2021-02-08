import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col, Descriptions} from "antd";
import UtilFunction from "../util/utilfunction";
import {
  FormOutlined,
} from "@ant-design/icons";
import GetStyle from "../util/getStyle";
import moment from "moment-timezone";
import LargeBlockTitle from "../util/LargeBlockTitle";
import BlockTitle from "../util/BlockTitle";

type OwnQuestionBlockProps = {
  questionObj: any,
  clickOnQuestion: (viewQuestion: any) => void,
};

type OwnQuestionBlockState = {

};

class OwnQuestionBlock extends React.Component<OwnQuestionBlockProps, OwnQuestionBlockState> {
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
    const {questionObj} = this.props;
    const style = GetStyle.formDiv(theme);
    const {question_id, title, question_type, ratio_type, category} = questionObj;
    const valueList = [question_id , question_type, ratio_type, category];
    const labelList = ["Id", "Question Type", "Ratio Type", "Category"];
    return (
      <div style={{padding: 10, width: "100%", height: "100%"}}>
        <div style={{width: "100%", height: "100%", ...style}}>
          <Row className={`clickable-title-${theme.themeName}`} onClick={() => (this.props.clickOnQuestion as any)(this.props.questionObj)}>
            <BlockTitle Icon={FormOutlined} color={theme.secondary} title={title} />
          </Row>
          <Descriptions colon={false} style={{width: "85%"}} title={null} column={1}>
            {labelList.map((label: string, index: number) => {
              return (
                <Descriptions.Item label={this.getInfoLabel(theme.title, `${label}: `)}>
                  {this.getInfoText(theme.value, label, valueList[index])}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </div>
      </div>
    );
  }
  private getInfoLabel(color: string, label: string) {
    return <span style={{color}}>{label}</span>;
  }
  private getInfoText(color: string, label: string, value: any) {
    if (label === "Date") {
      value = moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    return (
      <span style={{color}}>{value}</span>
    );
  }
}

export default OwnQuestionBlock;
