import React from "react";
import UtilContext from "../context/utilcontext";
import {Row, Button, Checkbox} from "antd";

const CheckboxGroup = Checkbox.Group;

type CustomCheckboxProps = {
  changeList: (useList: string[]) => void,
  allDataList: string[],
  refObj: any,
  initialDataList: string[],
};

type CustomCheckboxState = {
  visibleDataList: string[],
  indeterminate: boolean,
  checkAll: boolean,
};

const extraDataList: string[] = ["quesiton_id", "user_id", "ratio_type", "option_list",
  "choose_number", "choose_record", "minimum_fee", "maximum_fee",
  "initial_pool", "other_pool", "add_pool_percentage"];

const otherDataList: string[] = ["attempt_number", "winner_number",
  "end_requirement", "end_requirement_value", "visible_date",
  "open_date", "close_date", "end_date"];

const allDataList = extraDataList.concat(otherDataList);

class CustomCheckbox extends React.Component<CustomCheckboxProps, CustomCheckboxState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visibleDataList: this.props.initialDataList,
      indeterminate: this.props.initialDataList.length > 0,
      checkAll: this.props.initialDataList.length === this.props.allDataList.length,
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
    const {allDataList, refObj} = this.props;
    const {visibleDataList} = this.state;
    const options = this.dataNameToReadNameList(allDataList, refObj);
    const value = this.dataNameToReadNameList(visibleDataList, refObj);
    return (
      <div style={{width: 400}}>
        <div style={{ borderBottom: "1px solid #E9E9E9" }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange.bind(this)}
            checked={this.state.checkAll}
          >
            Check all
          </Checkbox>
          </div>
          <br />
          <CheckboxGroup
            options={options}
            value={value}
            onChange={(list: any) => this.onChange(this.readNameToDataNameList(list, refObj))}
          />
      </div>
    );
  }
  private dataNameToReadNameList(dataList: string[], refObj: any) {
    return dataList.map((dataKey: string) => {
      const readName = refObj[dataKey];
      if (readName === undefined || readName === null) {
        return dataKey;
      }
      return readName;
    });
  }
  private readNameToDataNameList(nameList: string[], refObj: any) {
    const keyList = Object.keys(refObj);
    const valueList = Object.values(refObj);
    return nameList.map((name: string) => {
      const index = valueList.indexOf(name);
      if (index === -1) {return name; }
      return keyList[index];
    });
  }
  private onChange(visibleDataList: string[]) {
    this.setState({
      visibleDataList,
      indeterminate: !!visibleDataList.length && visibleDataList.length < this.props.allDataList.length,
      checkAll: visibleDataList.length === this.props.allDataList.length,
    }, () => {
      this.props.changeList(this.state.visibleDataList);
    });
  }
  private onCheckAllChange(e: any) {
    this.setState({
      visibleDataList: e.target.checked ? this.props.allDataList : [],
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => {
      this.props.changeList(this.state.visibleDataList);
    });
  }
}

export default CustomCheckbox;
