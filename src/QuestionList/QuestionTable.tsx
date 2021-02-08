import React from "react";
import UtilContext from "../context/utilcontext";
import {Table, Row, Col, Card, Avatar, Button, Tag, Space, Empty} from "antd";
import QuestionConfig from "../config/questionconfig";
import moment from "moment-timezone";
import UtilFunction from "../util/utilfunction";
import DoQuestionModal from "./DoQuestionModal";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import "./style.css";
import { css } from "emotion";
import TypeNotification from "../util/createnotification";

type QuestionTableProps = {
  questionObjList: any[],
  otherDatapointList: string[],
  tableSettingObj: any,
};

type QuestionTableState = {
  clickButtonNum: number,
  doQuestionObj: any,
};

class QuestionTable extends React.Component<QuestionTableProps, QuestionTableState> {
  constructor(props: any) {
    super(props);
    this.state = {
      clickButtonNum: 0,
      doQuestionObj: null,
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
    const {doQuestionObj, clickButtonNum} = this.state;
    return (
      <div style={{padding: 0, paddingRight: 50, paddingLeft: 15}}>
        {this.getTable(theme, userObj)}
        <DoQuestionModal questionObj={doQuestionObj} clickButtonNum={clickButtonNum} />
      </div>
    );
  }
  private getTable(theme: any, userObj: any) {
    const {tableSettingObj} = this.props;
    const {pageSize, border} = tableSettingObj;
    const locale = {
      emptyText: (
        <Empty style={{color: theme.title, marginTop: 50, marginBottom: 50}}/>
      )
    };
    return (
      <Table
        className={`question-list-table-${theme.themeName}`}
        locale={locale}
        style={{minWidth: "100%", marginTop: -20}}
        columns={this.getColumn(theme)}
        dataSource={this.props.questionObjList}
        tableLayout={"auto"}
        bordered={false}
        pagination={{position: ["bottomLeft"], pageSize,
        hideOnSinglePage: true, simple: true}}
        onRow={(record: any, rowIndex: any) => {
          return {
            onClick: () => {
              if (!userObj.isLogin) {
                TypeNotification("info", "please login first");
                return;
              }
              const questionObj = record;
              this.setState({doQuestionObj: questionObj, clickButtonNum: this.state.clickButtonNum + 1})
            }
          }
        }}
      />
    );
  }
  private getColumn(theme: any) {
    const typeList = ["vote", "choose", "decidedByOwnerWithOption", "decidedByOwnerWithoutOption"];
    const categoryList = ["regular", "news", "sport", "other"];
    const column = [
      {
        title: "Owner",
        dataIndex: "username",
        ellipsis: true,
        render: (text: any) => {
          return (
            <span>{text}</span>
          )
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        ellipsis: true,
        render: (text: any) => {
          return (
            <Row>
              <span>{text}</span>
            </Row>
          )
        }
      },
      {
        title: "Tag",
        dataIndex: "tag",
        render: (text: any, record: any) => {
          return this.getTagList(record);
        },
      },
      {
        title: "Type",
        dataIndex: "question_type",
        filters: this.createFilterList(typeList, true),
        onFilter: (value: any, record: any) => record.question_type === value,
      },
      {
        title: "Category",
        dataIndex: "category",
        filters: this.createFilterList(categoryList, true),
        onFilter: (value: any, record: any) => record.category === value,
      },
    ];
    const {otherDatapointList} = this.props;
    const labelRef = QuestionConfig.labelRef;
    for (let i = 0 ; i < otherDatapointList.length ; i++) {
      const columnObj: any = {
        title: labelRef[otherDatapointList[i]],
        dataIndex: otherDatapointList[i],
        sorter: (a: any, b: any) => this.sortData(a, b),
        sortDirections: ["descend", "ascend"],
        render: (value: any, record: any) => this.getTableText(otherDatapointList[i], value)
      }
      column.push(columnObj);
    }
    return column;
  }
  private getTagList(questionObj: any) {
    const {time_tag} = questionObj;
    return (
      <div style={{marginTop: 10}}>
        <Tag style={{marginBottom: 10}} color={"red"}>{time_tag}</Tag>
      </div>
    );
  }
  private getTableText(key: string, value: any) {
    if (key.includes("date")) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    if (key === "option_list") {
      const keyList = Object.keys(value);
      return `Option Number: ${keyList.length}`
    }
    if (key === "correct_answer") {
      const keyList = Object.keys(value);
      return `Correct Answer Number: ${keyList.length}`;
    }
    return value;
  }
  private createFilterList(useList: string[], needLabeRef: boolean) {
    const labelRef = QuestionConfig.labelRef;
    const filterList: any = [];
    for (let i = 0 ; i < useList.length ; i++) {
      const useObj: any = {value: useList[i]};
      const text = (needLabeRef)
        ? labelRef[useList[i]] : useList[i];
      useObj.text = text;
      filterList.push(useObj);
    }
    return filterList;
  }
  private sortData(a: any, b: any) {
    if (moment(a).isValid()) {
      return UtilFunction.checkTimeAIsBeforeB(moment(a), moment(b))
        ? 1 : -1;
    }
    const isNumber = (typeof a === "number" && typeof b === "number");
    if (isNumber) {
      return a - b;
    } else {
      return a.attr > b.attr ? 1: -1;
    }
  }
}

export default QuestionTable;
