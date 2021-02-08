import React from "react";
import UtilContext from "../context/utilcontext";
import {Modal, Button, Row, Select, Input, InputNumber} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import UtilFunction from "../util/utilfunction";
import TypeNotification from "../util/createnotification";
import QuestionConfig from "../config/questionconfig";
import QueryManage from "../util/QueryManage";

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

class DoQuestionModal extends React.Component<DoQuestionModalProps, DoQuestionModalState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      isShowDetail: false,
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
    const {sizeObj, theme, userObj} = utilObj;
    const {questionObj} = this.props;
    const {isShowDetail} = this.state;
    if (!questionObj) {return null; }
    const {description, option_list, choose_number, question_type,
      minimum_fee, maximum_fee} = questionObj;
    return (
      <Modal
        title={this.getTitle(theme)}
        visible={this.state.visible}
        onOk={() => this.clickOk(userObj.token)}
        onCancel={() => this.clickCancel()}
        okText={"Submit"}
        okType={"default"}
        centered={true}
        bodyStyle={{}}
      >
        {this.getDescription(description)}
        {question_type !== noOptionDataType && this.getOption(option_list, choose_number, theme)}
        {isShowDetail && this.getDetail(questionObj, theme)}
        {this.getAnswerInput(question_type, option_list, choose_number, theme)}
        {this.getValueInput(minimum_fee, maximum_fee)}
      </Modal>
    );
  }
  private getValueInput(minimum_fee: number, maximum_fee: number) {
    return (
      <div style={{marginTop: 20}}>
        <span style={{marginRight: 10}}>{`Value (min: ${minimum_fee} max: ${maximum_fee})`}</span>
        <InputNumber min={minimum_fee} max={maximum_fee}
          value={this.state.value}
          onChange={(value: any) => this.setState({value})} />
      </div>
    );
  }
  private getDetail(questionObj: any, theme: any) {
    return (
      <div style={{borderTop: `1px solid #00000010`, marginTop: 10, paddingTop: 10}}>
        <span style={{fontSize: 15, fontWeight: 600}}>Extra Data</span>
        <br />
        {QuestionConfig.showDetailDataList.map((key: any) => {
          if (key === "choose_number" || key === "option_list") {return null; }
          const label = QuestionConfig.labelRef[key];
          return this.getItem(label, questionObj[key], theme)
        })}
      </div>
    );
  }
  private getItem(label: string, text: string, theme: any) {
    if (text === undefined) {return null; }
    return (
      <span style={{}}>
        {`${label}: ${text}`}
        <br />
      </span>
    )
  }
  private getAnswerInput(question_type: string, optionObj: any, choose_number: number, theme: any) {
    const haveOption = question_type !== noOptionDataType;
    return (
      <div style={{marginTop: 20, borderTop: `1px solid #00000010`, paddingTop: 20}}>
        <span style={{marginRight: 10}}>Your Answer</span>
        {!haveOption && <Input value={this.state.answer} style={{width: 200}}
          onChange={(e: any) => {
            this.setState({answer: e.target.value})}
          } />}
        {haveOption && <Select mode={"multiple"} style={{ width: 200 }} onChange={(value: string[]) => this.handleSelect(value, choose_number)}
          value={this.state.answerList}>
          {this.getAnswerOptionList(optionObj)}
        </Select>}
      </div>
    );
  }
  private getAnswerOptionList(optionObj: any) {
    const keyList = Object.keys(optionObj);
    const alphabetString = UtilFunction.getAlphabetList();
    return keyList.map((key: string) => {
      return (
        <Option value={key}>
          {alphabetString[key]}
        </Option>
      );
    });
  }
  private handleSelect(answerList: string[], choose_number: number) {
    if (answerList.length > choose_number) {
      TypeNotification("error", "can not exceed choose number");
      return;
    }
    this.setState({answerList});
  }
  private getOption(option_list: any, choose_number: number, theme: any) {
    return (
      <div style={{borderTop: `1px solid #00000010`, marginTop: 10, paddingTop: 10}}>
        <span>{`Choose Number: ${choose_number}`}</span>
        <br />
        {this.getOptionList(option_list, theme)}
      </div>
    );
  }
  private getOptionList(optionObj: any, theme: any) {
    const keyList = Object.keys(optionObj);
    const valueList: any[] = Object.values(optionObj);
    if (keyList.length === 0) {return null; }
    return (
      <span>
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
          )
        })}
      </span>
    );
  }
  private getDescription(description: string) {
    return (
      <Row>
        <span style={{marginTop: 10}}>
          {description}
        </span>
      </Row>
    );
  }
  private getTitle(theme: any) {
    const [text, Icon] = (this.state.isShowDetail)
      ? ["Hide Detail", EyeInvisibleOutlined]
      : ["Show Detail", EyeOutlined];
    return (
      <span>
        <EditOutlined style={{marginRight: 5}} />
        {this.props.questionObj.title}
        <Button style={{marginLeft: 20}} icon={<Icon />}
          onClick={() => this.setState({isShowDetail: !this.state.isShowDetail})}>
          {text}
        </Button>
      </span>
    );
  }
  private async clickOk(token: string) {
    const {answer, value, answerList} = this.state;
    const {questionObj} = this.props;
    const {question_id, question_type} = questionObj;
    const useValue = (question_type === noOptionDataType) ? answer : answerList;
    console.log(useValue);
    const url = QueryManage.createUrl(`/question/submit/${question_id}`);
    const result = await QueryManage.makeRequest(token, url, "post", {answer: useValue, value});
    console.log(result);
  }
  private clickCancel() {
    this.setState({visible: false});
  }
}

export default DoQuestionModal;
