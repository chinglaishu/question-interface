import React from "react";
import UtilContext from "../context/utilcontext";
import QueryManage from "../util/QueryManage";
import {Row, Form, Button, Select, Input, Col} from "antd";
import UserConfig from "../config/userconfig";
import moment from "moment";
import TypeNotification from "../util/createnotification";
import PageTitle from "../util/PageTitle";
import {
  UserOutlined,
  InfoCircleOutlined,
  StarOutlined,
  SyncOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import GetStyle from "../util/getStyle";
import BlockTitle from "../util/BlockTitle";
import "./styles.css";
import "../styles/selectStyles.css";

const {Option} = Select;
const {userColumnObjList, labelRef} = UserConfig;

type AccountProps = {
  userObj: any,
  getUserData: () => void,
};

type AccountState = {
  is_show_value_and_question: any,
  is_show_information: any,
};

class Account extends React.Component<AccountProps, AccountState> {
  private passwordForm: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.passwordForm = React.createRef();
    this.state = {
      is_show_value_and_question: this.props.userObj.is_show_value_and_question,
      is_show_information: this.props.userObj.is_show_information,
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
    return (
      <div style={{padding: 20}}>
        <PageTitle title={"Account"} description={"Configurate account setting and personal information"}
          Icon={UserOutlined} />
        <Row style={{width: "100%", paddingLeft: 20, paddingRight: 20}}>
          <Col span={12} style={{paddingRight: 15}}>
            {this.getForm(theme, userObj, true)}
            {this.changePassword(theme, userObj)}
          </Col>
          <Col span={12} style={{paddingLeft: 15}}>
            {this.getForm(theme, userObj, false)}
          </Col>
        </Row>
      </div>
    );
  }
  private changePassword(theme: any, userObj: any) {
    const style = GetStyle.formDiv(theme);
    const keyList = ["currentPassword", "newPassword", "confirmPassword"];
    const labelList = ["Current Password", "New Password", "Confirm Password"];
    return (
      <div style={{width: "100%", ...style, marginTop: 30}}>
        <Row style={{color: theme.value}}>
          <BlockTitle title="Change Password" Icon={SyncOutlined} color={theme.error} />
        </Row>  
        <Form onFinish={(value: any) => this.handleChangePassword(value, userObj)}
          style={{width: "70%"}} ref={this.passwordForm}>
          {keyList.map((key: string, index: number) => {
            return (
              this.getFormItem(theme, key, labelList[index],
                "password", [], true)
            )
          })}
          <Form.Item>
            <Button className={`button-${theme.themeName}`} style={{marginTop: 15}} type="default" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
  private getTitle(theme: any) {
    const title = "Account";
    return (
      <Row>
        <span>{title}</span>
      </Row>
    );
  }
  private getForm(theme: any, userObj: any, getEditable: boolean) {
    const questionColumnList = ["own_question_list", "do_question_list"];
    const style = GetStyle.formDiv(theme);
    const inputStyle = GetStyle.formInput(theme, false);
    const [title, Icon] = (getEditable)
      ? ["User Info", InfoCircleOutlined]
      : ["Extra Info", StarOutlined];
    return (
      <div style={{width: "100%", ...style}}>
        <Row style={{color: theme.value}}>
          <BlockTitle title={title} Icon={Icon} color={theme.info} />
        </Row>
        <Form onFinish={(value: any) => this.handleSubmit(value, userObj)}
          className="account-form"
          style={{width: "70%"}}>
          {userColumnObjList.map((useObj: any) => {
            const {name, type, limit, action} = useObj;
            const label = labelRef[name];
            const isEditable = !action.includes("null");
            if (getEditable !== isEditable) {return null; }
            const checkShow = this.checkShowFormItem(name);
            if (!checkShow) {return null; }
            if (questionColumnList.includes(name)) {
              return this.getFormItem(theme, name, label, type, limit, isEditable);
            } else {
              return this.getFormItem(theme, name, label, type, limit, isEditable);
            }
          })}
          {getEditable &&
            <Form.Item>
              <Button className={`button-${theme.themeName}`} style={{marginTop: 15}} type="default" htmlType="submit">
                Save
              </Button>
            </Form.Item>}
        </Form>
      </div>
    );
  }
  private handleTypeValue(name: string, value: any) {
    if (name.includes("is_")) {
      const value = (name === "is_show_value_and_question")
        ? this.state.is_show_value_and_question
        : this.state.is_show_information;
      return value;
    }
    if (name.includes("date")) {
      return moment(value);
    }
    if (name === "created_date") {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    return value;
  }
  private itemDefaultValue(name: string) {
    return this.handleTypeValue(name, this.props.userObj[name]);
  }
  private getFormItem(theme: any, name: string, label: string, type: string, limit: string[], isEditable: boolean,) {
    const color = (name.includes("option_")) ? theme.value : theme.title;
    const initialValue = this.itemDefaultValue(name);
    return (
      <Form.Item initialValue={initialValue}
        label={this.getLabel(label, color, "")}
        name={name} className={`form-item-${theme.themeName}`}>
        {this.getInput(name, type, limit, theme, isEditable)}
      </Form.Item>
    );
  }
  private getInput(name: string, type: string, limit: string[], theme: any, isEditable: boolean) {
    const backgroundColor = theme.surface;
    const border = `2px solid ${theme.surface}`;
    const color = theme.value;
    const style = {backgroundColor, border, color};
    if (type === "select") {
      return this.getSelect(name, limit, theme);
    } else if (type === "date") {
      return this.getTextInput(isEditable, theme);
    } else if (type === "password") {
      return this.getTextInput(isEditable, theme, true);
    }
    return this.getTextInput(isEditable, theme);
  }
  private getTextInput(isEditable: boolean, theme: any, isPassword?: boolean) {
    const color = isEditable ? theme.value : theme.subText;
    const style = GetStyle.formInput(theme, !isEditable);
    const passwordClass = `account-password-${theme.themeName}`;
    if (isPassword) {
      return <Input.Password style={{width: 200, ...style}}
        disabled={!isEditable} className={passwordClass}
        iconRender={visible => (visible ? <EyeOutlined style={{color: theme.value}} /> : <EyeInvisibleOutlined style={{color: theme.value}} />)}
        />;
    }
    return (
      <Input style={{width: 200, ...style}}
        disabled={!isEditable} />
    );
  }
  private getSelect(name: string, limit: any[], theme: any) {
    const value = (name === "is_show_value_and_question")
      ? this.state.is_show_value_and_question
      : this.state.is_show_information;
    return (
      <Select style={{width: 200}}
        className="form-select" value={value}
        onChange={(value: string) => this.checkChangeSelect(name, value)}
        >
        {limit.map((item: any) => {
          const label = item;
          return (
            <Option value={item}>
              {label}
            </Option>
          );
        })}
      </Select>
    );
  }
  private checkChangeSelect(name: string, value: string) {
    if (name === "is_show_value_and_question") {
      this.setState({is_show_value_and_question: value});
    }
    if (name === "is_show_information") {
      this.setState({is_show_information: value});
    }
  }
  private getLabel(text: string, color: string, Icon: any) {
    return (
      <Row style={{width: "100vw"}}>
        <span style={{color, fontSize: 15, fontWeight: 600}}>{text}</span>
        <br />
      </Row>
    );
  }
  private checkShowFormItem(name: string) {
    const notShowList = ["password", "own_question_list", "do_question_list"];
    if (notShowList.includes(name)) {return false; }
    return true;
  }
  private getEditColumn(objColumnList: any[]) {
    const columnList: string[] = [];
    for (let i = 0 ; i < objColumnList.length ; i++) {
      const useObj = objColumnList[i];
      const {action, name} = useObj;
      if (action.includes("edit")) {
        columnList.push(name);
      }
    }
    return columnList;
  }
  private createEditObj(formObj: any, userObj: any, columnList: string[]) {
    const editObj: any = {};
    for (let i = 0 ; i < columnList.length ; i++) {
      if (formObj[columnList[i]] !== userObj[columnList[i]]) {
        editObj[columnList[i]] = formObj[columnList[i]];
      }
    }
    return editObj;
  }
  private checkPasswordValid(password: string) {
    if (!password) {return false;}
    if (password.length < 8) {
      TypeNotification("error", "New Password atleast length 8");
      return false;
    }
    return true;
  }
  private async handleChangePassword(value: any, userObj: any) {
    const {currentPassword, newPassword, confirmPassword} = value;
    if (!this.checkPasswordValid(newPassword)) {
      return false;
    }
    if (newPassword !== confirmPassword) {
      TypeNotification("error", "new password and confirm password not match");
      return;
    }
    if (newPassword === currentPassword) {
      TypeNotification("error", "New Password can not same as current");
      return;
    }
    const url = QueryManage.createUrl("/user/changepassword");
    const result = await QueryManage.makeRequest("token", url, "post",
      {username: userObj.username, password: currentPassword, newPassword});
    if (!result.data) {
      TypeNotification("error", "Change password fail");
      return;
    }
    if (result.data.success) {
      TypeNotification("success", "Change Password Success");
      this.passwordForm.current.resetFields();
    } else {
      TypeNotification("error", "Change password fail");
    }
  }
  private async handleSubmit(value: any, userObj: any) {
    value.is_show_information = this.state.is_show_information;
    value.is_show_value_and_question = this.state.is_show_value_and_question;
    const columnList = this.getEditColumn(userColumnObjList);
    const editObj = this.createEditObj(value, userObj, columnList);
    if (Object.keys(editObj).length === 0) {
      TypeNotification("error", "Nothing Change");
      return;
    }
    const url = QueryManage.createUrl("/user/edit");
    const putEdit = await QueryManage.makeRequest(userObj.token, url, "put", editObj);
    if (putEdit.data.success) {
      TypeNotification("success", "Edit Success");
      this.props.getUserData();
    } else {
      TypeNotification("error", "Edit User Fail");
    }
  }
}

export default Account;
