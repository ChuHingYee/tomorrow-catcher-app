import React, {useRef, useEffect, useState} from 'react';
import {formatDateTime} from '@utils/index';
import {RNWebChart} from '@react-native-web-charts/webview';
import {html} from '@react-native-web-charts/echarts';
import {WebView} from 'react-native-webview';
import useSWR from 'swr';

export default () => {
  const ref = useRef<WebView | null>(null);
  const [isLoad, setIsLoad] = useState(false);
  const {data} = useSWR<API.TypesReportResponse>({
    url: '/api/logs/report/type',
    hasToken: true,
  });
  const webviewOnLoad = () => {
    setIsLoad(true);
  };
  useEffect(() => {
    let arrStr = '';
    if (isLoad && data) {
      data &&
        data.forEach(item => {
          arrStr = arrStr + `['${item.name}',${item.count}],`;
        });
      console.log(arrStr);
      const time = formatDateTime(new Date().getTime());
      ref.current &&
        ref.current.injectJavaScript(`(function() {
    window.rnChart.chart.setOption({
      title: {
        text: '各应用日志统计',
        subtext: '${time}',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom',
        type: 'scroll',
      },
      series: [
        {
          name: '统计',
          type: 'pie',
          radius: '50%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      dataset: {
        source : [${arrStr}]
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
