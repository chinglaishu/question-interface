import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Descriptions, Collapse, Col} from "antd";
import moment from "moment-timezone";
import UserConfig from "../config/userconfig";
import GetStyle from "../util/getStyle";
import {
  StarOutlined,
} from '@ant-design/icons';
import BlockTitle from "../util/BlockTitle";

type UserDescriptionBlockProps = {
  targetUserObj: any,
};

type UserDescriptionBlockState = {

};

class UserDescriptionBlock extends React.Component<UserDescriptionBlockProps, UserDescriptionBlockState> {
  constructor(props: any) {
    super(props);
    this.state = {
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
    const style = GetStyle.formDiv(theme);
    return (
      <div style={{width: "100%", height: "100%", padding: 20, paddingTop: 5}}>
        <div style={{minHeight: 100, ...style, padding: 10}}>
          {this.getDescriptionBlock(theme)}
        </div>
      </div>
    );
  }
  private getDescriptionBlock(theme: any) {
    const {targetUserObj} = this.props;
    if (!targetUserObj) {return null; }
    const keyList = Object.keys(targetUserObj);
    return (
      <Descriptions colon={false} style={{marginTop: 10, paddingLeft: 15, paddingRight: 15}}
        column={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 6}} title={this.getLargeTitle(theme, "User Info")}>
        {keyList.map((key: string) => {
          if (UserConfig.descriptionExcludeList.includes(key)) {return null; }
          const label = UserConfig.labelRef[key];
          const value = targetUserObj[key];
          return this.getDescriptionItem(theme, key, label, value);
        })}
      </Descriptions>
    );
  }
  private getDescriptionItem(theme: any, key: string, label: string, value: any) {
    if (value === null) {value = "null"}
    return (
      <Descriptions.Item label={this.getInfoLabel(theme.title, label)}>
        {this.getInfoText(theme.value, key, value)}
      </Descriptions.Item>
    )
  }
  private getInfoLabel(color: string, label: string) {
    return <span style={{color}}>{label}</span>;
  }
  private getInfoText(color: string, key: string, value: any) {
    if (key.includes("date")) {
      value = moment(value).format("YYYY-MM-DD HH:mm:ss");
    }
    return (
      <span style={{color}}>{value}</span>
    );
  }
  private getLargeTitle(theme: any, title: string) {
    return (
      <Row style={{paddingLeft: 0, paddingTop: 0,
        marginBottom: 0}}>
        <StarOutlined style={{fontSize: 20, color: theme.info}} />
        <span style={{fontSize: 18, color: theme.value, fontWeight: 600, marginTop: -4,
          marginLeft: 5}}>{title}</span>
      </Row>
    );
  }
}

export default UserDescriptionBlock;
