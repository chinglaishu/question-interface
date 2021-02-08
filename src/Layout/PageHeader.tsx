import React from "react";
import { Layout, Row, Avatar, Dropdown, Switch, Button } from "antd";
import UtilContext from "../context/utilcontext";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DollarOutlined,
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  MehOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import "./styles.css";
import TypeNotification from "../util/createnotification";
import QueryManage from "../util/QueryManage";

const {Header} = Layout;

type PageHeaderProps = {
  sideBarCollapsed: boolean,
  changeTheme: () => void,
  clickCollapse: () => void,
  clickModalButton: (name: string) => void,
  loginSuccess: (token: string, user_id: number, isRemember: boolean) => void,
};

type PageHeaderState = {
  mouseOverKey: string,
  dropDownVisible: boolean,
};

class PageHeader extends React.Component<PageHeaderProps, PageHeaderState> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseOverKey: "",
      dropDownVisible: false,
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
      <Header style={{height: sizeObj.headerHeight, backgroundColor: theme.headerBackground,
        margin: 0, padding: "0px 10px 0px 20px" }}>
        <Row style={{height: sizeObj.headerHeight}} align="middle"
          justify="space-between">
          {this.getCollapseTrigger(theme, sizeObj.headerHeight)}
          {userObj.isLogin && this.getUserInfo(theme, userObj, sizeObj)}
          {!userObj.isLogin && this.getNotLogin(theme, sizeObj)}
        </Row>
      </Header>
    );
  }
  private getNotLogin(theme: any, sizeObj: SizeObj) {
    return (
      <Row style={{height: "100%"}}>
        {this.getTextAndIcon("loginAsGuest", "Login As Guest", UserSwitchOutlined, theme, sizeObj, 15)}
        {this.getTextAndIcon("register", "Register", UserAddOutlined, theme, sizeObj, 15)}
        {this.getTextAndIcon("login", "Login", LoginOutlined, theme, sizeObj, 0)}
      </Row>
    )
  }
  private getUserInfo(theme: any, userObj: UserObj, sizeObj: SizeObj) {
    const {headerDiffHeight, headerHeight} = sizeObj;
    const marginTop = headerDiffHeight * -1;
    const fontSize = headerHeight * 0.375;
    const iconFontSize = headerHeight * 0.4;
    const marginRight = 10;
    const [backgroundColor, color] = this.getColor("user", theme);
    const isShowReset = userObj.user_id === 1;
    return (
      <Row style={{height: "100%", color: theme.title, fontSize}} align="middle" justify="end">
        {isShowReset &&
          <Row style={{height: "100%", marginTop, marginRight}} align="middle">
            <span className="hover-pointer"
              style={{marginRight: 10, fontSize: 12}}
              onClick={() => this.resetData()}>
              Reset All Data
            </span>
          </Row>}
        <Row style={{height: "100%", marginTop, marginRight}} align="middle">
          <DollarOutlined style={{marginRight: 5, fontSize: iconFontSize}} />
          <span style={{marginRight: 10}}>
            {userObj.value}
          </span>
        </Row>
        <Dropdown overlay={this.getDropDown(theme)}
          placement={"bottomRight"} visible={this.state.dropDownVisible}>
          <Row className="hover-pointer" style={{height: headerHeight + headerDiffHeight, marginTop,
            color, padding: "0px 10px 0px 10px"}} align="middle"
            onMouseEnter={() => this.setState({mouseOverKey: "user"})}
            onMouseLeave={() => this.setState({mouseOverKey: ""})}
            onClick={() => this.setState({dropDownVisible: !this.state.dropDownVisible})}>
            <span style={{marginRight: 10, marginTop: headerDiffHeight * 0.5,
              fontSize: headerHeight * 0.3}}>
              {userObj.username}
            </span>
            <Avatar style={{marginTop: headerDiffHeight * 0.5}} icon={<UserOutlined />} />
          </Row>
        </Dropdown>
      </Row>
    );
  }
  private getDropDown(theme: any) {
    return (
      <div style={{backgroundColor: theme.surface, color: theme.title,
        padding: "15px 15px 15px 15px"}}>
        <Row style={{width: "100%", marginBottom: 10, paddingBottom: 10,
          borderBottom: `1px solid ${theme.divider}`}}>
          <MehOutlined style={{marginRight: 5, marginTop: 3}} />
          <span style={{marginRight: 5}}>Dark Theme</span>
          <Switch style={{width: 20}} onChange={() => this.props.changeTheme()}
            checked={theme.themeName === "dark"} />
        </Row>
        <Row className="hover-pointer" style={{width: "100%"}}
          onClick={() => this.logout()}>
          <LogoutOutlined style={{marginRight: 5, marginTop: 4 }}/>
          <span style={{marginRight: 5}}>Logout</span>
        </Row>
      </div>
    );
  }
  private logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.reload();
  }
  private getTextAndIcon(key: string, text: string, Icon: any, theme: any, sizeObj: SizeObj, marginRight: number) {
    const {headerDiffHeight, headerHeight} = sizeObj;
    const marginTop = headerDiffHeight * -1;
    const fontSize = headerHeight * 0.5;
    const iconFontSize = headerHeight * 0.35;
    const [backgroundColor, color] = this.getColor(key, theme);
    const [showText, iconMarginRight, iconMarginTop] = this.getIconMarginRightAndTop(headerDiffHeight);
    const useFunction = (key === "loginAsGuest")
      ? this.loginAsGuest.bind(this)
      : this.props.clickModalButton;
    return (
      <Row style={{height: "100%", color: theme.title, fontSize, marginRight}} align="middle" justify="end">
        <Row className="hover-pointer" style={{height: headerHeight + headerDiffHeight, marginTop,
          color, marginRight: 15}} align="middle"
          onMouseEnter={() => this.setState({mouseOverKey: key})}
          onMouseLeave={() => this.setState({mouseOverKey: ""})}
          onClick={() => useFunction(key)}>
          <Icon style={{marginRight: iconMarginRight, fontSize: iconFontSize, marginTop: iconMarginTop}} />
          {showText && <span style={{marginRight: 0, marginTop: headerDiffHeight * 0.5,
            fontSize: headerHeight * 0.325}}>
            {text}
          </span>}
        </Row>
      </Row>
    );
  }
  private async loginAsGuest() {
    const username = "guest";
    const password = "guest1234";
    const url = QueryManage.createUrl("/user/login");
    const result = await QueryManage.makeRequest("token", url, "post", {username, password});
    if (!result.data) {
      TypeNotification("error", "Login Fail");
      return;
    }
    if (!result.data.success) {
      TypeNotification("error", "Login Fail");
      return;
    }
    const {token, user_id} = result.data;
    this.props.loginSuccess(token, user_id, true);
  }
  private getUserIcon(theme: any) {
    return (
      <Avatar>User</Avatar>
    );
  }
  private getIconMarginRightAndTop(headerDiffHeight: number) {
    const width = window.innerWidth;
    return (width < 600)
      ? [false, 0, headerDiffHeight] : [true, 5, headerDiffHeight * 0.5];
  }
  private getCollapseTrigger(theme: any, height: number) {
    const {sideBarCollapsed} = this.props;
    const ButtonIcon = (sideBarCollapsed) ? MenuUnfoldOutlined : MenuFoldOutlined;
    const fontSize = height * 0.4;
    // eslint-disable-next-line
    const [_, color] = this.getColor("collapse", theme);
    return (
      <ButtonIcon style={{fontSize, color}}
        onClick={() => this.props.clickCollapse()}
        onMouseEnter={() => this.setState({mouseOverKey: "collapse"})}
        onMouseLeave={() => this.setState({mouseOverKey: ""})} />
    );
  }
  private getColor(key: string, theme: any) {
    return (key === this.state.mouseOverKey)
      ? ["#FFFFFF30", theme.title]
      : ["#FFFFFF20", theme.subText];
  }
  private async resetData() {
    const url = QueryManage.createUrl("/question/create-fake-data");
    await QueryManage.makeRequest("null", url, "post", {});
  }
}

export default PageHeader;
