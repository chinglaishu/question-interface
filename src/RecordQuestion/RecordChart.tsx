import React from "react";
import UtilContext from "../context/utilcontext";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import moment from "moment-timezone";
import NumberHandler from "../util/NumberHandler";
import GetStyle from "../util/getStyle";
import LargeBlockTitle from "../util/LargeBlockTitle";
import {
  LineChartOutlined,
} from '@ant-design/icons';
import questionconfig from "../config/questionconfig";

type RecordChartProps = {
  recordChartDataList: any[],
};

type RecordChartState = {

};

class RecordChart extends React.Component<RecordChartProps, RecordChartState> {
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
      <div style={{width: "100%", padding: 20, marginBottom: 20}}>
        <div style={{...style, paddingLeft: 30, paddingTop: 30}}>
          <LargeBlockTitle Icon={LineChartOutlined} title={"Record Chart"}
            color={theme.secondary} />
          {this.getChart(theme)}
        </div>
      </div>
    );

    return (
      <div style={{width: "100%", paddingTop: 40}}>
        {this.getChart(theme)}
      </div>
    );
  }
  private getChart(theme: any) {
    const {recordChartDataList} = this.props;
    const timeFormat = "MM-DD HH:mm:ss";
    const ChartRef = questionconfig.getChartRef(theme);
    return (
      <ResponsiveContainer width={"100%"} height={500}>
        <LineChart
          data={recordChartDataList}
          margin={{
            top: 40, right: 40, left: -20, bottom: 0,
          }}
        >
          <CartesianGrid strokeOpacity={0.2} vertical={false} />
          <XAxis dataKey="timestamp"
            tickFormatter = {(unixTime) => moment(unixTime).tz("Asia/Bangkok").format(timeFormat)}/>
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
  private getLineList(theme: any) {
    const chartRef = questionconfig.getChartRef(theme);
    const keyList = Object.keys(chartRef);
    const currentAction = "record";
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
  private getLegend(props: any, theme: any) {
    const {payload} = props;
    return (
      <ul>
        {
          payload.map((entry, index) => (
            <li key={`item-${index}`}>{entry.value}</li>
          ))
        }
      </ul>
    );
  }
}

export default RecordChart;
