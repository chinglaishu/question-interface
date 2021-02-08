import React from "react";
import UtilContext from "../context/utilcontext";
import QuestionListComponent from "./QuestionListComponent";
import QueryManage from "../util/QueryManage";
import {Row, Button, Popover, Space, Select} from "antd";
import CustomCheckbox from "../util/CustomCheckbox";
import {
  ClockCircleOutlined,
} from '@ant-design/icons';
import QuestionConfig from "../config/questionconfig";
import UtilFunction from "../util/utilfunction";
import moment from "moment";

const {Option} = Select;

type QuestionListContainerProps = {
  userObj: any,
};

type QuestionListContainerState = {
  ownerQuestionDataList: any[],
  otherQuestionDataList: any[],
  showExtraDataList: string[],
  showOtherDataList: string[],
  showOwnerOtherList: string[],
  indeterminate: boolean,
  checkAll: boolean,
  timeName: string,
  viewMethodIsTable: boolean,
};

const extraDataList: string[] = ["question_id", "user_id", "ratio_type", "option_list",
  "choose_number", "minimum_fee", "maximum_fee",
  "initial_pool", "other_pool", "add_pool_percentage", "total_pool"];

const otherDataList: string[] = ["attempt_number", "winner_number",
  "end_requirement", "end_requirement_value", "visible_date",
  "open_date", "close_date", "end_date"];

const ownerOtherList: string[] = ["owner", "other"];

class QuestionListContainer extends React.Component<QuestionListContainerProps, QuestionListContainerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ownerQuestionDataList: [],
      otherQuestionDataList: [],
      showExtraDataList: extraDataList,
      showOtherDataList: otherDataList,
      showOwnerOtherList: ownerOtherList,
      indeterminate: false,
      checkAll: true,
      timeName: "open",
      viewMethodIsTable: true,
    }
  }
  public componentDidUpdate(prevProps: QuestionListContainerProps, prevState: QuestionListContainerState) {
    if (JSON.stringify(prevProps.userObj) !== JSON.stringify(this.props.userObj)) {
      this.getData();
      return;
    }
    if (prevState.timeName !== this.state.timeName) {
      this.getData();
    }
  }
  public componentDidMount() {
    this.getData();
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
    const {ownerQuestionDataList, otherQuestionDataList, showExtraDataList,
      showOtherDataList, showOwnerOtherList} = this.state;
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <div style={{padding: 20}}>
        <Row>
          {this.getTimeSelectButton(theme, buttonClassName)}
          {this.getCheckboxButton(theme, buttonClassName)}
          {this.getViewMethodSelect(theme, buttonClassName)}
        </Row>
        <QuestionListComponent ownerQuestionDataList={ownerQuestionDataList}
          otherQuestionDataList={otherQuestionDataList}
          showExtraDataList={showExtraDataList}
          showOtherDataList={showOtherDataList}
          showOwnerOtherList={showOwnerOtherList} />
      </div>
    );
  }
  private async getData() {
    const {token} = this.props.userObj;
    if (!token) {return; }
    const {timeName} = this.state;
    const url = QueryManage.createUrl(`/question/list/${timeName}`);
    const result = await QueryManage.makeRequest(token, url);
    if (!result.data) {return; }
    if (!result.data.success) {return; }
    console.log(result.data.result);
    const questionObjList = result.data.result;
    const [ownerQuestionDataList, otherQuestionDataList] = this.getOwnerOtherList(questionObjList);
    this.setState({ownerQuestionDataList, otherQuestionDataList});
  }
  private getViewMethodSelect(theme: any, buttonClassName: string) {
    const {viewMethodIsTable} = this.state;
    const text = (viewMethodIsTable) ? "Show As Card" : "Show As Table";
    return (
      <Button style={{marginLeft: 20, marginTop: 10}} className={buttonClassName}
        onClick={() => this.setState({viewMethodIsTable: !viewMethodIsTable})}>
        {text}
      </Button>
    );
  }
  private getOwnerOtherList(questionObjList: any[]) {
    const ownerQuestionDataList: any[] = [];
    const otherQuestionDataList: any[] = [];
    const {user_id} = this.props.userObj;
    for (let i = 0 ; i < questionObjList.length ; i++) {
      const questionObj = UtilFunction.addMoreKeyToQuestionObj(questionObjList[i], user_id);
      // can add tag here
      if (questionObjList[i].user_id === user_id) {
        ownerQuestionDataList.push(questionObj);
      } else {
        otherQuestionDataList.push(questionObj);
      }
    }
    return [ownerQuestionDataList, otherQuestionDataList];
  }
  private getTimeSelectButton(theme: any, buttonClassName: string) {
    return (
      <Popover placement="bottom" content={this.getTimePopContent()}
        trigger="click" arrowPointAtCenter style={{width: 200, maxHeight: 32, marginTop: 12}}>
        <Button style={{marginLeft: 10, marginBottom: 20, marginTop: 10}}
          className={buttonClassName}>Time Filter</Button>
      </Popover>
    );
  }
  private getTimePopContent() {
    const {timeName} = this.state;
    const refObj = QuestionConfig.timeFilterRef;
    return (
      <Space direction="vertical" size={10}>
        <Row align={"middle"}>
          <span>
            <ClockCircleOutlined  style={{marginRight: 5, fontSize: 16}} />
            <span style={{marginRight: 10}}>Time Filter</span>
          </span>
          <Select value={timeName} onChange={(value: string) => this.setState({timeName: value})}
            style={{width: 150}}>
            {this.getTimeOptionList()}
          </Select>
        </Row>
        <Row>
          <CustomCheckbox changeList={this.changeShowOwnerOtherList.bind(this)}
            allDataList={ownerOtherList} refObj={refObj}
            initialDataList={[]} />
        </Row>
      </Space>
    );
  }
  private changeShowOwnerOtherList(value: string[]) {
    this.setState({showOwnerOtherList: value});
  }
  private getTimeOptionList() {
    const timeOptionStringList = ["visible", "open", "closed", "distributed", "all"];
    return timeOptionStringList.map((timeName: string) => {
      const text = QuestionConfig.timeFilterRef[timeName];
      return (
        <Option value={timeName}>{text}</Option>
      );
    });
  }
  private getCheckboxButton(theme: any, buttonClassName: string) {
    return (
      <Popover placement="bottom" content={this.getDataPopContent()}
        trigger="click" arrowPointAtCenter style={{width: 200, maxHeight: 32, marginTop: 12}}>
        <Button style={{marginLeft: 20, marginBottom: 20, marginTop: 10}}
          className={buttonClassName}>Show Data Filter</Button>
      </Popover>
    );
  }
  private getDataPopContent() {
    const refObj = QuestionConfig.labelRef;
    return (
      <Space direction="vertical" size={10}>
        <Row>
          <span style={{fontSize: 16, fontWeight: 600}}>Extra Data</span>
        </Row>
        <Row>
          <CustomCheckbox changeList={this.changeShowExtraDataList.bind(this)}
            allDataList={extraDataList} refObj={refObj} initialDataList={[]} />
        </Row>
        <Row>
          <span style={{fontSize: 16, fontWeight: 600}}>Other Data</span>
        </Row>
        <Row>
          <CustomCheckbox changeList={this.changeShowOtherDataList.bind(this)}
            allDataList={otherDataList} refObj={refObj} initialDataList={[]} />
        </Row>
      </Space>
    );
  }
  private changeShowExtraDataList(showExtraDataList: string[]) {
    this.setState({showExtraDataList});
  }
  private changeShowOtherDataList(showOtherDataList: string[]) {
    this.setState({showOtherDataList});
  }
}

export default QuestionListContainer;
