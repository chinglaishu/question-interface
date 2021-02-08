import React from "react";
import UtilContext from "../context/utilcontext";
import QueryManage from "../util/QueryManage";
import UtilFunction from "../util/utilfunction";
import moment from "moment-timezone";
import NumberHandler from "../util/NumberHandler";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import QuestionConfig from "../config/questionconfig";
import GetStyle from "../util/getStyle";
import LargeBlockTitle from "../util/LargeBlockTitle";
import {
  LineChartOutlined,
} from '@ant-design/icons';
import {Row} from "antd";
import questionconfig from "../config/questionconfig";

type UserChartProps = {
  chartDataList: any[],
};

type UserChartState = {

};

class UserChart extends React.Component<UserChartProps, UserChartState> {
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }
  public componentDidMount() {
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
      <div style={{width: "100%", padding: 20}}>
        <div style={{...style, paddingLeft: 30, paddingTop: 25}}>
          <LargeBlockTitle Icon={LineChartOutlined} title={"User Chart"}
            color={theme.secondary} />
          {this.getChart(theme)}
        </div>
      </div>
    );
  }
  private getChart(theme: any) {
    const {chartDataList} = this.props;
    if (!chartDataList) {return this.getHideByUser(theme); }
    if (chartDataList.length === 0) {return this.getHideByUser(theme); }
    const timeFormat = "MM-DD";
    const ChartRef = questionconfig.getChartRef(theme);
    return (
      <ResponsiveContainer width={"100%"} height={500}>
        <LineChart
          data={chartDataList}
          margin={{
            top: 40, right: 40, left: -20, bottom: 0,
          }}
        >
          <CartesianGrid strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="timestamp"
            tickFormatter = {(unixTime) => moment(unixTime * 1000).tz("Asia/Bangkok").format(timeFormat)}/>
          <YAxis type="number" interval="preserveStartEnd" orientation="left"
            tickFormatter={(value: number) => NumberHandler.NumberFormatter(Number(value.toFixed(1)))} yAxisId={0}/>
          <YAxis type="number" interval="preserveStartEnd" orientation="right"
            tickFormatter={(value: number) => "$" + NumberHandler.NumberFormatter(Number(value.toFixed(1)))} yAxisId={1}/>
          <Tooltip contentStyle={{color: theme.value, backgroundColor: theme.inputBackground, border: `2px solid ${theme.divider}`}}
            labelFormatter={(label: any) => {
              return moment(label * 1000).format("MM-DD");
            }} />
          <Legend formatter={(value: any) => {
              let showText = value;
              if (!!ChartRef[value]) {
                showText = ChartRef[value].label;
              }
              return (
                <span style={{color: theme.title}}>{showText}</span>
              );
            }} />
            {this.getLineList(theme)}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  private getHideByUser(theme: any) {
    return (
      <Row>
        <span style={{color: theme.title}}>Hided By Owner</span>
      </Row>
    );
  }
  private getLineList(theme: any) {
    const chartRef = QuestionConfig.getChartRef(theme);
    const keyList = Object.keys(chartRef);
    const currentAction = "profile";
    return keyList.map((key: string) => {
      const {stroke, inside} = chartRef[key];
      if (!inside.includes(currentAction)) {return null; }
      const yAxisId = (key === "totalValue" || key === "totalGain")
        ? 1 : 0;
      return (
        <Line type="monotone" dataKey={key} stroke={stroke}
          yAxisId={yAxisId} dot={false} />
      );
    });
  }
}

export default UserChart;
