import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col, Card, Avatar, Button, Tag} from "antd";
import QuestionConfig from "../config/questionconfig";
import moment from "moment";
import UtilFunction from "../util/utilfunction";
import {
  EditOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import DoQuestionModal from "./DoQuestionModal";
import { Link } from "react-router-dom";
import Editor from "../util/Editor";

type QuestionListComponentProps = {
  ownerQuestionDataList: any[],
  otherQuestionDataList: any[],
  showExtraDataList: string[],
  showOtherDataList: string[],
  showOwnerOtherList: string[],
};

type QuestionListComponentState = {
  doQuestionObj: any,
  clickButtonNum: number,
};

// timetype: visible, open, closed, distributed, all
// isOwner, not owner
// answer decide by owner
class QuestionListComponent extends React.Component<QuestionListComponentProps, QuestionListComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      doQuestionObj: null,
      clickButtonNum: 0,
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
    const {doQuestionObj, clickButtonNum} = this.state;
    return (
      <div>
        {this.getQuestionRow(utilObj)}
        <DoQuestionModal questionObj={doQuestionObj} clickButtonNum={clickButtonNum} />
      </div>
    );
  }
  private getQuestionRow(utilObj: any) {
    const {ownerQuestionDataList, otherQuestionDataList,
      showOwnerOtherList} = this.props;
    const isShowOwner = (showOwnerOtherList.includes("owner"));
    const isShowOther = showOwnerOtherList.includes("other");
    const {theme} = utilObj;
    return (
      <div style={{color: theme.title}}>
        {!isShowOwner && !isShowOther && this.showEmpty()}
        {isShowOwner && this.getTitleAndRow("Owner", ownerQuestionDataList, utilObj)}
        <br />
        {isShowOther && this.getTitleAndRow("Other", otherQuestionDataList, utilObj)}
      </div>
    );
  }
  private showEmpty() {
    return (
      <Row>
        <span>You have filter out all data</span>
      </Row>
    );
  }
  private getTitleAndRow(title: string, questionObjList: any[], utilObj: any) {
    return (
      <div>
        <Row>
          <span style={{fontSize: 20, fontWeight: 600, marginLeft: 10}}>{title}</span>
        </Row>
        <Row>
          {this.getQuestionColList(utilObj, questionObjList)}
        </Row>
      </div>
    );
  }
  private getQuestionColList(utilObj: any, dataList: any[]) {
    const {theme} = utilObj;
    return dataList.map((item: any) => {
      return (
        <Col xs={20} sm={16} md={12} lg={8} xl={4} style={{color: theme.title}}>
          {this.getCard(utilObj, item)}
        </Col>
      );
    });
  }
  private getCard(utilObj: any, item: any) {
    const {theme, userObj} = utilObj;
    const border = `1px solid ${theme.questionBorder}`;
    const {title, description, question_type, category} = item;
    const isOwner = item.user_id === userObj.user_id;
    const buttonType = this.getButtonType(isOwner, item);
    return (
      <Card
        title={this.getCardHeader(question_type, category, theme)}
        style={{ color: theme.title, margin: 10, backgroundColor: theme.surface, border }}
        headStyle={{padding: 0, height: "48px"}}
        bodyStyle={{paddingLeft: 12}}
      >
        {this.getTagList(isOwner, item, theme)}
        {this.getCardTitle(title, theme)}
        {false && this.getCardDescription(description, theme)}
        {this.props.showExtraDataList.length > 0 && this.getExtraData(item, theme)}
        {this.props.showOtherDataList.length > 0 && this.getOtherData(item, theme)}
        {buttonType === "doQuestion" && this.getDoQuestionButton(item, theme)}
        {buttonType === "editQuestion" && this.getEditQuestionButton(item, theme)}
        {buttonType === "recordQuestion" && this.getRecordQuestionButton(item, theme)}
      </Card>
    );
  }
  private getButtonType(isOwner: boolean, item: any) {
    const {time_tag} = item;
    if (isOwner) {
      if (time_tag === "visible") {
        return "editQuestion";
      } else {
        return "recordQuestion";
      }
    } else {
      if (time_tag === "open") {
        return "doQuestion";
      } else if (time_tag === "wait for distribute" || time_tag === "distributed") {
        return "recordQuestion";
      }
    }
  }
  private getRecordQuestionButton(item: any, theme: any) {
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <div style={{borderTop: `1px solid ${theme.divider}`, marginTop: 10, paddingTop: 20}}>
        <Link to={`record-question/${item.question_id}`}>
          <Button className={buttonClassName} icon={<BarChartOutlined />}>Record</Button>
        </Link>
      </div>
    );
  }
  private getEditQuestionButton(item: any, theme: any) {
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <div style={{borderTop: `1px solid ${theme.divider}`, marginTop: 10, paddingTop: 20}}>
        <Link to={`edit-question/${item.question_id}`}>
          <Button className={buttonClassName} icon={<EditOutlined />}>Edit Question</Button>
        </Link>
      </div>
    );
  }
  private getTagList(isOwner: boolean, questionObj: any, theme: any) {
    const {question_type, category, time_tag} = questionObj;
    return (
      <span style={{}}>
        {isOwner && <Tag style={{marginBottom: 10}} color="magenta">owner</Tag>}
        <Tag style={{marginBottom: 10}} color={"cyan"}>{question_type}</Tag>
        <Tag style={{marginBottom: 10}} color={"blue"}>{category}</Tag>
        <Tag style={{marginBottom: 10}} color={"red"}>{time_tag}</Tag>
        <br />
      </span>
    )  
  }
  private getDoQuestionButton(item: any, theme: any) {
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <div style={{borderTop: `1px solid ${theme.divider}`, marginTop: 10, paddingTop: 20}}>
        <Button className={buttonClassName} icon={<EditOutlined />}
          onClick={() => this.setState({doQuestionObj: item,
            clickButtonNum: this.state.clickButtonNum + 1})}>Do Question</Button>
      </div>
    );
  }
  private getExtraData(item: any, theme: any) {
    return (
      <div style={{borderTop: `1px solid ${theme.divider}`, marginTop: 10, paddingTop: 10}}>
        <span style={{fontSize: 15, fontWeight: 600}}>Extra Data</span>
        <br />
        {this.props.showExtraDataList.map((key: any) => {
          const label = QuestionConfig.labelRef[key];
          if (key === "option_list") {
            return this.getOptionList(item[key], theme);
          }
          return this.getItem(label, item[key], theme)
        })}
      </div>
    );
  }
  private getOtherData(item: any, theme: any) {
    return (
      <div style={{borderTop: `1px solid ${theme.divider}`, marginTop: 10, paddingTop: 10}}>
        <span style={{fontSize: 15, fontWeight: 600}}>Other Data</span>
        <br />
        {this.props.showOtherDataList.map((key: any) => {
          const label = QuestionConfig.labelRef[key];
          const text = (key.includes("date"))
            ? moment(item[key]).format("YYYY-MM-DD HH:mm:ss") 
            : item[key];
          return this.getItem(label, text, theme)
        })}
      </div>
    );
  }
  private getOptionList(optionObj: any, theme: any) {
    const keyList = Object.keys(optionObj);
    const valueList: any[] = Object.values(optionObj);
    if (keyList.length === 0) {return null; }
    return (
      <span style={{color: theme.title}}>
        {`Option List:`}
        <br />
        {keyList.map((key: string, index: number) => {
          const alphabetString = UtilFunction.getAlphabetList();
          const {content, ratio} =  valueList[index];
          const useString = alphabetString[key];
          return (
            <span>
              <span style={{marginRight: 20}}>
                {`${useString}: ${content}`}
              </span>
              <span>
                {`Ratio ${useString}: ${ratio}`}
              </span>
              <br />
            </span>
          );
        })}
      </span>
    );
  }
  private getItem(label: string, text: string, theme: any) {
    if (text === undefined) {return null; }
    return (
      <span style={{color: theme.title}}>
        {`${label}: ${text}`}
        <br />
      </span>
    )
  }
  private getCardHeader(question_type: string, category: string, theme: any) {
    return null;
    return (
      <Row style={{height: "47px", width: "100%", padding: 0}}>
        <Row style={{width: "33.3333%", color: "#00000080",
          backgroundColor: "#F1EB5B"}} align={"middle"} justify="center">
          <span>{"Owner"}</span>
        </Row>
        <Row style={{width: "33.3333%", color: theme.value,
          backgroundColor: theme.primary}} align={"middle"} justify="center">
          <span>{question_type}</span>
        </Row>
        <Row style={{width: "33.3333%", color: theme.value,
          backgroundColor: theme.secondary}} align={"middle"} justify="center">
          <span>{category}</span>
        </Row>
      </Row>
    )
  }
  private getCardTitle(text: string, theme: any) {
    return (
      <Row>
        <span style={{color: theme.value, marginTop: 10,
          fontSize: 16, fontWeight: 600}}>{text}</span>
      </Row>
    );
  }
  private getCardDescription(text: string, theme: any) {
    return (
      <Row>
        <Editor defaultValue={text} name={"card-description"} editable={false} />
      </Row>
    );
  }
}

export default QuestionListComponent;
