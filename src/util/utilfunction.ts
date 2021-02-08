import moment from "moment";

const deviceSizeRef = {
  xs: 600,
  sm: 960,
  md: 1280,
  lg: 1920,
};

const UtilFunction = {
  checkClickInsideElement(e: any, id: string) {
    
  },
  createList(useNum: number) {
    const useList: number[] = [];
    for (let i = 0 ; i < useNum ; i++) {
      useList.push(i);
    }
    return useList;
  },
  getAlphabetList() {
    const loopNum = 2;
    const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const useList: any[] = [];
    for (let i = 0 ; i < loopNum ; i++) {
      for (let a = 0 ; a < alphabetList.length ; a++) {
        let useText = alphabetList[a]
        if (i === 1) {useText = useText + useText; }
        useList.push(useText);
      }
    }
    return useList;
  },
  checkTimeAIsBeforeB(timeA: any, timeB: any) {
    const diff = moment(timeA).diff(timeB, "seconds");
    return diff <= 0;
  },
  checkTimeAfterABeforeB(time: any, timeA: any, timeB: any) {
    const isAfterA = this.checkTimeAIsBeforeB(timeA, time);
    const isBeforeB = this.checkTimeAIsBeforeB(time, timeB);
    return (isAfterA && isBeforeB);
  },
  createOptionFieldForList(questionObj: any) {
    const {option_list} = questionObj;
    const keyList = Object.keys(option_list);
    for (let i = 0 ; i < keyList.length ; i++) {
      const key = keyList[i];
      const {content, ratio} = option_list[key];
      const name = `option_${key}`;
      const rName = `option_${key}_ratio`;
      questionObj[name] = content;
      questionObj[rName] = ratio;
    }
    questionObj.option_number = keyList.length;
    return questionObj;
  },
  createAnswerFieldForList(questionObj: any) {
    const {correct_answer} = questionObj;
    const keyList = Object.keys(correct_answer);
    for (let i  = 0 ; i < keyList.length ; i++) {
      const key = keyList[i];
      const {answer_list, answer_type, ratio_type, parameter} = correct_answer[key];
      const name = `answer_${key}`;
      const tName = `answer_${key}_type`;
      const rName = `answer_${key}_ratio_type`;
      const pName = `answer_${key}_parameter`;
      questionObj[name] = answer_list;
      questionObj[tName] = answer_type;
      questionObj[rName] = ratio_type;
      questionObj[pName] = parameter;
    }
    questionObj.correct_answer_number = keyList.length;
    return questionObj;
  },
  getTimeTag(questionObj: any) {
    const {visible_date, open_date, close_date, end_date, disable_state} = questionObj;
    const currentTimestamp = moment();
    const isBeforeVisible = UtilFunction.checkTimeAIsBeforeB(currentTimestamp, moment(visible_date));
    if (isBeforeVisible) {return "before visible"; }
    const isVisibleOnly = UtilFunction.checkTimeAfterABeforeB(currentTimestamp, moment(visible_date), moment(open_date));
    if (isVisibleOnly) {return "visible"; }
    const isOpen = UtilFunction.checkTimeAfterABeforeB(currentTimestamp, moment(open_date), moment(close_date));
    if (isOpen) {return "open"; }
    const isWaitForDistribute = (UtilFunction.checkTimeAIsBeforeB(moment(close_date), currentTimestamp) && disable_state !== "distributed");
    if (isWaitForDistribute) {return "wait for distribute"; }
    const distributed = disable_state === "distributed";
    if (distributed) {return "distributed"; }
    return "unknown time type";
  },
  addMoreKeyToQuestionObj(questionObj: any, user_id: number) {
    questionObj.is_owner = questionObj.user_id === user_id;
    questionObj.time_tag = this.getTimeTag(questionObj);
    questionObj.total_pool = this.getTotalPool(questionObj);
    return questionObj;
  },
  getTotalPool(questionObj: any) {
    const {initial_pool, other_pool, add_pool_percentage} = questionObj;
    const total_pool = initial_pool + other_pool * (add_pool_percentage / 100);
    return total_pool;
  },
  checkIfArray(item: any) {
    return Array.isArray(item);
  },
  changeNonArrayToArray(item: any) {
    return this.checkIfArray(item) ? item : [item];
  },
  getSizeName() {
    const sW = window.innerWidth;
    const keyList = Object.keys(deviceSizeRef);
    const valueList = Object.values(deviceSizeRef);
    for (let i = 0 ; i < valueList.length ; i++) {
      if (sW < valueList[i]) {
        return keyList[i];
      }
    }
    return "xl";
  },
  getBlockNumberAndSpan() {
    const sizeName = this.getSizeName();
    if (sizeName === "xs") {
      return [1, 18];
    }
    if (sizeName === "sm") {
      return [2, 12];
    }
    if (sizeName === "md") {
      return [3, 8];
    }
    if (sizeName === "lg") {
      return [4, 6];
    }
    return [6, 4];
  },
  createAnswerString(answer_list: any[]) {
    let useString: any = "";
    if (!answer_list) {return "no"; }
    for (let i = 0 ; i < answer_list.length ; i++) {
      const addSign = (i === 0) ? "" : ", ";
      const addText = `${addSign}${answer_list[i]}`;
      useString += addText;
    }
    return useString;
  },
  checkQuestionTypeIsNoOption(question_type: string) {
    const noOptionDataType = "decidedByOwnerWithoutOption";
    return question_type === noOptionDataType;
  },
  checkQuestionTypeIsNoCorrectAnswer(question_type: string) {
    const noAnswerDataTypeList = ["decidedByOwnerWithoutOption", "decidedByOwnerWithOption"];
    return noAnswerDataTypeList.includes(question_type);
  },
  checkNumberInRange(min: number, max: number, value: number) {
    return (value >= min && value <= max);
  },
  getUniqueList(list: any[]) {
    return [...new Set(list)];
  },
  sortObjByTimestamp(list: any[], key: string) {
    if (!list) {return list; }
    return list.sort((a: any, b: any) => {
      const aUnix = moment(a[key]).unix();
      const bUnix = moment(b[key]).unix();
      return aUnix - bUnix;
    });
  },
  checkIfEmptyOrError(useList: any) {
    if (!useList) {return true; }
    if (this.checkIfArray(useList)) {
      if (useList.length === 0) {
        return true;
      }
    }
    return false;
  },
  isInsideTimeBlock(timestamp: any, t: number, interval: number) {
    const timeDiff = moment(timestamp).unix() - t;
    if (timeDiff < 0) {return false; }
    if (!(timeDiff < interval)) {return false; }
    return true;
  },
  getDeepCopy(useItem: any) {
    return JSON.parse(JSON.stringify(useItem));
  },
}

export default UtilFunction;
