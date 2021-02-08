
// choose record null here, api is create and edit
const questionColumnObjList = [
  {name: "question_id", action: ["null"], limit: []},
  {name: "disable_state", action: ["null"], limit: []},
  {name: "username", action: ["null"], limit: []},
  {name: "user_id", action: ["null"], limit: []},
  {name: "title", action: ["create", "edit"], limit: [], type: "emoji_input"},
  {name: "description", action: ["create", "edit"], limit: [], type: "emoji_textarea"},
  {name: "question_type", action: ["create", "edit"], limit: ["vote", "choose", "decidedByOwnerWithOption", "decidedByOwnerWithoutOption"], type: "text"},
  {name: "ratio_type", action: ["create", "edit"], limit: ["fixed", "auto", "have_initial_value"], type: "text"},
  {name: "option_list", action: ["create", "edit"], limit: [], type: "text"},
  {name: "correct_answer", action: ["create", "edit"], limit: [], type: "text"},
  {name: "min_choose_number", action: ["create", "edit"], limit: [], type: "number"},
  {name: "max_choose_number", action: ["create", "edit"], limit: [], type: "number"},
  {name: "choose_record", action: ["null"], limit: []},
  {name: "category", action: ["create", "edit"], limit: ["regular", "news", "sport", "other"], type: "text"},
  {name: "minimum_fee", action: ["create", "edit"], limit: [], type: "number"},
  {name: "maximum_fee", action: ["create", "edit"], limit: [], type: "number"},
  {name: "initial_pool", action: ["create", "edit"], limit: [], type: "number"},
  {name: "other_pool", action: ["null"], limit: []},
  {name: "add_pool_percentage", action: ["create", "edit"], limit: [], type: "number"},
  {name: "attempt_number", action: ["null"], limit: []},
  {name: "is_show_attempt_number", action: ["create", "edit"], limit: [], type: "boolean"},
  {name: "winner_number", action: ["null"], limit: []},
  {name: "is_show_winner_number", action: ["create", "edit"], limit: [], type: "boolean"},
  {name: "end_requirement", action: ["create", "edit"], limit: ["total_pool", "attempt_number", "winner_number", "null"], type: "text"},
  {name: "end_requirement_value", action: ["create", "edit"], limit: [], type: "number"},
  {name: "visible_date", action: ["create", "edit"], limit: [], type: "date"},
  {name: "open_date", action: ["create", "edit"], limit: [], type: "date"},
  {name: "close_date", action: ["create", "edit"], limit: [], type: "date"},
  {name: "end_date", action: ["create", "edit"], limit: [], type: "date"},
];

const answerObj = {
  answer_list: [],
  answer_type: "", // "follow_order" "null"
  ratio_type: "", // add all, add all time num, time all, time all time num, fixed
  parameter: 0, // number
}

const questionTableColumn = ["ratio_type", "option_list", "correct_answer",
  "min_choose_number", "max_choose_number", "minimum_fee",
  "maximum_fee", "initial_pool", "other_pool", "add_pool_percentage",
  "attempt_number", "winner_number", "end_requirement",
  "end_requirement_value", "visible_date", "open_date",
  "close_date", "end_date"];

const labelRef = {
  question_id: "Question Id",
  disable_state: "Disable State",
  user_id: "Owner Id",
  username: "Owner",
  title: "Title",
  description: "Description",
  question_type: "Question Type",
  ratio_type: "Ratio Type",
  correct_answer: "Correct Answer",
  min_choose_number: "Minimum Choose Number",
  max_choose_number: "Maximum Choose Number",
  option_list: "Option List",
  choose_record: "Choose Record",
  category: "Category",
  minimum_fee: "Minimum Fee",
  maximum_fee: "Maximum Fee",
  initial_pool: "Initial Pool",
  other_pool: "Other Pool",
  add_pool_percentage: "Add Pool Percentage",
  // not in database
  total_pool: "Pool",
  attempt_number: "Attempt Number",
  is_show_attempt_number: "Is Show Attempt Number",
  winner_number: "Winner Number",
  is_show_winner_number: "Is Show Winner Number",
  end_requirement: "End Requirement",
  end_requirement_value: "End Requirement Value",
  visible_date: "Visible Date",
  open_date: "Open Date",
  close_date: "Close Date",
  end_date: "Distribute Value Date",
  created_date: "Create Date",
  updatedAt: "Update Date",
  vote: "Vote",
  choose: "Choose",
  decidedByOwnerWithOption: "Decided By Owner With Option",
  decidedByOwnerWithoutOption: "Decided By Owner Without Option",
  regular: "Regular",
  news: "News",
  sport: "Sport",
  other: "Other",
};

const timeFilterRef = {
  "visible": "Visible",
  "open": "Open",
  "closed": "Closed and wait for distribute",
  "distributed": "Distributed",
  "all": "All",
  "owner": "Owner",
  "other": "Not Own",
};

const extraDataList: string[] = ["question_id", "question_type", "user_id", "username", "category", "ratio_type", "option_list",
  "min_choose_number", "max_choose_number", "minimum_fee", "maximum_fee",
  "initial_pool", "other_pool", "add_pool_percentage", "total_pool"];

const otherDataList: string[] = ["attempt_number", "winner_number",
  "end_requirement", "end_requirement_value", "visible_date",
  "open_date", "close_date", "end_date"];

const showDetailDataList = extraDataList.concat(otherDataList);

const tagRef = {

};

const getChartRef = (theme: any) => {
  const colorList = ["#003F5C", "#444E86", "#955196", "#DD5182", "#FF6E54", "#FFA600"]
  return {
    totalAttempt: {label: "Attempt", stroke: "#8884d8", inside: ["profile", "record"]},
    totalWinner: {label: "Winner", stroke: "#A1D65F", inside: ["record"]},
    totalWin: {label: "Win", stroke: "#A1D65F", inside: ["profile"]},
    totalValue: {label: "Value", stroke: "#5FD6A3", inside: ["profile", "record"]},
    totalOwn: {label: "Own", stroke: "#5F99D6", inside: ["profile"]},
    totalGain: {label: "Gain", stroke: "#C057BA", inside: ["profile"]},
  };
};

const valueRef = {
  vote: "Vote",
  choose: "Choose",
  decidedByOwnerWithOption: "Owner",
  decidedByOwnerWithoutOption: "Owner No Option",
};

const checkValueHaveRef = (value: any) => {
  const isString = (typeof value === "string" || value instanceof String);
  if (!isString) {return value; }
  const useValue = valueRef[value];
  if (!useValue) {return value; }
  return useValue;
};

export default {questionColumnObjList, labelRef, showDetailDataList, timeFilterRef, questionTableColumn, getChartRef, checkValueHaveRef};
