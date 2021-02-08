import React from "react";
import {Form, Row, Input, Checkbox, Select, InputNumber} from "antd";
import GetStyle from "../util/getStyle";
import {
  UserOutlined,
  InfoCircleOutlined,
  StarOutlined,
  SyncOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import "../QuestionList/modalStyles.css";
import "../styles/selectStyles.css";
import moment from "moment-timezone";
import UtilFunction from "../util/utilfunction";

const {Option} = Select;
const alphabetString = UtilFunction.getAlphabetList();

const FormHelper = {
  getFormItem(theme: any, name: string, label: string, type: string, useObj?: any, limit?: any[]) {
    const color = theme.title;
    const initialValue = (type === "boolean") ? false : this.itemDefaultValue(name, useObj);
    const required = type !== "boolean";
    return (
      <Form.Item getValueFromEvent={(e: any) => {
          if (type === "boolean") {
            return e.target.checked;
          } else if (type === "select" || type === "number") {
            return e;
          } else {
            return e.target.value;
          }
        }}
        label={this.getLabel(label, color, type)} initialValue={initialValue}
        name={name} className={`form-item-${theme.themeName}`}>
        {this.getInput(name, type, theme, limit)}
      </Form.Item>
    );
  },
  getLabel(text: string, color: string, type: string) {
    if (type === "boolean") {
      return (
        <span style={{color}}>{text}</span>
      );
    }
    return (
      <Row style={{width: "100vw"}}>
        <span style={{color}}>{text}</span>
        <br />
      </Row>
    );
  },
  getInput(name: string, type: string, theme: any, limit: any) {
    const style = GetStyle.formInput(theme, false);
    const passwordClass = `account-password-${theme.themeName}`;
    if (type === "password") {
      return <Input type="password" autoComplete="new-password" style={{width: 200, ...style}}
        className={passwordClass} />;
    } else if (type === "boolean") {
      return <Checkbox defaultChecked={false} style={{backgroundColor: theme.background, color: theme.value}} />;
    } else if (type === "select") {
      return this.getSelect(name, limit, theme);
    } else if (type === "number") {
      const precision = (name === "choose_number")
        ? 0 : 2;
      return <InputNumber style={style} min={0} precision={precision} />;
    }
    return <Input required={true} autoComplete="new-password" style={style} />;
  },
  getSelect(name: string, limit: any[], theme: any) {
    const style = GetStyle.selectOption(theme);
    return (
      <Select style={{width: "200px"}} dropdownStyle={{padding: 0}}>
        {limit.map((item: any) => {
          const label = (name === "correct_answer")
            ? alphabetString[item] : item;
          return (
            <Option style={style} value={item}>
              {label}
            </Option>
          );
        })}
      </Select>
    );
  },
  itemDefaultValue(name: string, useObj: any) {
    if (!useObj) {return null; }
    if (!useObj[name]) {return null; }
    return this.handleTypeValue(name, useObj[name]);
  },
  handleTypeValue(name: string, value: any) {
    if (name.includes("is_")) {
      return (!!value);
    }
    if (name.includes("date")) {
      return moment(value);
    }
    return value;
  }
}

export default FormHelper;
