import React from "react";
import UtilContext from "../context/utilcontext";
import QuestionConfig from "../config/questionconfig";
import {Form, Row, Input, InputNumber, Button, Checkbox,
  Select, DatePicker, Modal, Collapse} from "antd";
import UtilFunction from "../util/utilfunction";
import {
  PlusOutlined,
  MinusOutlined,
  NumberOutlined,
  FormOutlined,
  CalendarOutlined,
  RightOutlined,
  DownOutlined,
} from '@ant-design/icons';
import "./styles.css";
import TypeNotification from "../util/createnotification";
import QueryManage from "../util/QueryManage";
import QuestionCheck from "./questioncheck";
import moment, { min } from "moment";
import Editor from "../util/Editor";
import PageTitle from "../util/PageTitle";
import GetStyle from "../util/getStyle";
import "../styles/selectStyles.css";
import "../QuestionList/modalStyles.css";

const { Panel } = Collapse;
const {Option} = Select;
const {questionColumnObjList, labelRef} = QuestionConfig;
const noOptionDataType = "decidedByOwnerWithoutOption";
// const notRequireList = ["is_show_attempt_number", "is_show_winner_number", "description"];
const alphabetString = UtilFunction.getAlphabetList();

function disabledDate(time: any) {
  return time && time < moment().startOf("day");
}

type QuestionFormProps = {
  isCreate: boolean,
  userObj?: string,
};

type QuestionFormState = {
  option_number: number,
  correct_answer_number: number,
  question_type: any,
  ratio_type: any,
  end_requirement: any,
  currentEditObj: any,
  showNumberRangeModal: boolean,
  minNumberInRange: number,
  maxNumberInRange: number,
  isReplaceOption: boolean,
  optionCollapseKey: any[],
  answerCollapseKey: any[],
  optionUpdateNum: number,
};

class QuestionForm extends React.Component<QuestionFormProps, QuestionFormState> {
  private descriptionRef: React.RefObject<Editor>;
  private formRef: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.descriptionRef = React.createRef();
    this.formRef = React.createRef();
    this.state = {
      option_number: 2,
      correct_answer_number: 1,
      question_type: null,
      ratio_type: null,
      end_requirement: null,
      currentEditObj: null,
      showNumberRangeModal: false,
      minNumberInRange: 0,
      maxNumberInRange: 0,
      isReplaceOption: true,
      optionCollapseKey: ["option-panel"],
      answerCollapseKey: ["answer-panel"],
      optionUpdateNum: 0,
    }
  }
  public componentDidMount() {
    setTimeout(() => {
      const e: any = $(".emoji-text-field");
      e.css("background-image", 'url("../assets/image/white_emoji.png")');
    }, 3000);
    if (!this.props.isCreate) {
      this.setInputFieldValue();
    } else {
      $(document).ready(function() {
        const elem: any = $(".emoji-text-field");
        try {
          elem.emojioneArea({
            searchPosition: "bottom",
            pickerPosition: "right",
            tones: false,
          });
          const e: any = $(".emojionearea .emojionearea-button>div, .emojionearea .emojionearea-picker .emojionearea-wrapper");
          e.css("background-image", 'url("../assets/image/white_emoji.png")');
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
  public render() {
    if (!this.props.isCreate && !this.state.currentEditObj) {return null; }
    return (
      <UtilContext.UtilConsumer>
        {(utilObj: UtilObj) => {
          return this.getContent(utilObj);
        }}
      </UtilContext.UtilConsumer>
    );
  }
  private async setInputFieldValue() {
    const useProps: any = this.props;
    const question_id = useProps.match.params.question_id;
    const url = QueryManage.createUrl(`/question/${question_id}`);
    const token: string = (useProps.userObj.token as string);
    const user_id: number = (useProps.userObj.user_id as number);
    const getQuestionObj = await QueryManage.makeRequest(token, url);
    const questionObj = getQuestionObj.data.result;
    this.checkValidObj(questionObj);
    if (user_id !== questionObj.user_id) {
      TypeNotification("error", "you are not question owner");
      // window.location.href = "question-list";
    }
    const {option_list, question_type, ratio_type, end_requirement, title, open_date} = questionObj;
    const isBeforeOpen = UtilFunction.checkTimeAIsBeforeB(moment(), moment(open_date));
    if (!isBeforeOpen) {
      TypeNotification("error", "can not edit question after open");
      return;
    }
    const optionKeyList = Object.keys(option_list);
    let currentEditObj = UtilFunction.createOptionFieldForList(questionObj);
    currentEditObj = UtilFunction.createAnswerFieldForList(questionObj);
    this.setState({option_number: optionKeyList.length,
      question_type, ratio_type, end_requirement,
      currentEditObj}, () => {
      $(document).ready(function() {
        const elem: any = $(".emoji-text-field");
        try {
          (document.getElementById("question-title") as any).value = questionObj.title;
          elem.emojioneArea({
            searchPosition: "bottom",
            pickerPosition: "right"
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
  }
  private checkValidObj(useObj: any) {
    const keyList = Object.keys(useObj);
    if (keyList.length === 0) {
      TypeNotification("error", "can not get data from get question");
      window.location.href = "question-list";
    }
  }
  private getContent(utilObj: UtilObj) {
    const {sizeObj, theme, userObj, getUserData} = utilObj;
    const {isCreate} = this.props;
    const title = (isCreate) ? "Create Question" : "Edit Question";
    const description = (isCreate)
      ? "You can create different kinds of question here"
      : "Editing your own question here";
    return (
      <div style={{padding: 20}}>
        <PageTitle title={title} description={description}
          Icon={FormOutlined} />
        <div style={{paddingLeft: 20}}>
          {this.getForm(theme, userObj, getUserData)}
          {this.getNumberRangeModal(theme)}
        </div>
      </div>
    );
  }
  private getNumberRangeModal(theme: any) {
    const {showNumberRangeModal, minNumberInRange, maxNumberInRange,
      isReplaceOption} = this.state;
    return (
      <Modal
        title={this.getModalTitle(theme)}
        visible={showNumberRangeModal}
        onOk={() => this.addNumberRange()}
        onCancel={() => this.setState({showNumberRangeModal: false})}
        wrapClassName={`modal-${theme.themeName}`}>
        <Row>
          <span>Minimum Number</span>
          <InputNumber style={{marginTop: -5, marginLeft: 10}} precision={0} value={minNumberInRange} onChange={(value: any) => this.setState({minNumberInRange: value})} />
        </Row>
        <Row style={{marginTop: 20}}>
          <span>Maximum Number</span>
          <InputNumber style={{marginTop: -5, marginLeft: 10}} min={minNumberInRange} precision={0} value={maxNumberInRange} onChange={(value: any) => this.setState({maxNumberInRange: value})} />
        </Row>
        <Row style={{marginTop: 20}}>
          <span style={{fontSize: 12, color: theme.subText}}>*It will replace all current option</span>
        </Row>
      </Modal>
    );
  }
  private getModalTitle(theme: any) {
    return (
      <Row>
        <NumberOutlined style={{color: theme.secondary, marginTop: 3, marginRight: 3,
          fontSize: 16}} />
        <span style={{color: theme.value}}>
          Add Number Range To Option List
        </span>
      </Row>
    );
  }
  private addNumberRange() {
    const {minNumberInRange, maxNumberInRange, option_number, isReplaceOption} = this.state;
    if (minNumberInRange > maxNumberInRange) {
      TypeNotification("error", "min can not larger than max");
      return;
    }
    const addNum = maxNumberInRange - minNumberInRange + 1;
    const newOptionNumber = (isReplaceOption) ? addNum : option_number - 1 + addNum;
    if (newOptionNumber < 2) {
      TypeNotification("error", "option can not less than 2");
      return;
    }
    if (newOptionNumber > 60) {
      TypeNotification("error", "option can not larger than 60");
      return;
    }
    const currentEditObj = (this.props.isCreate)
      ? {} : JSON.parse(JSON.stringify(this.state.currentEditObj));
    let index = 0;
    if (isReplaceOption) {
      for (let i = 0 ; i < addNum ; i++) {
        const name = `option_${i}`;
        const rName =  `option_${i}_ratio`;
        currentEditObj[name] = minNumberInRange + index;
        currentEditObj[rName] = newOptionNumber;
        index++;
      }
      this.formRef.current.setFieldsValue(currentEditObj);
      this.setState({currentEditObj, option_number: addNum});
    } else {
      for (let i = option_number ; i < newOptionNumber + 1 ; i++) {
        const name = `option_${i}`;
        const rName =  `option_${i}_ratio`;
        currentEditObj[name] = minNumberInRange + index;
        currentEditObj[rName] = newOptionNumber;
        index++;
      }
      this.formRef.current.setFieldsValue(currentEditObj);
      this.setState({currentEditObj, option_number: newOptionNumber,
        showNumberRangeModal: false });
    }
  }
  private getForm(theme: any, userObj: any, getUserData: any) {
    const style = GetStyle.formDiv(theme);
    return (
      <div className={`form-div-${theme.themeName}`} style={{width: "100%", ...style}}>
        <Form ref={this.formRef} onFinish={(e: any) => this.handleSubmit(e, userObj, getUserData)} className="create-question-form"
          style={{width: "70%"}}>
          {questionColumnObjList.map((useObj: any) => {
            const {name, type, limit, action} = useObj;
            const label = labelRef[name];
            const checkShow = this.checkShowFormItem(name);
            if (!checkShow) {return null; }
            if (useObj.name !== "option_list" && useObj.name !== "correct_answer") {
              return this.getFormItem(theme, true, name, label, type, limit, action);
            } else if (useObj.name === "option_list") {
              return this.getOptionButtonAndList(theme);
            } else if (useObj.name === "correct_answer") {
              return this.getCorrectAnswerButtonAndList(theme);
            }
          })}
          <Form.Item>
            <Button className={`button-${theme.themeName}`} style={{marginTop: 15}} type="default" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
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
  private itemDefaultValue(name: string) {
    const {isCreate} = this.props;
    if (isCreate) {return null; }
    if (!this.state.currentEditObj) {return null; }
    return this.handleTypeValue(name, this.state.currentEditObj[name]);
  }
  private getFormItem(theme: any, isCheckAction: boolean, name: string, label: string, type: string, limit: string[] = [], actionList: string[] = []) {
    const checkAction = (this.props.isCreate) ? "create" : "edit";
    if (isCheckAction && !actionList.includes(checkAction)) {return null; }
    const color = theme.title;
    const initialValue = this.itemDefaultValue(name);
    return (
      <Form.Item initialValue={initialValue}
        label={this.getLabel(label, color, "")}
        name={name} className={`form-item-${theme.themeName}`}>
        {this.getInput(name, type, limit, theme)}
      </Form.Item>
    );
  }
  private checkShowFormItem(name: string) {
    // const checkShowList = ["correct_answer", "option_list", "choose_number", "end_requirement_value"];
    if (name === "correct_answer") {
      if (this.state.question_type === "vote") {return true; }
      const noCorrectAnswer = QuestionCheck.checkNoCorrectAnswer(this.state.question_type);
      return !noCorrectAnswer;
    }
    if (name === "option_list" || name === "choose_number" || name === "ratio_type") {
      return (this.state.question_type !== noOptionDataType);
    }
    if (name === "end_requirement_value") {
      return this.state.end_requirement !== "null";
    }
    if (name === "min_choose_number" || name === "max_choose_number") {
      const noOption = UtilFunction.checkQuestionTypeIsNoOption(this.state.question_type);
      return !noOption;
    }
    return true;
  }
  private getInput(name: string, type: string, limit: string[], theme: any) {
    const style = GetStyle.formInput(theme, false);
    const {question_type} = this.state;
    if (limit.length > 0) {
      return this.getSelect(name, limit, theme);
    }
    if (name === "correct_answer" && question_type !== noOptionDataType) {
      const useLimit = this.getOptionNameList(true);
      return this.getSelect(name, useLimit, theme);
    }
    if (name === "choose_number") {
      const useList = UtilFunction.createList(this.state.option_number);
      useList.splice(0, 1);
      return this.getSelect(name, useList, theme);
    }
    if (type === "number") {
      const precision = (name === "choose_number")
        ? 0 : 2;
      const [min, max] = (name === "add_pool_percentage") ? [0, 100]
        : (name.includes("ratio")) ? [1, undefined] : [0, undefined];
      return <InputNumber style={style} min={min} max={max} precision={precision} />;
    } else if (type === "emoji_input") {
      return (
        <div style={{}}>
          <input style={style} id={`question-title`} className="emoji-text-field" />
        </div>
      );
    } else if (type === "emoji_textarea") {
      return <Editor ref={this.descriptionRef} defaultValue={this.getEditorValue(false)} editable={true} name={"description"} />;
    } else if (type === "boolean") {
      return <Checkbox style={{backgroundColor: theme.background, color: theme.value}} />;
    } else if (type === "date") {
      return this.getDatePicker(name, theme);
    } else if (name.includes("option")) {
      return <Input autoFocus={true} style={style} onChange={() => this.setState({optionUpdateNum: this.state.optionUpdateNum + 1})} />
    }
    return <Input autoFocus={true} style={style} />;
  }
  private getEditorValue(isTitle: boolean) {
    const {isCreate} = this.props;
    if (isCreate) {return null; }
    const {currentEditObj} = this.state;
    const key = (isTitle) ? "title" : "description";
    const content: any = currentEditObj[key];
    return content;
  }
  private getDatePicker(name: string, theme: any) {
    const style = GetStyle.formInput(theme, false);
    return (
      <DatePicker
        className={`date-picker-${theme.themeName}`}
        style={style}
        popupStyle={style}
        format="YYYY-MM-DD HH:mm:ss"
        disabledDate={disabledDate}
        suffixIcon={<CalendarOutlined style={{color: theme.title}} />}
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
      />
    );
  }
  private getCorrectAnswerButtonAndList(theme: any) {
    const useList = UtilFunction.createList(this.state.correct_answer_number);
    const style = GetStyle.formInput(theme, false);
    return (
      <Collapse style={{marginTop: 40, marginBottom: 50}}
        ghost={true} defaultActiveKey={"answer-panel"}
        onChange={(key: any) => {
          this.setState({answerCollapseKey: key});
        }}>
        <Panel showArrow={false} header={this.getCorrectHeader(theme, useList.length)} key="answer-panel"
          style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          {this.getCorrectAnswerButton(theme)}
          {this.getCorrectAnswerList(useList, theme)}
        </Panel>
      </Collapse>
    );
  }
  private getCorrectHeader(theme: any, useNum: number) {
    const isCollapsed = (this.state.answerCollapseKey.includes("answer-panel"));
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.title}}>
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
  private getCorrectAnswerList(useList: number[], theme: any) {
    const {ratio_type} = this.state;
    const answer_type_limit = ["not_follow_order", "follow_order"];
    const ratio_type_limit = ["add_all", "add_all_time_num", "time_all", "time_all_time_num", "fixed"]; // add all, add all time num, time all, time all time num, fixed
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
            label={this.getLabel(label, theme.title, "")}
            name={name} className={`form-item-${theme.themeName}`}>
            {this.getAnswerSelect(theme)}
          </Form.Item>
          {this.getFormItem(theme, false, tName, tLabel, "text", answer_type_limit)}
          {this.getFormItem(theme, false, rName, rLabel, "text", ratio_type_limit)}
          {this.getFormItem(theme, false, pName, pLabel, "number")}
          <span style={{color: theme.subText}}>*paramter will not be used in add_all and time_all</span>
        </div>
      );
    });
  }
  private getAnswerSelect(theme: any) {
    const {option_number, question_type} = this.state;
    const useList = UtilFunction.createList(option_number);
    const style = GetStyle.selectOption(theme);
    return (
      <Select mode="tags" style={{width: "200px"}}
        dropdownStyle={{padding: 0}}>
        {useList.map((useNum: number) => {
          // const text = (question_type === "vote") ? useNum + 1 : useNum;
          const text = alphabetString[useNum];
          const value = (!!this.formRef.current)
            ? this.formRef.current.getFieldValue(`option_${useNum}`)
            : null;
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
  private getOptionNameList(isGetNumber: boolean) {
    const useList = UtilFunction.createList(this.state.option_number);
    if (isGetNumber) {return useList; }
    return useList.map((num: number) => alphabetString[num]);
  }
  private getOptionButtonAndList(theme: any) {
    const useList = UtilFunction.createList(this.state.option_number);
    const style = GetStyle.formInput(theme, false);
    const marginBottom = (UtilFunction.checkQuestionTypeIsNoCorrectAnswer)
      ? 50 : 0;
    return (
      <Collapse style={{marginTop: 50, marginBottom}} ghost={true}
        defaultActiveKey={"option-panel"}
        onChange={(key: any) => {
          this.setState({optionCollapseKey: key});
        }}>
        <Panel showArrow={false} header={this.getOptionHeader(useList.length, theme)} key={`option-panel`}
          style={{...style, borderBottom: `0px solid ${theme.title}`}}>
          {this.getOptionButton(theme)}
          {this.getOptionList(useList, theme)}
        </Panel>
      </Collapse>
    );
  }
  private getOptionHeader(useNum: number, theme: any) {
    const isCollapsed = (this.state.optionCollapseKey.includes("option-panel"));
    const Icon = (isCollapsed) ? DownOutlined : RightOutlined;
    return (
      <span style={{color: theme.title}}>
        <Icon style={{marginRight: 10}} />
        <span>
          {`Option List (${useNum})`}
        </span>
      </span>
    );
  }
  private getOptionButton(theme: any) {
    const style = {marginRight: 10};
    const buttonClassName = (theme.themeName === "light")
      ? "button-light" : "button-dark";
    return (
      <Form.Item initialValue={null} style={{color: theme.title}}
        name={`option_button`}>
        <Button style={style} icon={<PlusOutlined />} className={buttonClassName}
          onClick={() => this.addOption()}>
          Plus
        </Button>
        <Button style={style} icon={<MinusOutlined />} className={buttonClassName}
          onClick={() => this.minusOption()}>
          Minus
        </Button>
        <Button style={style} icon={<NumberOutlined />} className={buttonClassName}
          onClick={() => this.setState({showNumberRangeModal: true})}>
          Number Range
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
    if (correct_answer_number < 1) {
      TypeNotification("error", "Min answer number is 1");
      return;
    }
    this.setState({correct_answer_number});
  }
  private minusOption() {
    let option_number = this.state.option_number - 1;
    if (option_number < 2) {
      TypeNotification("error", "Min option number is 2");
      return;
    }
    this.setState({option_number});
  }
  private addOption() {
    let option_number = this.state.option_number + 1;
    if (option_number > 60) {
      TypeNotification("error", "Max option number is 60");
      return;
    }
    this.setState({option_number});
  }
  private getOptionList(useList: number[], theme: any) {
    const {ratio_type} = this.state;
    const isShowRatio = (ratio_type !== "auto");
    return useList.map((useNum: number) => {
      const name = `option_${useNum}`;
      const label = `${alphabetString[useNum]}`;
      const rName =  `option_${useNum}_ratio`;
      const rLabel = `${alphabetString[useNum]} Ratio`;
      return (
        <>
          {this.getFormItem(theme, false, name, label, "text")}
          {isShowRatio && this.getFormItem(theme, false, rName, rLabel, "number")}
        </>
      );
    });
  }
  private getSelect(name: string, limit: any[], theme: any) {
    const style = GetStyle.selectOption(theme);
    return (
      <Select style={{width: "200px"}} dropdownStyle={{padding: 0}}
        onChange={(value: string) => this.checkChangeSelect(name, value)}>
        {limit.map((item: any) => {
          const label = (name === "correct_answer")
            ? alphabetString[item] : item;
          return (
            <Option style={style} value={item}>
              {label}
            </Option>
          );
        })}
      </Select>
    );
  }
  private checkChangeSelect(name: string, value: string) {
    if (name === "question_type") {
      this.setState({question_type: value});
    }
    if (name === "ratio_type") {
      this.setState({ratio_type: value});
    }
    if (name === "end_requirement") {
      this.setState({end_requirement: value});
    }
  }
  private getLabel(text: string, color: string, Icon: any) {
    return (
      <Row style={{width: "100vw"}}>
        <span style={{color}}>{text}</span>
        <br />
      </Row>
    );
  }
  private addAnswerParameterIfNecessary(value: any) {
    const {correct_answer_number} = this.state;
    for (let i = 0 ; i < correct_answer_number ; i++) {
      const answer_ratio_type = value[`answer_${i}_ratio_type`];
      if (answer_ratio_type === "add_all" || answer_ratio_type === "time_all") {
        value[`answer_${i}_parameter`] = 1;
      }
    }
    return value;
  }
  private async handleSubmit(value: any, userObj: any, getUserData: any) {
    delete value["option_button"];
    delete value["answer_button"];
    const noCorrectAnswer = QuestionCheck.checkNoCorrectAnswer(this.state.question_type);
    if (noCorrectAnswer) {value.correct_answer = {}; }
    if (this.state.question_type === noOptionDataType) {
      value.ratio_type = "auto";
    }
    if (this.state.end_requirement === "null") {
      value.end_requirement_value = 0;
    }
    if (this.state.end_requirement === "winner_number" || this.state.end_requirement === "attempt_number") {
      if (!Number.isInteger(value.end_requirement_value) || value.end_requirement_value === 0) {
        TypeNotification("error", "End requirement value can not be zero, and need to be integer");
        return;
      }
    }
    if (this.state.end_requirement === "total_pool") {
      if (value.initial_pool >= value.end_requirement_value) {
        TypeNotification("error", "End requirement value can not be less than the initial pool");
        return;
      }
    }
    const titleValue = (document.getElementById("question-title") as any).value;
    value.title = titleValue;
    const descriptionValue = this.descriptionRef.current?.getEditorState();
    value.description = descriptionValue.toRAW();

    const {correct_answer_number} = this.state;
    value.correct_answer_number = correct_answer_number;
    value.username = userObj.username;

    value = this.addAnswerParameterIfNecessary(value);

    value = this.addCheckboxValue(value);
    const emptyList = this.checkEmpty(value);
    if (emptyList.length > 0) {
      TypeNotification("error", "Below Field can not be empty", emptyList, 5);
      return;
    }
    let optionRepeatList = [];
    [value, optionRepeatList] = this.addOptionObjAndCheckRepeat(value);
    if (optionRepeatList.length > 0) {
      TypeNotification("error", "Below option content repeat", optionRepeatList, 5);
      return;
    }
    if (value.maximum_fee < value.minimum_fee) {
      TypeNotification("error", "Maximum fee can not less than minumum fee");
      return;
    }
    const checkDate = this.checkDate(value);
    if (!checkDate) {return; }
    const {isCreate} = this.props;
    if (isCreate) {
      const url = QueryManage.createUrl("/question/new");
      const result = await QueryManage.makeRequest(userObj.token, url, "post", value);
      if (!result.data) {
        TypeNotification("error", "Submit Data Fail");
        return;
      }
      if (!result.data.success) {
        TypeNotification("error", "Submit Data Fail");
        return;
      } else {
        TypeNotification("success", "Submit Data Success");
        getUserData();
        this.formRef.current.resetFields();
      }
    } else {
      const {currentEditObj} = this.state;
      const {question_id} = currentEditObj;
      const url = QueryManage.createUrl(`/question/${question_id}`);
      const result = await QueryManage.makeRequest(userObj.token, url, "put", value);
      if (!result.data) {
        TypeNotification("error", "Submit Data Fail");
        return;
      }
      if (!result.data.success) {
        TypeNotification("error", "Submit Data Fail");
        return;
      } else {
        TypeNotification("success", "Submit Data Success");
        getUserData();
      }
    }
  }
  private getValueById(id: string) {
    const elem: any = document.getElementById(id);
    if (!elem) {
      return null;
    }
    return elem.value;
  }
  private addCheckboxValue(value: any) {
    value.is_show_attempt_number = (!!value.is_show_attempt_number);
    value.is_show_winner_number = (!!value.is_show_winner_number);
    return value;
  }
  private checkEmpty(value: any) {
    const emptyList: string[] = [];
    const keyList = Object.keys(value);
    const valueList = Object.values(value);
    for (let i = 0 ; i < valueList.length ; i++ ) {
      if (valueList[i] === undefined || valueList[i] === null) {
        emptyList.push(keyList[i]);
      }
    }
    return emptyList;
  }
  private addOptionObjAndCheckRepeat(value: any) {
    const {option_number, question_type} = this.state;
    const optionObj: any = {};
    const optionContentList: string[] = [];
    let optionRepeatList: string[] = [];
    for (let i = 0 ; i < option_number ; i++) {
      const name = `option_${i}`;
      const rName = `option_${i}_ratio`;
      if (question_type !== noOptionDataType) {
        const index = optionContentList.indexOf(value[name]);
        if (index !== -1) {
          const textOne = `${alphabetString[index]}: ${optionContentList[index]}`;
          const textTwo = `${alphabetString[i]}: ${value[name]}`;
          if (!optionRepeatList.includes(textOne)) {optionRepeatList.push(textOne); }
          optionRepeatList.push(textTwo);
        }
        optionContentList.push(value[name]);
        optionObj[i] = {content: value[name], ratio: value[rName]};
      }
      delete value[name];
      delete value[rName];
    }
    value.option_list = optionObj;
    return [value, optionRepeatList];
  }
  private checkDate(value: any) {
    const {visible_date, open_date, close_date, end_date} = value;
    const timeList = [moment(), visible_date, open_date, close_date, end_date];
    const timeStringList = ["Now", "Visible Date", "Open Date", "Close Date", "Distribute Value Date"];
    for (let i = 1 ; i < timeList.length ; i++) {
      if (UtilFunction.checkTimeAIsBeforeB(timeList[i], timeList[i - 1])) {
        TypeNotification("error", `${timeStringList[i]} can not before ${timeStringList[i - 1]}`);
        return false;
      }
    }
    const diffBetweenOpenAndClose = moment(close_date).diff(moment(open_date), "minutes");
    if (diffBetweenOpenAndClose < 60) {
      TypeNotification("error", "close date should at least 60 minutes after open date");
      return false;
    }
    return true;
  }
}

export default QuestionForm;
