import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Descriptions, Collapse, Input, Form, Button, Select} from "antd";
import QuestionConfig from "../config/questionconfig";
import moment from "moment-timezone";
import UtilFunction from "../util/utilfunction";
import Editor from "../util/Editor";
import GetStyle from "../util/getStyle";
import LargeBlockTitle from "../util/LargeBlockTitle";
import {
  InfoCircleOutlined,
  StarOutlined,
  SnippetsOutlined,
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import TypeNotification from "../util/createnotification";
import FormHelper from "../util/FormHelper";
import QueryManage from "../util/QueryManage";

const {Option} = Select;
const {Panel} = Collapse;

type DescriptionBlockProps = {
  questionObj: any,
};

type DescriptionBlockState = {
  descriptionPanelOpen: boolean,
  optionPanelOpen: boolean,
  answerPanelOpen: boolean,
  correct_answer_number: number,
  answerCollapseKey: any[],
  answer_editable: boolean,
};

const extraDataList: string[] = ["question_id", "question_type", "user_id", "username", "ratio_type",
  "minimum_fee", "maximum_fee",
  "initial_pool", "other_pool", "add_pool_percentage", "total_pool"];

const otherDataList: string[] = ["attempt_number", "winner_number",
  "end_requirement", "end_requirement_value", "visible_date",
  "open_date", "close_date", "end_date"];

const alphabetString = UtilFunction.getAlphabetList();
class DescriptionBlock extends React.Component<DescriptionBlockProps, DescriptionBlockState> {
  constructor(props: any) {
    super(props);
    this.state = {
      descriptionPanelOpen: false,
      optionPanelOpen: false,
      answerPanelOpen: false,
      correct_answer_number: 0,
      answerCollapseKey: [],
      answer_editable: true,
    }
  }
  public componentDidMount() {
    const {questionObj} = this.props;
    const {correct_answer_number} = questionObj;
    this.setState({correct_answer_number});
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
    const style = GetStyle.formDiv(theme);
    const {title, description, user_id} = questionObj;
    const isOwner = (userObj.user_id === user_id);
    return (
      <div style={{padding: 20}}>
        <div style={{width: "100%", ...style}}>
          <Row style={{color: theme.value, marginBottom: 10}}>
            <LargeBlockTitle Icon={SnippetsOutlined}
              title={title} color={theme.secondary} />
          </Row>
          {this.getDescription(description, theme)}
          {this.getOptionList(questionObj, theme)}
          {isOwner && this.getCorrectAnswerButtonAndList(theme, userObj)}
          {!isOwner && this.getCorrectAnswerListReadOnly(questionObj, theme)}
          <Row style={{color: theme.value, marginTop: 20}}>
            <LargeBlockTitle Icon={StarOutlined}
              title={"Info"} color={theme.info} />
          </Row>
          {this.getMoreData(questionObj, extraDataList, theme)}
          <Row style={{color: theme.value, marginTop: 10}}>
            <LargeBlockTitle Icon={InfoCircleOutlined}
              title={"More Info"} color={theme.info} />
          </Row>
          {this.getMoreData(questionObj, otherDataList, theme)}
        </div>
      </div>
    );
  }
  private getMoreData(questionObj: any, columnList: string[], theme: any) {
    return (
      <Descriptions colon={false} style={{marginTop: 0}}
        column={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 6}} title={null}>
        {columnList.map((key: string) => {
          const label = QuestionConfig.labelRef[key];
          const value = QuestionConfig.checkValueHaveRef(questionObj[key]);
          return this.getDescriptionItem(theme, key, label, value);
        })}
      </Descriptions>
    );
  }

  private getCorrectAnswerButtonAndList(theme: any, userObj: any) {
    const useList = UtilFunction.createList(this.state.correct_answer_number);
    const style = GetStyle.formInput(theme, false);
    return (
      <Collapse style={{marginTop: 20, marginBottom: 40}}
        ghost={true}
        onChange={(key: any) => {
          this.setState({answerCollapseKey: key});
        }}>
        <Panel showArrow={false} header={this.getCorrectHeader(theme, useList.length)} key="answer-panel"
          style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          <Form onFinish={(value: any) => this.handleSaveAnswer(userObj.token, value)}>
            {this.getCorrectAnswerButton(theme)}
            {this.getCorrectAnswerList(useList, theme)}
            {this.getSaveButton(theme)}
          </Form>
        </Panel>
      </Collapse>
    );
  }
  private getSaveButton(theme: any) {
    return (
      <Button htmlType="submit" className={`button-${theme.themeName}`}>Save</Button>
    )
  }
  private getCorrectHeader(theme: any, useNum: number) {
    const isCollapsed = (this.state.answerCollapseKey.includes("answer-panel"));
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.value}}>
        <Icon style={{marginRight: 10}} />
        <span>
          {`Answer List (${useNum})`}
        </span>
      </span>
    );
  }
  private getCorrectAnswerButton(theme: any) {
    const style = {marginRight: 10};
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <Form.Item initialValue={null}
        name={`answer_button`}>
        <Button style={style} icon={<PlusOutlined />} className={buttonClassName}
          onClick={() => this.addAnswer()}>
          Plus
        </Button>
        <Button style={style} icon={<MinusOutlined />} className={buttonClassName}
          onClick={() => this.minusAnswer()}>
          Minus
        </Button>
      </Form.Item>
    );
  }
  private addAnswer() {
    let correct_answer_number = this.state.correct_answer_number + 1;
    if (correct_answer_number > 10) {
      TypeNotification("error", "Max correct answer is 10");
      return;
    }
    this.setState({correct_answer_number});
  }
  private minusAnswer() {
    let correct_answer_number = this.state.correct_answer_number - 1;
    if (correct_answer_number < 0) {
      TypeNotification("error", "Min answer number is 0");
      return;
    }
    this.setState({correct_answer_number});
  }
  private itemDefaultValue(name: string) {
    return this.handleTypeValue(name, this.props.questionObj[name]);
  }
  private handleTypeValue(name: string, value: any) {
    if (name.includes("is_")) {
      return (!!value);
    }
    if (name.includes("date")) {
      return moment(value);
    }
    return value;
  }
  private getCorrectAnswerList(useList: number[], theme: any) {
    const {questionObj} = this.props;
    const {question_type} = questionObj;
    const answer_type_limit = ["not_follow_order", "follow_order"];
    const ratio_type_limit = ["add_all", "add_all_time_num", "time_all", "time_all_time_num", "fixed"]; // add all, add all time num, time all, time all time num, fixed
    const isNoOption = UtilFunction.checkQuestionTypeIsNoOption(question_type);
    const answerTopBorder = `2px solid ${theme.divider}`;
    return useList.map((useNum: number, index: number) => {
      const name = `answer_${useNum}`;
      let initialValue = this.itemDefaultValue(name);
      if (initialValue === null) {initialValue = []; }
      const label = `Answer`;
      const tName =  `answer_${useNum}_type`;
      const tLabel = `Answer Type`;
      const rName =  `answer_${useNum}_ratio_type`;
      const rLabel = `Ratio Type`;
      const pName =  `answer_${useNum}_parameter`;
      const pLabel = `Parameter`;
      const style = (index === 0)
        ? {}
        : {borderTop: answerTopBorder, paddingTop: 15};
      return (
        <div style={style}>
          <Form.Item initialValue={initialValue}
            label={FormHelper.getLabel(label, theme.title, "")}
            name={name} className={`form-item-${theme.themeName}`}>
            {this.getAnswerInputOrSelect(theme)}
          </Form.Item>
          {!isNoOption && FormHelper.getFormItem(theme, tName, tLabel, "select", questionObj, answer_type_limit)}
          {FormHelper.getFormItem(theme, rName, rLabel, "select", questionObj, ratio_type_limit)}
          {FormHelper.getFormItem(theme, pName, pLabel, "number", questionObj)}
        </div>
      );
    });
  }
  private getAnswerInputOrSelect(theme: any) {
    const {option_number, question_type, option_list} = this.props.questionObj;
    const useList = UtilFunction.createList(option_number);
    const style = GetStyle.selectOption(theme);
    const isNoOption = UtilFunction.checkQuestionTypeIsNoOption(question_type);
    if (isNoOption) {
      const style = GetStyle.formInput(theme, false);
      return (
        <Input autoComplete="new-password" style={style} />
      );
    }
    return (
      <Select mode="tags" style={{width: "200px"}}
        dropdownStyle={{padding: 0}}>
        {useList.map((useNum: number) => {
          // const text = (question_type === "vote")
          //  ? useNum + 1 : useNum;
          const text = alphabetString[useNum];
          const value = this.getContentOfOption(option_list, useNum);
          let showText = (value === null || value === undefined)
            ? text
            : `${text} (${value})`;
          if (question_type === "vote") {showText = useNum + 1; }
          return (
            <Option style={style} value={useNum} key={useNum}>
              {showText}
            </Option>
          );
        })}
      </Select>
    );
  }

  private getContentOfOption(option_list: any, index: any) {
    if (!option_list) {return null; }
    const optionObj = option_list[index];
    if (!optionObj) {return null; }
    const {content} = optionObj;
    return content;
  }

  private getCorrectAnswerListReadOnly(questionObj: any, theme: any) {
    const {correct_answer} = questionObj;
    const keyList = Object.keys(correct_answer);
    if (keyList.length === 0) {return null; }
    if (!correct_answer[keyList[0]].answer_list) {return null; }
    const marginLeft = 10;
    const style = GetStyle.formInput(theme, false);
    return (
    <Collapse style={{marginTop: 20, marginBottom: 20}}
      ghost={true} defaultActiveKey={[]}
      onChange={() => {
        this.setState({answerPanelOpen: !this.state.answerPanelOpen});
      }}>
      <Panel showArrow={false} header={this.getAnswerHeader(theme, keyList.length)} key="answer-panel"
        style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          <Descriptions size={"small"} colon={false} style={{marginTop: 10}}
            column={1} title={null}>
            {keyList.map((key: any) => {
              const {answer_list, answer_type, ratio_type, parameter} = correct_answer[key];
              let labelColor = theme.title;
              const label = key;
              let color = theme.value;
              const style = {marginLeft, color};
              const answerString = UtilFunction.createAnswerString(answer_list);
              return (
                <Descriptions.Item label={this.getInfoLabel(labelColor, label)}>
                  <span style={style}>{answerString}</span>
                  <span style={style}>{`Answer Type: ${answer_type}`}</span>
                  <span style={style}>{`Ratio Type: ${ratio_type}`}</span>
                  <span style={style}>{`Parameter: ${parameter}`}</span>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Panel>
      </Collapse>
    )
  }
  private getAnswerHeader(theme: any, useNum: number) {
    const isCollapsed = (this.state.answerPanelOpen);
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.value}}>
        <Icon style={{marginRight: 10}} />
        <span>
          {`Answer List (${useNum})`}
        </span>
      </span>
    );
  }
  private getOptionList(questionObj: any, theme: any) {
    const {option_list, choose_record, correct_answer} = questionObj;
    const correctAnswerList = UtilFunction.changeNonArrayToArray(correct_answer).map((item: any) => parseInt(item));
    const keyList = Object.keys(option_list);
    if (keyList.length === 0) {return null; }
    const numList = UtilFunction.createList(keyList.length);
    const alphabetString = UtilFunction.getAlphabetList();
    const marginLeft = 10;
    const style = GetStyle.formInput(theme, false);
    return (
    <Collapse style={{marginTop: 20, marginBottom: 20}}
      ghost={true} defaultActiveKey={[]}
      onChange={() => {
        this.setState({optionPanelOpen: !this.state.optionPanelOpen});
      }}>
      <Panel showArrow={false} header={this.getOptionHeader(theme, keyList.length)} key="description-panel"
        style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          <Descriptions colon={false} style={{marginTop: 0, padding: 0}}
            column={1} title={null}>
            {numList.map((useNum: number) => {
              const {frequency, totalValueOnOption} = choose_record[useNum];
              const {ratio, content} = option_list[useNum];
              const label = alphabetString[useNum];
              let labelColor = theme.title;
              let color = theme.value;
              if (correctAnswerList.includes(useNum)) {
                labelColor = theme.secondary;
                color = theme.secondary;
              }
              const style = {marginLeft, color};
              return (
                <Descriptions.Item label={this.getInfoLabel(labelColor, label)}>
                  <span style={{color}}>{`Option ${content}`}</span>
                  <span style={style}>{`Ratio ${ratio.toFixed(2)}`}</span>
                  <span style={style}>{`Frequency ${frequency}`}</span>
                  <span style={style}>{`Total Value ${totalValueOnOption.toFixed(2)}`}</span>
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </Panel>
      </Collapse>
    );
  }
  private getOptionHeader(theme: any, useNum: number) {
    const isCollapsed = (this.state.optionPanelOpen);
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.value}}>
        <Icon style={{marginRight: 10}} />
        <span>
          {`Option List (${useNum})`}
        </span>
      </span>
    );
  }
  private getDescription(description: string, theme: any) {
    const style = GetStyle.formInput(theme, false);
    return (
      <Collapse style={{marginTop: 0, marginBottom: 20}}
        ghost={true} defaultActiveKey={[]}
        onChange={() => {
          this.setState({descriptionPanelOpen: !this.state.descriptionPanelOpen});
        }}>
        <Panel showArrow={false} header={this.getDescriptionHeader(theme)} key="description-panel"
          style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          <Row style={{paddingBottom: 10, color: theme.value}}>
            <Editor defaultValue={description} name={"card-description"} editable={false} />
          </Row>        
        </Panel>
      </Collapse>
    );
  }
  private getDescriptionHeader(theme: any) {
    const isCollapsed = (this.state.descriptionPanelOpen);
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.value}}>
        <Icon style={{marginRight: 10}} />
        <span>
          {`Description`}
        </span>
      </span>
    );
  }
  private getLargeTitle(color: string, title: string) {
    return <span style={{color, fontSize: 18, fontWeight: 600}}>{title}</span>;
  }
  private getDescriptionItem(theme: any, key: string, label: string, value: any) {
    return (
      <Descriptions.Item label={this.getInfoLabel(theme.title, label)}>
        {this.getInfoText(theme.value, key, value)}
      </Descriptions.Item>
    )
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
  private async handleSaveAnswer(token: string, value: any) {
    delete value["answer_button"];
    const {question_id} = this.props.questionObj;
    value.correct_answer_number = this.state.correct_answer_number;
    const url = QueryManage.createUrl(`/question/editanswer/${question_id}`);
    const result = await QueryManage.makeRequest(token, url, "put", value);
    if (!result.data) {
      TypeNotification("error", "Save Answer Fail");
      return;
    }
    if (!result.data.success) {
      TypeNotification("error", "Save Answer Fail");
      return;
    }
    TypeNotification("success", "Save Answer Success");
  }
}

export default DescriptionBlock;
