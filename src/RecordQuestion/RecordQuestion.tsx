import React from "react";
import UtilContext from "../context/utilcontext";
import QueryManage from "../util/QueryManage";
import moment from "moment-timezone";
import UtilFunction from "../util/utilfunction";
import { Row, Descriptions, Select } from "antd";
import QuestionConfig from "../config/questionconfig";
import DescriptionBlock from "./DescriptionBlock";
import RecordChart from "./RecordChart";
import RecordBlockList from "./RecordBlockList";
import {
  LineChartOutlined,
} from '@ant-design/icons';
import PageTitle from "../util/PageTitle";
import CustomTab from "../util/CustomTab";

const {Option} = Select;

type RecordQuestionProps = {
  userObj: any,
};

type RecordQuestionState = {
  questionObj: any,
  recordChartDataList: any[],
  currentTimeTab: string,
  recordObjList: any[],
};

const hourTimeInterval = 3600; // 3600
const timeObj = {
  recent: {dayBefore: 3, interval: hourTimeInterval},
  week: {dayBefore: 7, interval: hourTimeInterval * 24},
  month: {dayBefore: 30, interval: hourTimeInterval * 24},
  all: {dayBefore: 100, interval: hourTimeInterval * 24},
};

class RecordQuestion extends React.Component<RecordQuestionProps, RecordQuestionState> {
  constructor(props: any) {
    super(props);
    this.state = {
      questionObj: null,
      recordChartDataList: [],
      currentTimeTab: "recent",
      recordObjList: [],
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
  private fakeGetMaxStart(recordObjList: any[]) {
    let useTimestamp = moment().unix();
    for (let i = 0 ; i < recordObjList.length ; i++) {
      const unix = moment(recordObjList[i].timestamp).unix();
      if (unix < useTimestamp) {
        useTimestamp = unix;
      }
    }
    return useTimestamp;
  }
  private getMaxStart(endDateUnix: any, open_date: any, timeName: string) {
    const startDate = (timeName === "all")
      ? moment(open_date).unix()
      : moment(endDateUnix).add(-1 * timeObj[timeName].dayBefore, "days").startOf("day").unix();
    const checkTimeIsBeforeOpen = UtilFunction.checkTimeAIsBeforeB(moment(startDate), moment(open_date));
    if (checkTimeIsBeforeOpen) {
      return moment(open_date).unix();
    }
    return startDate;
  }
  private getMaxEnd(close_date: any) {
    const currentBeforeClose = UtilFunction.checkTimeAIsBeforeB(moment(), moment(close_date));
    if (currentBeforeClose) {return moment().unix(); }
    return moment(close_date).unix();
  }
  private async getData() {
    await this.getQuestionObj();
    this.getChartDataList();
  }
  private async getQuestionObj() {
    const useProps: any = this.props;
    const question_id = useProps.match.params.question_id;
    const url = QueryManage.createUrl(`/question/${question_id}`);
    const token: string = (useProps.userObj.token as string);
    const user_id: number = (useProps.userObj.user_id as number);
    const getQuestionObj = await QueryManage.makeRequest(token, url);
    let questionObj = UtilFunction.createOptionFieldForList(getQuestionObj.data.result);
    questionObj = UtilFunction.createAnswerFieldForList(questionObj);
    questionObj = UtilFunction.addMoreKeyToQuestionObj(questionObj, user_id);
    this.setState({questionObj});
  }
  private async getChartDataList() {
    const {questionObj} = this.state;
    const {userObj} = this.props;
    const {question_id} = questionObj;
    const {token} = userObj;
    const recordUrl = QueryManage.createUrl(`/recordquestion/${question_id}`);
    const getRecord = await QueryManage.makeRequest(token, recordUrl);
    const recordObj = getRecord.data.result;

    const {open_date, close_date, option_list} = questionObj;
    const {currentTimeTab} = this.state;

    const {interval} = timeObj[currentTimeTab];
    const initOptionObj = this.createInitOptionObj(option_list);
    const useRecordObjList = this.createUseRecordObjList(recordObj);
    const sortRecordObjList = UtilFunction.sortObjByTimestamp(useRecordObjList, "timestamp");

    const useSortRecordObjList = UtilFunction.getDeepCopy(sortRecordObjList);

    const endDateUnix = this.getMaxEnd(close_date);
    // const startDateUnix = this.getMaxStart(endDateUnix, open_date, currentTimeTab);
    const startDateUnix = this.fakeGetMaxStart(useSortRecordObjList);

    const chartDataList = this.createChartData(useSortRecordObjList, startDateUnix, endDateUnix, interval, initOptionObj);
    this.setState({recordChartDataList: chartDataList, recordObjList: sortRecordObjList});
  }
  private createUseRecordObjList(recordObj: any) {
    const userIdKeyList = Object.keys(recordObj);
    return userIdKeyList.map((userId: any) => {
      const objList = recordObj[userId];
      return objList.map((useObj: any) => {
        useObj.user_id = userId;
        return useObj;
      });
    }).flat();
  }
  private createInitOptionObj(option_list: any) {
    const initOptionObj: any = {};
    const keyList = Object.keys(option_list);
    for (let i = 0 ; i < keyList.length ; i++) {
      initOptionObj[keyList[i]] = {value: 0, frequency: 0};
    }
    return initOptionObj;
  }
  private createChartData(sortRecordObjList: any, startDateUnix: any, endDateUnix: any, interval: number, initOptionObj: any) {
    const chartDataList: any[] = [];
    let [totalAttempt, totalWinner, totalValue] = [0, 0, 0];
    for (let t = startDateUnix ; t < endDateUnix ; t+=interval) {
      for (let a = 0 ; a < sortRecordObjList.length ; a++) {
        const userRecordObj = sortRecordObjList[a];
        const {value, answer, isWinner, timestamp} = userRecordObj;
        if (!UtilFunction.isInsideTimeBlock(timestamp, t, interval)) {break; }
        totalAttempt++;
        if (isWinner) {totalWinner++; }
        totalValue += value;
        const valuePerAnswer = value / answer.length;
        for (let b = 0 ; b < answer.length ; b++) {
          if (!initOptionObj[answer[b]]) {continue; }
          initOptionObj[answer[b]].frequency++;
          initOptionObj[answer[b]].value += valuePerAnswer;
        }
        sortRecordObjList.splice(a, 1);
        a--;
      }
      const chartDataObj = {timestamp: t, totalAttempt, totalWinner,
        totalValue, optionObj: initOptionObj};
      chartDataList.push(chartDataObj);
    }
    return chartDataList;
  }
  private changeTab(tab: string) {
    this.setState({currentTimeTab: tab}, () => this.getData());
  }
  private getTimeSelect(theme: any) {
    const {currentTimeTab} = this.state;
    const keyList = ["recent", "week", "month", "all"];
    const titleList = ["Recent", "Week", "Month", "All"];
    return (
      <CustomTab currentTab={currentTimeTab} changeTab={this.changeTab.bind(this)}
        keyList={keyList} titleList={titleList} />
    );
  }
  private getSelectRow(theme: any) {
    return (
      <Row style={{marginTop: 10}}>
        {this.getTimeSelect(theme)}
      </Row>
    );
  }
  private getContent(utilObj: UtilObj) {
    const {sizeObj, theme} = utilObj;
    const {questionObj, recordChartDataList, recordObjList} = this.state;
    if (questionObj === null) {return null; }
    const title = "Question Record";
    const description = "Details and record of the question";
    return (
      <div style={{padding: 20, height: "100%", width: "100%"}}>
        <PageTitle title={title} description={description}
          Icon={LineChartOutlined} />
        <DescriptionBlock questionObj={questionObj} />
        {this.getSelectRow(theme)}
        <RecordChart recordChartDataList={recordChartDataList}  />
        <RecordBlockList useRecordObjList={recordObjList} isShowQuestionTitle={false} />
      </div>
    );
  }
}

export default RecordQuestion;
