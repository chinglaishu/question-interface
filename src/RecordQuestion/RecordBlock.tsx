import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col, Descriptions} from "antd";
import {
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";
import GetStyle from "../util/getStyle";
import moment from "moment-timezone";
import LargeBlockTitle from "../util/LargeBlockTitle";
import BlockTitle from "../util/BlockTitle";
import { Link } from "react-router-dom";
import UtilFunction from "../util/utilfunction";

type RecordBlockProps = {
  useRecordObj: any,
  questionObj: any,
  isShowQuestionTitle: boolean,
  clickOnQuestion?: (viewQuestionObj: any) => void,
};

type RecordBlockState = {

};

class RecordBlock extends React.Component<RecordBlockProps, RecordBlockState> {
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
    const {useRecordObj, isShowQuestionTitle} = this.props;
    const {value, answer, isWinner, timestamp, user_id, gain, username, title} = useRecordObj;
    const {questionObj} = this.props;

    // const answerString = (UtilFunction.checkQuestionTypeIsNoOption(this.props.questionObj.question_type))
    //   ? answer
    //  : UtilFunction.createAnswerString(answer);
    const answerString = (UtilFunction.checkIfArray(answer))
      ? UtilFunction.createAnswerString(answer)
      : answer;
    const style = GetStyle.formDiv(theme);
    const labelList = ["Value", "Answer", "Winner", "Gain", "Date"]
    const valueList = [value, answerString, isWinner, gain, timestamp]
    const titleText = (isShowQuestionTitle) ?
      `${title}` : `${username}`;
    return (
      <div style={{padding: 10, width: "100%", height: "100%"}}>
        <div style={{width: "100%", height: "100%", ...style}}>
          {this.getTitle(titleText, theme, isShowQuestionTitle, user_id)}
          <Descriptions colon={false} style={{width: "85%"}} title={null} column={1}>
            {labelList.map((label: string, index: number) => {
              if (valueList[index] === null || valueList[index] === undefined) {return null; }
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
  private getTitle(title: string, theme: any, isShowQuestionTitle: boolean, user_id: number) {
    if (!isShowQuestionTitle) {
      return (
        <Link className={`clickable-title-${theme.themeName}`} to={`/profile/${user_id}`}>
          <BlockTitle Icon={UserOutlined} color={theme.secondary} title={title} />
        </Link>
      );
    }
    return (
      <Row className={`clickable-title-${theme.themeName}`} onClick={() => (this.props.clickOnQuestion as any)(this.props.questionObj)}>
        <BlockTitle Icon={FormOutlined} color={theme.secondary} title={title} />
      </Row>
    );
  }
  private getInfoLabel(color: string, label: string) {
    return <span style={{color}}>{label}</span>;
  }
  private getInfoText(color: string, label: string, value: any) {
    if (label === "Date") {
      value = moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    if (label === "Winner") {
      value = String(value);
    }
    return (
      <span style={{color}}>{value}</span>
    );
  }
}

export default RecordBlock;
