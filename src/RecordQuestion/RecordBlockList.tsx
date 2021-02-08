import React from "react";
import UtilContext from "../context/utilcontext";
import { Row, Pagination, Col } from "antd";
import UtilFunction from "../util/utilfunction";
import RecordBlock from "./RecordBlock";
import OwnQuestionBlock from "./OwnQuestionBlock";
import "./styles.css";
import DoQuestionModal from "../QuestionList/DoQuestionModal";

type RecordBlockListProps = {
  useRecordObjList: any[],
  isViewOwnQuestion?: boolean,
  doQuestionObjList?: any[],
  isShowQuestionTitle: boolean,
};

type RecordBlockListState = {
  currentPage: number,
  sortMethod: string,
  viewQuestionObj: any,
  clickButtonNum: number,
};

class RecordBlockList extends React.Component<RecordBlockListProps, RecordBlockListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPage: 1,
      sortMethod: "timeAscending",
      viewQuestionObj: null,
      clickButtonNum: 0,
    }
  }
  public componentDidUpdate(prevProps: RecordBlockListProps, prevState: RecordBlockListState) {
    if (JSON.stringify(prevProps.useRecordObjList) !== JSON.stringify(this.props.useRecordObjList)
      || prevState.sortMethod !== this.state.sortMethod) {

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
    const {useRecordObjList} = this.props;
    if (!useRecordObjList) {return null; }
    const keyList = Object.keys(useRecordObjList);
    if (keyList.length === 0) {return null; }
    const {viewQuestionObj, clickButtonNum} = this.state;
    return (
      <div style={{marginBottom: "40px", padding: 10, marginTop: -20}}>
        {this.getBlockList(theme)}
        {this.getPagination(theme)}
        <DoQuestionModal questionObj={viewQuestionObj} clickButtonNum={clickButtonNum} />
      </div>
    );
  }
  private clickOnQuestion(viewQuestionObj: any) {
    this.setState({viewQuestionObj, clickButtonNum: this.state.clickButtonNum + 1});
  }
  private getBlockList(theme: any) {
    const {useRecordObjList, isViewOwnQuestion, doQuestionObjList, isShowQuestionTitle} = this.props;
    const [blockNumber, span] = UtilFunction.getBlockNumberAndSpan();
    const cutList = this.getListByPage(useRecordObjList, blockNumber);
    const clickOnQuestion = this.clickOnQuestion.bind(this);
    return (
      <Row style={{width: "100%", height: "400px", marginBottom: "20px"}}>
        {cutList.map((useRecordObj: any) => {
          const useQuestionObj = this.getQuestionObjById(doQuestionObjList, useRecordObj.question_id);
          if (isViewOwnQuestion) {
            return (
              <Col span={span}>
                <OwnQuestionBlock questionObj={useRecordObj}
                  clickOnQuestion={clickOnQuestion} />
              </Col>
            )
          }
          return (
            <Col span={span}>
              <RecordBlock useRecordObj={useRecordObj} questionObj={useQuestionObj}
                isShowQuestionTitle={isShowQuestionTitle} clickOnQuestion={clickOnQuestion} />
            </Col>
          );
        })}
      </Row>
    );
  }
  private getQuestionObjById(objList: any, id: number) {
    if (!objList) {return null; }
    for (let i = 0 ; i < objList.length ; i++) {
      if (objList[i].question_id === id) {
        return objList[i];
      }
    }
  }
  private getListByPage(list: any, pageSize: number) {
    const useList = JSON.parse(JSON.stringify(list));
    let {currentPage} = this.state;
    currentPage--;
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const cutList = useList.slice(startIndex, endIndex);
    return cutList;
  }
  private getPagination(theme: any) {
    const {useRecordObjList} = this.props;
    const [blockNumber, span] = UtilFunction.getBlockNumberAndSpan();
    const pageNumber = Math.ceil(useRecordObjList.length / blockNumber);
    return (
      <Pagination className={`record-block-list-${theme.themeName}`} simple={true} current={this.state.currentPage} total={useRecordObjList.length}
        onChange={(value: any) => this.setState({currentPage: value})}
        pageSize={blockNumber} style={{color: theme.title, marginLeft: 10}} />
    );
  }
}

export default RecordBlockList;
