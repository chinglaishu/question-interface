import moment from "moment";
import UtilFunction from "../util/utilfunction";

const maxNum = 9007199254740991;

const noOptionDataType = "decidedByOwnerWithoutOption";

const QuestionCheck = {
  checkAll(useObj: any) {
    const checkList = [
      this.checkOptionNoRepeat(useObj), this.checkChooseNum(useObj),
      this.checkInsideNumberRange(useObj.mimimum_fee, 0, maxNum),
      this.checkInsideNumberRange(useObj.maximum_fee, 0, maxNum),
      this.checkInsideNumberRange(useObj.add_pool_percentage, 0, 100),
      this.checkDate(useObj)];
    for (let i = 0 ; i < checkList.length ; i++) {
      if (!checkList[i]) {return false; }
    }
    return true;
  },
  checkCorrectAnswerInOption(useObj: any) {
    if (this.checkNoCorrectAnswer(useObj.question_type)) {
      return true;
    }
    const correctAnswer = useObj.correct_answer;
    const find = useObj.option_list[correctAnswer];
    if (!find) {return false; }
    if (find.content === undefined || find.content === null) {return false; }
    return true;
  },
  checkOptionNoRepeat(useObj: any) {
    if (useObj.question_type === noOptionDataType) {return true; }
    const optionObj = useObj.option_list;
    const valueList: any = Object.values(optionObj);
    const optionContentList: string[] = [];
    for (let i = 0 ; i < valueList.length ; i++) {
      const content = valueList[i].content;
      if (optionContentList.includes(content)) {return false; }
      optionContentList.push(content);
    }
    return true;
  },
  checkChooseNum(useObj: any) {
    const optionListLength = Object.keys(useObj.option_list).length;
    const chooseNumber = parseInt(useObj.choose_number);
    return optionListLength > chooseNumber;
  },
  checkInsideNumberRange(value: number, min: number, max: number) {
    if (value < min) {return false; }
    if (value > max) {return false; }
    return true;
  },
  checkNoCorrectAnswer(question_type: string) {
    return (question_type === "decidedByOwnerWithOption" || question_type === "decidedByOwnerWithoutOption" || question_type === "vote");
  },
  checkDate(useObj: any) {
    const {visible_date, open_date, close_date, end_date} = useObj;
    const timeList = [moment(), visible_date, open_date, close_date, end_date];
    for (let i = 1 ; i < timeList.length ; i++) {
      if (UtilFunction.checkTimeAIsBeforeB(timeList[i], timeList[i - 1])) {
        return false;
      }
    }
    const diffBetweenOpenAndClose = moment(close_date).diff(moment(open_date), "minutes");
    if (diffBetweenOpenAndClose < 60) {
      return false;
    }
    return true;
  },
}

export default QuestionCheck;
