import React from "react";
import {Layout, Menu} from "antd";
import {
  UnorderedListOutlined,
  EditOutlined,
  UserOutlined,
  LineChartOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import UtilContext from "../context/utilcontext";
import logoLight from "../assets/image/logo-light.png";
import logoCircleLight from "../assets/image/logo-circle-light.png";
import logo from "../assets/image/logo.png";
import logoDark from "../assets/image/logo-dark.png";
import logoCircleDark from "../assets/image/logo-circle-dark.png";
import "./styles.css";

const {Sider} = Layout;
const {Item} = Menu;

type SideBarProps = {
  sideBarCollapsed: boolean,
  selectedKey: string,
  changeSelectedKey: (key: string) => void,
};

type SideBarState = {
  mouseOverKey: string,
};

const menuItemList = [
  {key: "question-list", text: "Question List", Icon: UnorderedListOutlined},
  {key: "create-question", text: "Create Question", Icon: EditOutlined},
  {key: "profile", text: "Profile", Icon: ProjectOutlined},
  {key: "account", text: "Account", Icon: UserOutlined},
];

class SideBar extends React.Component<SideBarProps, SideBarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseOverKey: "",
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
    const {userObj} = utilObj;
    const {sideBarBackground, title, logoBackground, border} = utilObj.theme;
    return (
      <Sider style={{height: "100vh", backgroundColor: sideBarBackground}} trigger={null} collapsible
        collapsed={this.props.sideBarCollapsed}>
        {this.getLogo(utilObj.sizeObj.headerHeight, utilObj.theme)}
        <Menu mode={"inline"} style={{backgroundColor: sideBarBackground, color: title,
          borderRight: "0px solid #000000"}} selectedKeys={[this.props.selectedKey]}>
          {this.getMenuItemList(menuItemList, utilObj.theme, userObj)}
        </Menu>
      </Sider>
    );
  }
  private getMenuItemList(menuItemList: any[], theme: any, userObj: any) {
    return menuItemList.map((item: any, index: number) => {
      return this.getMenuItem(item, index, theme, userObj);
    });
  }
  private getMenuItem(item: any, index: number, theme: any, userObj: any) {
    let {key, text, Icon} = item;
    if (key !== "question-list") {
      if (!userObj) {return null; }
      if (!userObj.user_id) {return null; }
      if (userObj.user_id < 0) {return null; }
    }
    if (key === "profile") {
      key = `profile/${userObj.user_id}`;
    }
    const marginTop = (index === 0) ? 10 : 0;
    const [backgroundColor, color] = this.getTextColorAndBackgroundColor(key, theme);
    return (
      <Item style={{marginTop, backgroundColor}} key={key} onMouseEnter={() => this.changeMouseOverKey(key)}
        onMouseLeave={() => this.changeMouseOverKey("")}
        onClick={() => this.props.changeSelectedKey(key)}>
        <Link to={`/${key}`}>
          <Icon style={{color}} />
          <span style={{color}}>{text}</span>
        </Link>
      </Item>
    );
  }
  private changeMouseOverKey(key: string) {
    this.setState({mouseOverKey: key});
  }
  private getTextColorAndBackgroundColor(key: string, theme: any) {
    const {title, select, mouseOver, sideBarBackground, selectText, mouseOverText} = theme;
    const {selectedKey} = this.props;
    const {mouseOverKey} = this.state;
    const textColor = (selectedKey === key) ? selectText
      : (mouseOverKey === key) ? mouseOverText : title;
    const backgroundColor = (selectedKey === key) ? select
      : (mouseOverKey === key) ? mouseOver : sideBarBackground;
    return [backgroundColor, textColor];
  }
  private getLogo(height: number, theme: any) {
    const {themeName, background, border} = theme;
    const {sideBarCollapsed} = this.props;
    const useLogo = (sideBarCollapsed)
      ? (themeName === "light") ? logo : logo
      : (themeName === "light") ? logoLight : logoDark;
      const imageClassName = (sideBarCollapsed) ? "smallLogo" : "logo";
    return (
      <div className={"logo-container"}
        style={{height, width: "100%", backgroundColor: theme.logoBackground, borderRight: `0px solid ${border}`, borderBottom: `0px solid ${border}`}}>
        {false && <img
          alt={"Symbior Solar Siam"}
          src={useLogo}
          className={imageClassName}
        />}
      </div>
    );
  }
}

export default SideBar;
