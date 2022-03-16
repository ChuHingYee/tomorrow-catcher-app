import React, {useRef, useEffect, useState} from 'react';
import {formatDateTime} from '@utils/index';
import {RNWebChart} from '@react-native-web-charts/webview';
import {html} from '@react-native-web-charts/echarts';
import {WebView} from 'react-native-webview';
import useSWR from 'swr';
const year = new Date().getFullYear();

export default () => {
  const ref = useRef<WebView | null>(null);
  const [isLoad, setIsLoad] = useState(false);
  const {data} = useSWR<API.ChartReportInfoResponse>({
    url: `/api/logs/report/year?year=${year}`,
    hasToken: true,
  });
  const webviewOnLoad = () => {
    setIsLoad(true);
  };
  useEffect(() => {
    if (isLoad && data) {
      let datasetStr = '';
      let lengendDataStr = '';
      let seriesStr = '';
      const result: Array<Array<number | string>> = [['月份']];
      data.forEach((item, index) => {
        result[0].push(item.name);
        lengendDataStr = lengendDataStr + `'${item.name}',`;
        seriesStr = seriesStr + '{"smooth": true, "type": "line"},';
        if (index === 0) {
          item.list.forEach(citem => {
            result.push([`${citem.label}月`, citem.count]);
          });
        } else {
          item.list.forEach((citem, cindex) => {
            result[cindex + 1].push(citem.count);
          });
        }
      });
      result.forEach(item => {
        let itemStr = '';
        item.forEach(citem => {
          itemStr = itemStr + `'${citem}',`;
        });
        datasetStr = datasetStr + `[${itemStr}],`;
      });
      const time = formatDateTime(new Date().getTime());
      ref.current &&
        ref.current.injectJavaScript(`(function() {
    window.rnChart.chart.setOption({
      title: {
        text: '每月日志统计',
        subtext: '${time}',
        left: 'center'
      },
      xAxis: { type: 'category' },
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
        data: [${lengendDataStr}]
      },
      tooltip: {
      },
      series: [${seriesStr}],
      dataset: {
        source : [${datasetStr}]
      }
    });
  })();`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoad, data]);
  return (
    <RNWebChart
      ref={ref}
      onLoad={webviewOnLoad}
      source={{html}}
      webStyle={{opacity: 0.99}}
    />
  );
};
