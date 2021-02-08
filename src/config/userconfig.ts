
const isShowList = ["no_one", "everyone", "friend_only"];

const userColumnObjList = [
  {name: "user_id", action: ["null"]},
  {name: "user_type", action: ["null"]},
  {name: "username", action: ["create", "null"], type: "text"},
  {name: "password", action: ["create"]},
  {name: "value", action: ["null"]},
  {name: "reputationGood", action: ["null"]},
  {name: "reputationBad", action: ["null"]},
  {name: "own_question_list", action: ["null"]},
  {name: "do_question_list", action: ["null"]},
  {name: "is_show_value_and_question", action: ["edit"], limit: isShowList, type: "select"},
  {name: "location", action: ["edit"], type: "text"},
  {name: "email", action: ["edit"], type: "text"},
  {name: "is_show_information", action: ["edit"], limit: isShowList, type: "select"},
  {name: "active_friend_list", action: ["null"], type: "number"},
  {name: "passive_friend_list", action: ["null"], type: "number"},
  {name: "created_date", action: ["null"], type: "date"},
];

const loginColumnObjList = [
  {name: "username", type: "text"},
  {name: "password", type: "password"},
  {name: "is_remember", type: "boolean"}
];

const registerColumnObjList = [
  {name: "username", type: "text"},
  {name: "password", type: "password"},
  {name: "confirm_password", type: "password"},
];

const labelRef = {
  "user_id": "User Id",
  "user_type": "User Type",
  "username": "Username",
  "password": "Password",
  "confirm_password": "Confirm Password",
  "is_remember": "Remember Me",
  "value": "Value",
  "reputationGood": "Reputation Good",
  "reputationBad": "Reputation Bad",
  "own_question_list": "Own Question List",
  "do_question_list": "Do Question List",
  "is_show_value_and_question": "Show Value And Question",
  "location": "Location",
  "email": "Email",
  "description": "Description",
  "is_show_information": "Show Information",
  "active_friend_list": "Active Friend List",
  "passive_friend_list": "Passive Friend List",
  "created_date": "Created Data",
  "updatedAt": "Updated Date",
};

const descriptionExcludeList = ["user_icon", "show_name", "showname", "password", "group_list", "description", "own_question_list", "do_question_list", "active_friend_list", "passive_friend_list", "createdAt"];

export default {userColumnObjList, labelRef, descriptionExcludeList, loginColumnObjList, registerColumnObjList};
