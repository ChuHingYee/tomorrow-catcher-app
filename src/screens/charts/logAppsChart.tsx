import React, {useRef, useEffect, useState} from 'react';
import {formatDateTime} from '@utils/index';
import {RNWebChart} from '@react-native-web-charts/webview';
import {html} from '@react-native-web-charts/echarts';
import {WebView} from 'react-native-webview';
import EchartsTheme from '@contants/echartsTheme';
import type {ColorMode} from 'native-base';
import useSWR from 'swr';

interface Props {
  theme: ColorMode;
}

export default (props: Props) => {
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
    let arr: (string | number)[][] = [];
    if (isLoad && data) {
      data &&
        data.forEach(item => {
          arr.push([item.name, item.count]);
        });
      const options = {
        title: {
          text: '各应用日志统计',
          subtext: formatDateTime(new Date().getTime()),
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
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
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
        dataset: {
          source: arr,
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
      webStyle={{opacity: 0.99}}
    />
  );
};
