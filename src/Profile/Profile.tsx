import React from "react";
import UtilContext from "../context/utilcontext";
import QueryManage from "../util/QueryManage";
import UserDescriptionBlock from "./UserDescriptionBlock";
import UserChart from "./UserChart";
import UtilFunction from "../util/utilfunction";
import moment from "moment-timezone";
import RecordBlockList from "../RecordQuestion/RecordBlockList";
import PageTitle from "../util/PageTitle";
import {
  SolutionOutlined,
} from '@ant-design/icons';
import CustomTab from "../util/CustomTab";
import GetStyle from "../util/getStyle";

type ProfileProps = {
  userObj: any,
};

type ProfileState = {
  targetUserObj: any,
  timeName: string,
  chartDataList: any[],
  ownQuestionObjList: any[],
  doRecordList: any[],
  doQuestionObjList: any[],
  currentTab: string,
};

const hourTimeInterval = 3600; // 3600
const timeObj = {
  recent: {dayBefore: 3, interval: hourTimeInterval},
  week: {dayBefore: 7, interval: hourTimeInterval * 24},
  month: {dayBefore: 30, interval: hourTimeInterval * 24},
  all: {dayBefore: 100, interval: hourTimeInterval * 24},
};

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: any) {
    super(props);
    this.state = {
      targetUserObj: null,
      timeName: "all",
      chartDataList: [],
      ownQuestionObjList: [],
      doRecordList: [],
      doQuestionObjList: [],
      currentTab: "doQuestion",
    }
  }
  public async componentDidMount() {
    await this.getUserData();
    this.getQuestionData();
  }
  private async getUserData() {
    const useProps: any = this.props;
    const user_id = useProps.match.params.user_id;
    const url = QueryManage.createUrl(`/user/${user_id}`);
    const {userObj} = this.props;
    const {token} = userObj;
    const getUserResult = await QueryManage.makeRequest(token, url);
    const targetUserObj = getUserResult.data.result;
    this.setState({targetUserObj});
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
  private async getQuestionData() {
    const {userObj} = this.props;
    const {targetUserObj} = this.state;
    if (targetUserObj === null) {return; }
    if (!targetUserObj) {return; }
    let {do_question_list, own_question_list, user_id, created_date} = targetUserObj;
    const {token} = userObj;
    do_question_list = UtilFunction.getUniqueList(do_question_list);
    own_question_list = UtilFunction.getUniqueList(own_question_list);
    const getDoUrl = QueryManage.createUrl(`/recordquestion/id-list`);
    const getDoObjUrl = QueryManage.createUrl(`/question/id-list/all`);
    const getOwnUrl = QueryManage.createUrl(`/question/id-list/all`);


    const getDoQuestion = await QueryManage.makeRequest(token, getDoUrl, "get", {}, {id_list: JSON.stringify(do_question_list), user_id});

    const doRecordList = UtilFunction.sortObjByTimestamp(getDoQuestion.data.result, "timestamp");
    
    const getDoQuestionObj = await QueryManage.makeRequest(token, getDoObjUrl, "get", {}, {id_list: JSON.stringify(do_question_list)});
    
    let doQuestionObjList = getDoQuestionObj.data.result;
    if (!doQuestionObjList) {return; }
    doQuestionObjList.map((questionObj: any) => UtilFunction.addMoreKeyToQuestionObj(questionObj, userObj.user_id));

    const getOwnQuestion = await QueryManage.makeRequest(token, getOwnUrl, "get", {}, {id_list: JSON.stringify(own_question_list), user_id});
    const ownQuestionObjList = UtilFunction.sortObjByTimestamp(getOwnQuestion.data.result, "created_date");

    const {timeName} = this.state;
    const endDateUnix = moment().unix();
    const startDateUnix = this.getMaxStart(endDateUnix, created_date, timeName);
    const {interval} = timeObj[timeName];

    const useDoRecordList = UtilFunction.getDeepCopy(doRecordList);
    const useOwnQuestionObjList = UtilFunction.getDeepCopy(ownQuestionObjList);

    const chartDataList = this.createChartDataList(startDateUnix, endDateUnix, interval, useDoRecordList, useOwnQuestionObjList);
    this.setState({chartDataList, doRecordList, ownQuestionObjList, doQuestionObjList});
  }
  private createChartDataList(startDateUnix: number, endDateUnix: number, interval: number, doRecordList: any[], ownQuestionObjList: any[]) {
    const chartDataList: any[] = [];
    if (!doRecordList) {return chartDataList; }
    let [totalAttempt, totalWin, totalValue, totalOwn, totalGain] = [0, 0, 0, 0, 0];
    for (let t = startDateUnix ; t < endDateUnix ; t+=interval) {
      for (let d = 0 ; d < doRecordList.length ; d++) {
        const recordObj = doRecordList[d];
        const {timestamp, value, isWinner, gain} = recordObj;
        if (!UtilFunction.isInsideTimeBlock(timestamp, t, interval)) {break; }
        totalAttempt++;
        if (isWinner) {totalWin++; }
        totalValue += value;
        if (!!gain && gain > 0) {
          totalGain += gain;
        }
        doRecordList.splice(d, 1);
        d--;
      }
      for (let o = 0 ; o < ownQuestionObjList.length ; o++) {
        const questionObj = ownQuestionObjList[o];
        const {initial_pool, created_date} = questionObj;
        if (!UtilFunction.isInsideTimeBlock(created_date, t, interval)) {break; }
        totalOwn++;
        totalValue += initial_pool;
        ownQuestionObjList.splice(o, 1);
        o--;
      }
      const chartDataObj = {timestamp: t, totalAttempt, totalWin,
        totalValue, totalOwn, totalGain};
      chartDataList.push(chartDataObj);
    }
    return chartDataList;
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
    const {targetUserObj, chartDataList, ownQuestionObjList, doRecordList,
      currentTab, doQuestionObjList} = this.state;
    const {userObj} = this.props;
    if (targetUserObj === null) {return null; }
    const style = GetStyle.formDiv(theme);
    return (
      <div style={{width: "100%", padding: 20}}>
        <PageTitle title="Profile" description="User information and question record"
          Icon={SolutionOutlined} />
        <UserDescriptionBlock targetUserObj={targetUserObj} />
        <UserChart chartDataList={chartDataList} />
        {this.getTab()}
        {UtilFunction.checkIfEmptyOrError(doRecordList) && UtilFunction.checkIfEmptyOrError(ownQuestionObjList) &&
          <div style={{padding: 10, width: "100%", height: "100%"}}>
            <div style={{width: "100%", height: "100%", ...style}}>
              <span style={{color: theme.title}}>Hided By Owner</span>
            </div>
          </div>
        }
        {currentTab === "doQuestion" && <RecordBlockList useRecordObjList={doRecordList} doQuestionObjList={doQuestionObjList} isShowQuestionTitle={true} />}
        {currentTab === "ownQuestion" && <RecordBlockList useRecordObjList={ownQuestionObjList} isViewOwnQuestion={true} isShowQuestionTitle={true} />}
      </div>
    );
  }
  private getTab() {
    const {currentTab} = this.state;
    const keyList = ["doQuestion", "ownQuestion"];
    const titleList = ["Do Question", "Own Question"];
    return (
      <CustomTab currentTab={currentTab} changeTab={this.changeTab.bind(this)}
        keyList={keyList} titleList={titleList} />
    );
  }
  private changeTab(tab: string) {
    this.setState({currentTab: tab});
  }
}

export default Profile;
