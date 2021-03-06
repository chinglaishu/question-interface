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

type LoginModalProps = {
  loginSuccess: (token: string, user_id: number, isRemember: boolean) => any,
  clickButtonNum: number,
};

type LoginModalState = {
  visible: boolean,
  showInvalid: boolean,
};

class LoginModal extends React.Component<LoginModalProps, LoginModalState> {
  private loginFormRef: React.RefObject<any>;
  constructor(props: any) {
    super(props);
    this.loginFormRef = React.createRef();
    this.state = {
      visible: false,
      showInvalid: false,
    }
  }
  public componentDidUpdate(prevProps: LoginModalProps) {
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
        okText={"Login"}
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
    const {loginColumnObjList, labelRef} = UserConfig;
    return (
      <div className={`form-div-${theme.themeName}`} style={{width: "100%"}}>
        <Form ref={this.loginFormRef} onFinish={(value: any) => this.handleSubmit(value)} className="create-question-form"
          style={{width: "70%"}}>
          {loginColumnObjList.map((useObj: any) => {
            const {name, type, limit} = useObj;
            const label = labelRef[name];
            if (name === "is_remember") {
              return (
                <>
                  {this.state.showInvalid && <span style={{color: theme.error, marginBottom: 20}}>Invaild username or password!</span>}
                  {FormHelper.getFormItem(theme, name, label, type, limit)}
                </>
              );
            }
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
          Login
        </span>
    </Row>
    )
  }
  private clickOk() {
    this.loginFormRef.current.submit();
  }
  private async handleSubmit(value: any) {
    const {username, password, is_remember} = value;
    const url = QueryManage.createUrl("/user/login");
    const result = await QueryManage.makeRequest("token", url, "post", {username, password});
    if (!result.data) {
      this.setState({showInvalid: true});
      TypeNotification("error", "Login Fail");
      return;
    }
    if (!result.data.success) {
      this.setState({showInvalid: true});
      TypeNotification("error", "Login Fail");
      return;
    }
    const {token, user_id} = result.data;
    const isRemember = (!!is_remember);
    this.setState({visible: false});
    this.props.loginSuccess(token, user_id, isRemember);
  }
  private clickCancel() {
    this.setState({visible: false});
  }
}

export default LoginModal;
