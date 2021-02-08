import React from "react";
import UtilContext from "../context/utilcontext";
import QueryManage from "../util/QueryManage";
import UtilFunction from "../util/utilfunction";
import {Row, Button, Popover, Space, Select, InputNumber, Checkbox} from "antd";
import CustomCheckbox from "../util/CustomCheckbox";
import {
  ClockCircleOutlined,
  ProfileOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import QuestionConfig from "../config/questionconfig";
import QuestionListComponent from "./QuestionListComponent";
import PageTitle from "../util/PageTitle";

const {Option} = Select;

type QuestionListContainerProps = {
  userObj: any,
  targetUserObj: any,
};

type QuestionListContainerState = {
  ownerQuestionDataList: any[],
  otherQuestionDataList: any[],
  timeName: string,
  viewMethodIsTable: boolean,
  showOwnerOtherList: string[],
  otherDatapointList: string[],
  indeterminate: boolean,
  checkAll: boolean,
  tableSettingObj: {
    pageSize: number,
    border: boolean,
  },
};

const ownerOtherList: string[] = ["owner", "other"];
const initOtherDatapointList = ["ratio_type", "minimum_fee", "initial_pool", "add_pool_percentage"];

const initTableSettingObj = {
  pageSize: 10,
  border: true,
}

class QuestionListContainer extends React.Component<QuestionListContainerProps, QuestionListContainerState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ownerQuestionDataList: [],
      otherQuestionDataList: [],
      timeName: "all",
      viewMethodIsTable: true,
      showOwnerOtherList: ownerOtherList,
      otherDatapointList: initOtherDatapointList,
      indeterminate: false,
      checkAll: false,
      tableSettingObj: initTableSettingObj,
    }
  }
  public componentDidUpdate(prevProps: QuestionListContainerProps, prevState: QuestionListContainerState) {
    let isUpdateData = false;
    if (JSON.stringify(prevProps.userObj) !== JSON.stringify(this.props.userObj)) {
      isUpdateData = true;
    }
    if (JSON.stringify(prevProps.targetUserObj) !== JSON.stringify(this.props.targetUserObj)) {
      isUpdateData = true;
    }
    if (prevState.timeName !== this.state.timeName) {
      isUpdateData = true;
    }
    if (isUpdateData) {
      this.getData();
    }
  }
  public componentDidMount() {
    this.getData();
  }
  private getData() {
    const {targetUserObj, userObj} = this.props;
    if (targetUserObj === null) {
      this.getAllData(userObj.token);
    } else {
      this.getUserData(userObj.token);
    }
  }
  private async getAllData(token: string) {
    const {timeName} = this.state;
    const url = QueryManage.createUrl(`/question/list/${timeName}`);
    const result = await QueryManage.makeRequest(token, url);
    if (!result.data) {return; }
    if (!result.data.success) {return; }
    let questionObjList = result.data.result;
    questionObjList = questionObjList.sort((a: any, b: any) => {
      return a.question_id - b.question_id;
    })
    const [ownerQuestionDataList, otherQuestionDataList] = this.getOwnerOtherList(questionObjList);
    this.setState({ownerQuestionDataList, otherQuestionDataList});
  }
  private async getUserData(token: string) {
    const {own_question_list, do_question_list} = this.props.targetUserObj;
    const {timeName} = this.state;
    const url = QueryManage.createUrl(`/question/id-list/${timeName}`);
    const ownHeader = {idList: own_question_list};
    const doHeader = {idList: do_question_list};
    const ownQuestionResult = await QueryManage.makeRequest(token, url, "get", {}, ownHeader);
    const doQuestionResult = await QueryManage.makeRequest(token, url, "get", {}, doHeader);
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
    const {ownerQuestionDataList, otherQuestionDataList, viewMethodIsTable,
      showOwnerOtherList, otherDatapointList, tableSettingObj} = this.state;
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    const {targetUserObj} = this.props;
    const isAll = targetUserObj === null;
    return (
      <div style={{padding: 20}}>
        <PageTitle title={"Question List"} description={"Choose question and bet on it"}
          Icon={ProfileOutlined} />
        <Row style={{paddingLeft: 5}}>
          {this.getTimeSelectButton(theme, buttonClassName)}
          {this.getCheckboxButton(theme, buttonClassName)}
          {this.getTableSettingButton(theme, buttonClassName)}
        </Row>
        <QuestionListComponent isAll={isAll} ownerQuestionDataList={ownerQuestionDataList}
          otherQuestionDataList={otherQuestionDataList} viewMethodIsTable={viewMethodIsTable}
          showOwnerOtherList={showOwnerOtherList} otherDatapointList={otherDatapointList}
          tableSettingObj={tableSettingObj} />
      </div>
    );
  }
  private getTableSettingButton(theme: any, buttonClassName: string) {
    return (
      <Popover placement="bottom" content={this.getTableSettingPop()}
        trigger="click" arrowPointAtCenter style={{width: 200, maxHeight: 32, marginTop: 12}}>
        <Button style={{marginLeft: 20, marginBottom: 20, marginTop: 10}}
          className={buttonClassName}>Table Setting</Button>
      </Popover>
    );
  }
  private getTableSettingPop() {
    const {tableSettingObj} = this.state;
    const {pageSize, border} = tableSettingObj;
    return (
      <Space direction="vertical" size={10}>
        <Row align={"middle"}>
          <span>
            <OrderedListOutlined  style={{marginRight: 5, fontSize: 16}} />
            <span style={{marginRight: 10}}>Page Size</span>
          </span>
          <InputNumber value={pageSize} min={0} precision={0}
            onChange={(value: any) => {
              const useObj = JSON.parse(JSON.stringify(tableSettingObj));
              const num = Math.round(value);
              useObj.pageSize = num;
              this.setState({tableSettingObj: useObj});
            }} />
        </Row>
        <Row align={"middle"}>
          <span>
            <OrderedListOutlined  style={{marginRight: 5, fontSize: 16}} />
            <span style={{marginRight: 10}}>Border</span>
          </span>
          <Checkbox checked={border} onChange={() => {
            const useObj = JSON.parse(JSON.stringify(tableSettingObj));
            useObj.border = !useObj.border;
            this.setState({tableSettingObj: useObj});
          }}/>
        </Row>
      </Space>
    );
  }
  private getTimeSelectButton(theme: any, buttonClassName: string) {
    const {timeName} = this.state;
    const text = QuestionConfig.timeFilterRef[timeName];
    return (
      <Popover placement="bottom" content={this.getTimePopContent()}
        trigger="click" arrowPointAtCenter style={{width: 200, maxHeight: 32, marginTop: 12}}>
        <Button style={{marginLeft: 10, marginBottom: 20, marginTop: 10}}
          className={buttonClassName}>{`Time Filter(${text})`}</Button>
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
            <span style={{marginRight: 10}}>{`Time Filter`}</span>
          </span>
          <Select value={timeName} onChange={(value: string) => this.setState({timeName: value})}
            style={{width: 150}}>
            {this.getTimeOptionList()}
          </Select>
        </Row>
      </Space>
    );
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
  private changeShowOwnerOtherList(ownerOtherList: string[]) {
    this.setState({showOwnerOtherList: ownerOtherList});
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
    const otherDatapointList = QuestionConfig.questionTableColumn;
    return (
      <Space direction="vertical" size={10}>
        <Row>
          <span style={{fontSize: 16, fontWeight: 600}}>Show More Datapoint</span>
        </Row>
        <Row>
          <CustomCheckbox changeList={this.changeOtherDatapointList.bind(this)}
            allDataList={otherDatapointList} refObj={refObj}
            initialDataList={initOtherDatapointList} />
        </Row>
      </Space>
    );
  }
  private changeOtherDatapointList(otherDatapointList: any[]) {
    this.setState({otherDatapointList});
  } 
}

export default QuestionListContainer;
