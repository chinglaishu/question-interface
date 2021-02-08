import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Col} from "antd";
import QuestionTable from "./QuestionTable";
import QuestionCardList from "./QuestionCardList";
import QuestionConfig from "../config/questionconfig";
import CustomTab from "../util/CustomTab";

type QuestionListComponentProps = {
  isAll: boolean,
  ownerQuestionDataList: any[],
  otherQuestionDataList: any[],
  viewMethodIsTable: boolean,
  showOwnerOtherList: string[],
  otherDatapointList: string[],
  tableSettingObj: any,
};

type QuestionListComponentState = {
  currentTab: string,
};

class QuestionListComponent extends React.Component<QuestionListComponentProps, QuestionListComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentTab: "doQuestion",
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
    const {currentTab} = this.state;
    const {ownerQuestionDataList, otherQuestionDataList, otherDatapointList} = this.props;
    return (
      <div style={{color: theme.title}}>
        {this.getTab()}
        <Row>
          {currentTab === "doQuestion" &&
            <QuestionTable questionObjList={otherQuestionDataList} otherDatapointList={otherDatapointList}
              tableSettingObj={this.props.tableSettingObj} />
          }
          {currentTab === "ownQuestion" &&
            <QuestionTable questionObjList={ownerQuestionDataList} otherDatapointList={otherDatapointList}
              tableSettingObj={this.props.tableSettingObj}/>
          }
        </Row>
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

export default QuestionListComponent;
