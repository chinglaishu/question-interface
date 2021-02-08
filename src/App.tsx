import React from "react";
import './App.css';
import Theme from "../src/util/theme";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, withRouter, Redirect } from "react-router-dom";
import SideBar from "./Layout/SideBar";
import PageHeader from "./Layout/PageHeader";
import UtilContext from "./context/utilcontext";
import LoginModal from "./Modal/LoginModal";
import RegisterModal from "./Modal/RegisterModal";
import QueryManage from "./util/QueryManage";
import TypeNotification from "./util/createnotification";
import QuestionListContainer from "./QuestionList/QuestionListContainer";
import QuestionForm from "./QuestionForm/QuestionForm";
import Account from "./Account/Account";
import RecordQuestion from "./RecordQuestion/RecordQuestion";
import Profile from "./Profile/Profile";

const {Content} = Layout;

const {lightTheme, darkTheme, blueTheme} = Theme;
const themeList = ["light", "dark", "blue"];

type AppState = {
  sideBarCollapsed: boolean,
  sizeObj: SizeObj,
  theme: any,
  userObj: UserObj,
  selectedKey: string,
  updateNum: number,
  loginModalNum: number,
  registerModalNum: number,
  currentEditObj: any,
  loadingUserData: boolean,
};

// react set header default as 64, fix some position problem, need header diff
const sizeObj = {
  headerHeight: 50,
  headerDiffHeight: 14,
};

const userObj: UserObj = {
  isLogin: false,
  username: "null",
  password: "null",
  user_id: -1,
  value: 0,
};

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      sideBarCollapsed: false,
      sizeObj: sizeObj,
      theme: darkTheme,
      userObj: userObj,
      selectedKey: "question-list",
      updateNum: 0,
      loginModalNum: 0,
      registerModalNum: 0,
      currentEditObj: {},
      loadingUserData: true,
    }
  }
  public componentDidMount() {
    window.addEventListener("resize", () => {
      this.resize();
    })
    this.checkTokenInStorage();
    this.getSelectedKey();
    this.checkUrl();
  }
  public render() {
    const {sizeObj, theme, userObj, loginModalNum, registerModalNum} = this.state;
    const utilObj: UtilObj = {sizeObj, theme, userObj, getUserData: this.getUserData.bind(this)};
    return (
      <div className={`root-div-${theme.themeName}`} style={{width: "100vw", height: "100vh"}}>
        <UtilContext.UtilProvider value={utilObj}>
          {this.getRouter()}
          <LoginModal clickButtonNum={loginModalNum}
            loginSuccess={this.loginSuccess.bind(this)} />
          <RegisterModal clickButtonNum={registerModalNum} />
        </UtilContext.UtilProvider>
      </div>
    )
  }
  private checkUrl() {
    const pathName = window.location.pathname;
    if (pathName === "/") {
      window.location.pathname = "/question-list";
    }
  }
  private resize() {
    this.setState({updateNum: this.state.updateNum + 1});
  }
  private getRouter() {
    const {sideBarCollapsed, theme, userObj, selectedKey, sizeObj, currentEditObj} = this.state;
    return (
      <Router>
        <Layout>
          <SideBar sideBarCollapsed={sideBarCollapsed} selectedKey={selectedKey}
            changeSelectedKey={this.changeSelectedKey.bind(this)}/>
          <Layout style={{backgroundColor: theme.background}}>
            <PageHeader sideBarCollapsed={sideBarCollapsed}
              clickCollapse={this.clickCollapse.bind(this)}
              clickModalButton={this.clickModalButton.bind(this)}
              changeTheme={this.changeTheme.bind(this)}
              loginSuccess={this.loginSuccess.bind(this)} />
            {!this.state.loadingUserData && <Content style={{height: window.innerHeight - sizeObj.headerHeight, overflow: "auto" }}>
              <Route path="/question-list" render={() => <QuestionListContainer userObj={userObj} targetUserObj={null} />} />
              <Route path="/create-question" render={() => <QuestionForm isCreate={true} />} />
              <Route path="/edit-question/:question_id" render={(props) => <QuestionForm isCreate={false} {...props}
                userObj={userObj} />} />
              <Route path="/record-question/:question_id" render={(props) => <RecordQuestion {...props}
                userObj={userObj} />} />
              <Route path="/profile/:user_id" render={(props) => <Profile {...props}
                userObj={userObj} />} />
              <Route path="/account" render={() => <Account userObj={userObj}
                getUserData={this.getUserData.bind(this)} /> } />
            </Content>}
          </Layout>
        </Layout>
      </Router>
    );
  }
  private async getUserData() {
    const {user_id, token} = this.state.userObj;
    const url = QueryManage.createUrl(`/user/${user_id}`);
    const result = await QueryManage.makeRequest(token, url);
    const userObj = result.data.result;
    userObj.token = token;
    userObj.isLogin = true;
    this.setState({userObj});
  }
  private async loginSuccess(token: string, user_id: number, isRemember: boolean) {
    const url = QueryManage.createUrl(`/user/${user_id}`);
    const result = await QueryManage.makeRequest(token, url);
    if (!result.data.success) {
      TypeNotification("error", "login success but user not exist");
      return false;
    } else {
      TypeNotification("success", "Login success");
    }
    const userObj = result.data.result;
    userObj.token = token;
    userObj.isLogin = true;
    this.setState({userObj, loadingUserData: false});
    if (isRemember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", String(user_id));
    }
    return true;
  }
  private changeSelectedKey(key: string) {
    this.setState({selectedKey: key});
  }
  private clickCollapse() {
    this.setState({sideBarCollapsed: !this.state.sideBarCollapsed});
  }
  private clickModalButton(name: string) {
    if (name === "login") {
      this.setState({loginModalNum: this.state.loginModalNum + 1});
    }
    if (name === "register") {
      this.setState({registerModalNum: this.state.registerModalNum + 1});
    }
  }
  private changeTheme() {
    const nextTheme = (this.state.theme.themeName === "dark")
      ? lightTheme : darkTheme;
    this.setState({theme: nextTheme});
  }
  private getSelectedKey() {
    const location = window.location.href;
    const cutHttp = location.split("//")[1];
    const key = cutHttp.split("/")[1];
    this.setState({selectedKey: key});
  }
  private checkTokenInStorage() {
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    if (!token || !user_id) {
      this.notUserAction();
      return;
    }
    const use_user_id = parseInt(user_id);
    this.loginSuccess(token, use_user_id, false);
  }
  private notUserAction() {
    const currentPath = window.location.pathname;
    const correctPath = "/question-list";
    if (currentPath !== correctPath) {
      window.location.pathname = correctPath;
    }
    this.setState({loadingUserData: false});
  }
}

export default App;
