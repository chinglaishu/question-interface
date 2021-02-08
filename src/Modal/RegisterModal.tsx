import React from "react";
import UtilContext from "../context/utilcontext";
import {Modal, Row, Form} from "antd";
import "../QuestionList/modalStyles.css";
import {
  LoginOutlined
} from '@ant-design/icons';
import GetStyle from "../util/getStyle";
import UtilFunction from "../util/utilfunction";
import FormHelper from "../util/FormHelper";
import UserConfig from "../config/userconfig";
import "./styles.css";
import QueryManage from "../util/QueryManage";
import TypeNotification from "../util/createnotification";

type RegisterModalProps = {
  clickButtonNum: number,
};

type RegisterModalState = {
  visible: boolean,
};

class RegisterModal extends React.Component<RegisterModalProps, RegisterModalState> {
  private loginFormRef: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.loginFormRef = React.createRef();
    this.state = {
      visible: false,
    }
  }
  public componentDidUpdate(prevProps: RegisterModalProps) {
    if (prevProps.clickButtonNum !== this.props.clickButtonNum) {
      this.setState({visible: true});
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
    return (
      <Modal
        title={this.getTitle(theme)}
        visible={this.state.visible}
        onOk={() => this.clickOk()}
        onCancel={() => this.clickCancel()}
        cancelText={"Close"}
        okText={"Register"}
        okType={"default"}
        centered={true}
        bodyStyle={{}}
        style={{minWidth: 600, padding: 40}}
        closable={false}
        wrapClassName={`modal-${theme.themeName}`}
      >
        {this.getForm(theme)}
      </Modal>
    );
  }
  private getForm(theme: any) {
    const style = GetStyle.formDiv(theme);
    const {registerColumnObjList, labelRef} = UserConfig;
    return (
      <div className={`form-div-${theme.themeName}`} style={{width: "100%"}}>
        <Form ref={this.loginFormRef} onFinish={(value: any) => this.handleSubmit(value)} className="create-question-form"
          style={{width: "70%"}}>
          {registerColumnObjList.map((useObj: any) => {
            const {name, type, limit} = useObj;
            const label = labelRef[name];
            return FormHelper.getFormItem(theme, name, label, type, limit);
          })}
        </Form>
      </div>
    );
  }
  private getTitle(theme: any) {
    return (
      <Row>
        <LoginOutlined style={{color: theme.secondary, fontSize: 20,
          marginRight: 0, marginTop: 6}}/>
        <span style={{marginTop: 5, fontSize: 18, fontWeight: 600, marginLeft: 5
          , color: theme.value}}>
          Register
        </span>
    </Row>
    )
  }
  private clickOk() {
    this.loginFormRef.current.submit();
  }
  private async handleSubmit(value: any) {
    const {username, password, confirm_password} = value;
    if (!username || !password || !confirm_password) {
      TypeNotification("error", "can not be empty");
      return;
    }
    if (password !== confirm_password) {
      TypeNotification("error", "password not match with confirm password");
      return;
    }
    if (password.length < 8) {
      TypeNotification("error", "password can not less than 8");
      return;
    }
    const url = QueryManage.createUrl("/user/new");
    const postCreateUser = await QueryManage.makeRequest("token", url, "post", {username, password});
    if (postCreateUser.data.success) {
      TypeNotification("success", "create user success!");
    } else {
      TypeNotification("error", "create user fail, username exist")
    }
  }
  private clickCancel() {
    this.setState({visible: false});
  }
}

export default RegisterModal;
