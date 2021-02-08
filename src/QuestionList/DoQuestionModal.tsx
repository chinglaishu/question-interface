import React from "react";
import UtilContext from "../context/utilcontext";
import {Modal, Tag, Button, Row, Select, Input, InputNumber, Descriptions} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  StarOutlined,
  UnorderedListOutlined,
  MehOutlined,
} from '@ant-design/icons';
import UtilFunction from "../util/utilfunction";
import TypeNotification from "../util/createnotification";
import QuestionConfig from "../config/questionconfig";
import QueryManage from "../util/QueryManage";
import { Link } from "react-router-dom";
import Editor from "../util/Editor";
import moment from "moment-timezone";
import "./modalStyles.css";
import LargeBlockTitle from "../util/LargeBlockTitle";
import GetStyle from "../util/getStyle";
import "../styles/selectStyles.css";

const {Option} = Select;

type DoQuestionModalProps = {
  questionObj: any,
  clickButtonNum: number,
};

type DoQuestionModalState = {
  visible: boolean,
  isShowDetail: boolean,
  answerList: string[],
  answer: any,
  value: any,
};

const noOptionDataType = "decidedByOwnerWithoutOption";
const noAnswerDataTypeList = ["vote", "decidedByOwnerWithoutOption", "decidedByOwnerWithOption"];
class DoQuestionModal extends React.Component<DoQuestionModalProps, DoQuestionModalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      isShowDetail: true,
      answerList: [],
      answer: null,
      value: null,
    }
  }
  public componentDidUpdate(prevProps: DoQuestionModalProps) {
    if (prevProps.clickButtonNum !== this.props.clickButtonNum) {
      this.setState({visible: true, answer: null, value: null});
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
    const {sizeObj, theme, userObj, getUserData} = utilObj;
    const {questionObj} = this.props;
    const {isShowDetail} = this.state;
    if (!questionObj) {return null; }
    const {description, option_list, min_choose_number, max_choose_number, question_type,
      minimum_fee, maximum_fee, correct_answer} = questionObj;
    const width = (window.innerWidth > 1000)
      ? 800 : 600;
    const isOwner = userObj.user_id === questionObj.user_id;
    const buttonType = this.getButtonType(isOwner, questionObj);
    const okButtonProps = (buttonType === "doQuestion")
      ? {}
      : {style: {display: "none"}};
    return (
      <Modal
        title={this.getTitle(theme, buttonType, questionObj.question_id)}
        visible={this.state.visible}
        onOk={() => this.clickOk(userObj.token, userObj.username, getUserData)}
        onCancel={() => this.clickCancel()}
        cancelText={"Close"}
        okText={"Submit"}
        okType={"default"}
        centered={true}
        bodyStyle={{}}
        style={{minWidth: width, padding: 40}}
        okButtonProps={okButtonProps}
        closable={false}
        wrapClassName={`modal-${theme.themeName}`}
      >
        {this.getDescription(description, theme)}
        {question_type !== noOptionDataType && this.getOption(option_list, theme)}
        {!noAnswerDataTypeList.includes(question_type) && this.getAnswer(correct_answer, theme)}
        {isShowDetail && this.getDetail(questionObj, theme)}
        {buttonType === "doQuestion" && this.getAnswerInput(question_type, option_list, max_choose_number, theme)}
        {buttonType === "doQuestion" && this.getValueInput(theme, minimum_fee, maximum_fee)}
      </Modal>
    );
  }
  private getButtonType(isOwner: boolean, item: any) {
    const {time_tag} = item;
    if (isOwner) {
      if (time_tag === "visible" || time_tag === "before visible") {
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
    return null;
  }
  private getRecordQuestionButton(question_id: any, theme: any, buttonClassName: string) {
    return (
      <Link to={`/record-question/${question_id}`}>
        <Button style={{marginLeft: 15}} icon={<BarChartOutlined />}
          className={buttonClassName}>Record</Button>
      </Link>
    );
  }
  private getEditQuestionButton(question_id: number, theme: any, buttonClassName: string) {
    return (
      <Link to={`/edit-question/${question_id}`}>
        <Button style={{marginLeft: 15}} icon={<EditOutlined />}
          className={buttonClassName}>Edit Question</Button>
      </Link>
    );
  }
  private getAnswer(correct_answer: any, theme: any) {
    return (
      <div style={{borderTop: `2px solid ${theme.divider}`, marginTop: 30, paddingTop: 30}}>
        <LargeBlockTitle Icon={MehOutlined} title={"Answer"} color={theme.info} />
        {this.getAnswerList(correct_answer, theme)}
      </div>
    );
  }
  private getAnswerList(correct_answer: any, theme: any) {
    if (!correct_answer) {return null; }
    const keyList = Object.keys(correct_answer);  
    return (
      <Descriptions colon={false} style={{width: "85%"}} title={null} column={2}>
        {keyList.map((key: any, index: number) => {
          const {answer_list, answer_type, ratio_type, parameter} = correct_answer[key];
          const labelList = ["Length", "Type", "Ratio", "Parameter"];
          const valueList = [answer_list.length, answer_type, ratio_type, parameter];
          return (
            <>
            <Descriptions.Item label={<span style={{fontSize: 18, fontWeight: 600, color: theme.value}}>{index + 1}</span>}>
            </Descriptions.Item>
            <Descriptions.Item label={null}>
            </Descriptions.Item>
            {
              labelList.map((label: string, index: number) => {
                return (
                  <Descriptions.Item label={this.getInfoLabel(theme.title, `${label}: `)}>
                    {this.getInfoText(theme.value, key, valueList[index])}
                  </Descriptions.Item>
                );
              })
            }
            </>
          );
        })}
      </Descriptions>
    );
  }
  private getValueInput(theme: any, minimum_fee: number, maximum_fee: number) {
    const style = GetStyle.formInput(theme, false);
    return (
      <div style={{marginTop: 20}}>
        <span style={{marginRight: 10}}>{`Value (min: ${minimum_fee} max: ${maximum_fee})`}</span>
        <InputNumber min={0} style={style}
          value={this.state.value}
          onChange={(value: any) => this.setState({value})} />
      </div>
    );
  }
  private getDetail(questionObj: any, theme: any) {
    return (
      <div style={{borderTop: `2px solid ${theme.divider}`, marginTop: 30, paddingTop: 30}}>
        <LargeBlockTitle Icon={StarOutlined} title={"Datail"} color={theme.info} />
        <Descriptions colon={false} style={{width: "85%"}} title={null} column={1}>
        {QuestionConfig.showDetailDataList.map((key: any) => {
          if (key === "option_list" || key === "correct_answer") {return null; }
          const label = QuestionConfig.labelRef[key];
          return (
            <Descriptions.Item label={this.getInfoLabel(theme.title, label)}>
              {this.getInfoText(theme.value, key, questionObj[key])}
            </Descriptions.Item>
          );
          // return this.getItem(label, questionObj[key], key, theme)
        })}
        </Descriptions>
      </div>
    );
  }
  private getItem(label: string, text: string, key: string, theme: any) {
    if (text === undefined) {return null; }
    if (key.includes("date")) {
      text = moment(text).format("YYYY-MM-DD HH:mm:ss");
    }
    return (
      <span style={{}}>
        {`${label}: ${text}`}
        <br />
      </span>
    )
  }
  private getAnswerInput(question_type: string, optionObj: any, choose_number: number, theme: any) {
    const haveOption = question_type !== noOptionDataType;
    const style = GetStyle.formInput(theme, false);
    return (
      <div style={{marginTop: 20, borderTop: `1px solid #00000010`, paddingTop: 20}}
        className={`form-item-${theme.themeName}`}>
        <span style={{marginRight: 10}}>Your Answer</span>
        {!haveOption && <Input value={this.state.answer}
          style={{width: 200, ...style}}
          onChange={(e: any) => {
            this.setState({answer: e.target.value})}
          } />}
        {haveOption && <Select mode={"multiple"}
          style={{ width: 200 }}
          dropdownStyle={{padding: 0}}
          onChange={(value: string[]) => this.handleSelect(value, choose_number)}
          value={this.state.answerList}>
          {this.getAnswerOptionList(optionObj, theme)}
        </Select>}
      </div>
    );
  }
  private getAnswerOptionList(optionObj: any, theme: any) {
    const keyList = Object.keys(optionObj);
    const alphabetString = UtilFunction.getAlphabetList();
    const style = GetStyle.selectOption(theme);
    return keyList.map((key: string, index: number) => {
      const text = alphabetString[index];
      const value = this.getContentOfOption(optionObj, index);
      let showText = (value === null || value === undefined)
        ? text
        : `${text} (${value})`;
      return (
        <Option style={style} value={key}>
          {showText}
        </Option>
      );
    });
  }
  private getContentOfOption(option_list: any, index: any) {
    if (!option_list) {return null; }
    const optionObj = option_list[index];
    if (!optionObj) {return null; }
    const {content} = optionObj;
    return content;
  }
  private handleSelect(answerList: string[], choose_number: number) {
    if (answerList.length > choose_number) {
      TypeNotification("error", "can not exceed choose number");
      return;
    }
    this.setState({answerList});
  }
  private getOption(option_list: any, theme: any) {
    return (
      <div style={{borderTop: `2px solid ${theme.divider}`, marginTop: 30, paddingTop: 30}}>
        {this.getOptionList(option_list, theme)}
      </div>
    );
  }
  private getOptionList(optionObj: any, theme: any) {
    if (!optionObj) {return null; }
    const keyList = Object.keys(optionObj);
    const valueList: any[] = Object.values(optionObj);
    if (keyList.length === 0) {return null; }
    return (
      <span style={{paddingTop: 20, width: "100%"}}>
        <LargeBlockTitle Icon={UnorderedListOutlined} title={"Option"} color={theme.info} />
        <Descriptions colon={false} style={{width: "50%"}} title={null} column={2}>
          {keyList.map((key: string, index: number) => {
            const alphabetString = UtilFunction.getAlphabetList();
            const {content, ratio} =  valueList[index];
            const useString = alphabetString[key];
            return (
              <>
                <Descriptions.Item label={this.getInfoLabel(theme.title, useString)}>
                  {this.getInfoText(theme.value, key, content)}
                </Descriptions.Item>
                <Descriptions.Item label={this.getInfoLabel(theme.title, `Ratio ${useString} `)}>
                  {this.getInfoText(theme.value, key, ratio.toFixed(2))}
                </Descriptions.Item>
              </>
            )
          })}
        </Descriptions>
      </span>
    );
  }
  private getInfoLabel(color: string, label: string) {
    return <span style={{color}}>{label}</span>;
  }
  private getInfoText(color: string, key: string, value: any) {
    if (key.includes("date")) {
      value = moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    return (
      <span style={{color}}>{value}</span>
    );
  }
  private getDescription(description: string, theme: any) {
    return (
      <Row style={{paddingBottom: 10}}>
        <LargeBlockTitle Icon={InfoCircleOutlined} title={"Description"} color={theme.info} />
        <Editor defaultValue={description} name={"card-description"} editable={false} />
      </Row>
    );
  }
  private getTitle(theme: any, buttonType: any, question_id: number) {
    const [text, Icon] = (this.state.isShowDetail)
      ? ["Hide Detail", EyeInvisibleOutlined]
      : ["Show Detail", EyeOutlined];
    const {questionObj} = this.props;
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <span>
        <Row style={{color: theme.value}} justify="space-between">
          <Row>
            <EditOutlined style={{color: theme.secondary, fontSize: 20,
              marginRight: 0, marginTop: 6}}/>
            <span style={{marginTop: 5, fontSize: 18, fontWeight: 600, marginLeft: 5}}>{questionObj.title}</span>
          </Row>
          <span>
            <Button icon={<Icon />} className={buttonClassName}
              onClick={() => this.setState({isShowDetail: !this.state.isShowDetail})}>
              {text}
            </Button>
            {buttonType === "editQuestion" && this.getEditQuestionButton(question_id, theme, buttonClassName)}
            {buttonType === "recordQuestion" && this.getRecordQuestionButton(question_id, theme, buttonClassName)}
          </span>
        </Row>
      </span>
    );
  }
  private getTagList(questionObj: any) {
    const {time_tag} = questionObj;
    return (
      <span style={{marginTop: 5}}>
        <Tag color={"red"}>{time_tag}</Tag>
      </span>
    );
  }
  private async clickOk(token: string, username: string, getUserData: () => void) {
    const {answer, value, answerList} = this.state;
    const {questionObj} = this.props;
    const {question_id, question_type, title} = questionObj;
    const useAnswer = (question_type === noOptionDataType) ? answer : answerList;
    if (!this.checkSumbitValid(questionObj, useAnswer, value)) {
      return;
    }
    const url = QueryManage.createUrl(`/question/submit/${question_id}`);
    const postBody = {answer: useAnswer, value, username, title};
    console.log(postBody);
    const result = await QueryManage.makeRequest(token, url, "post", postBody);
    if (!result.data) {
      TypeNotification("error", "Submit fail");
      return;
    }
    if (result.data.success) {
      TypeNotification("success", "Submit Success");
      getUserData();
      this.setState({answer: null, answerList: [], value: null, visible: false});
    } else {
      TypeNotification("error", "Submit fail");
      return;
    }
  }
  private checkSumbitValid(questionObj: any, useAnswer: any, value: any) {
    const {question_type, minimum_fee, maximum_fee, min_choose_number, max_choose_number} = questionObj;
    const isNoOption = UtilFunction.checkQuestionTypeIsNoOption(question_type);
    if (!isNoOption) {
      const answerLength = useAnswer.length;
      if (!UtilFunction.checkNumberInRange(min_choose_number, max_choose_number, answerLength)) {
        TypeNotification("error", "Choose Answer Number not in range");
        return false;
      }
    } else {
      if (useAnswer === null) {
        TypeNotification("error", "Answer can not be empty");
        return false;
      }
    }
    if (!(UtilFunction.checkNumberInRange(minimum_fee, maximum_fee, value))) {
      TypeNotification("error", "Value is not in range");
      return false;
    }
    return true;
  }
  private clickCancel() {
    this.setState({visible: false});
  }
}

export default DoQuestionModal;
