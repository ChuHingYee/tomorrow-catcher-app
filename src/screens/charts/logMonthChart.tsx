import React, {useRef, useEffect, useState} from 'react';
import {formatDateTime} from '@utils/index';
import {RNWebChart} from '@react-native-web-charts/webview';
import {html} from '@react-native-web-charts/echarts';
import {WebView} from 'react-native-webview';
import EchartsTheme from '@contants/echartsTheme';
import LoadingWrap from './loadingWrap';
import type {ColorMode} from 'native-base';
import useSWR from 'swr';
const date = Date.now();

interface Props {
  theme: ColorMode;
}

export default (props: Props) => {
  const ref = useRef<WebView | null>(null);
  const [isLoad, setIsLoad] = useState(false);
  const {data} = useSWR<API.ChartReportInfoResponse>({
    url: `/api/logs/report/month?date=${date}`,
    hasToken: true,
  });
  const webviewOnLoad = () => {
    setIsLoad(true);
  };
  useEffect(() => {
    if (isLoad && data) {
      const result: Array<Array<number | string>> = [['日期']];
      const series: any[] = [];
      const lengend: string[] = [];
      data.forEach((item, index) => {
        result[0].push(item.name);
        lengend.push(item.name);
        series.push({type: 'line', smooth: true});
        if (index === 0) {
          item.list.forEach(citem => {
            result.push([`${citem.label}日`, citem.count]);
          });
        } else {
          item.list.forEach((citem, cindex) => {
            result[cindex + 1].push(citem.count);
          });
        }
      });
      const options = {
        title: {
          text: '当月日志统计',
          subtext: formatDateTime(new Date().getTime()),
          left: 'center',
        },
        xAxis: {type: 'category'},
        yAxis: {
          min: 0,
          minInterval: 1,
        },
        grid: {
          containLabel: true,
          top: 70,
          bottom: 30,
          left: 5,
          right: 5,
        },
        legend: {
          type: 'scroll',
          top: 'bottom',
          data: lengend,
        },
        tooltip: {},
        series: series,
        dataset: {
          source: result,
        },
      };
      ref.current &&
        ref.current.injectJavaScript(`(function() {
          window.rnChart.chart.dispose();
          window.rnChart.registerTheme('darkT', ${JSON.stringify(
            EchartsTheme,
          )});
          window.rnChart.init('${props.theme === 'dark' ? 'darkT' : 'light'}');
          window.rnChart.chart.setOption(${JSON.stringify(options)});
        })();`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoad, data]);
  return (
    <RNWebChart
      ref={ref}
      onLoad={webviewOnLoad}
      source={{html}}
      webStyle={{
        opacity: 0.99,
        backgroundColor: props.theme === 'dark' ? '#422c15' : '#fff',
      }}
      hasLoadingComponent={true}
      loadingComponent={LoadingWrap()}
    />
  );
};
