import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Box,
  ScrollView,
  Skeleton,
  Stack,
  Text,
  Heading,
  useColorMode,
} from 'native-base';
import {GetLogDetail} from '@apis/logs';
import {formatDateTime} from '@utils/index';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';
export default function HomeDetail({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'LogDetail'>) {
  const {colorMode} = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState<null | API.LogItemDetailResponse>(null);
  const getDetail = (_id: string) => {
    setIsLoading(true);
    GetLogDetail({_id})
      .then(res => {
        console.log(res);
        setDetail(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getDetail(route.params.id);
  }, [route.params.id]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? 'gray.900' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <ScrollView flex={1} _dark={{bg: '#201E20'}}>
      <Box p="3">
        {isLoading ? (
          <>
            <Skeleton.Text px="4" mb="3" />
            <Skeleton.Text px="4" />
          </>
        ) : (
          <>
            <Stack
              p="5"
              space={3}
              _dark={{
                bg: '#422c15',
              }}
              _light={{
                bg: '#fff',
              }}
              borderRadius="10"
              mb="3">
              <Stack space={2}>
                <Heading
                  size="md"
                  ml="-1"
                  _dark={{color: 'gray.900'}}
                  _light={{color: 'darkText'}}>
                  基本信息
                </Heading>
              </Stack>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                应用 :{detail?.appInfo?.name}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                错误名称 :{detail?.name}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                错误消息 :{detail?.message}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                错误位置 :{detail?.result?.column}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                错误文件 :{detail?.result?.source}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                浏览器类型 :{detail?.systemInfo?.userAgent}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                系统 :{detail?.systemInfo?.platform}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                语言 :{detail?.systemInfo?.language}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                sdk版本 :{detail?.systemInfo?.sdkVersion}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                创建时间 :{formatDateTime(detail?.time)}
              </Text>
              <Text
                fontWeight="400"
                _dark={{color: 'gray.900'}}
                _light={{color: 'darkText'}}>
                上传时间 :{formatDateTime(detail?.createdAt)}
              </Text>
            </Stack>
            {detail?.codes && detail?.codes.length > 0 && (
              <Stack
                p="5"
                space={3}
                _dark={{
                  bg: '#422c15',
                }}
                _light={{
                  bg: '#fff',
                }}
                borderRadius="10"
                mb="3">
                <Stack space={2}>
                  <Heading
                    size="md"
                    ml="-1"
                    _dark={{color: 'gray.900'}}
                    _light={{color: 'darkText'}}>
                    错误代码：
                  </Heading>
                </Stack>
                {detail.codes.map((code, index) => {
                  return (
                    <Text
                      key={index}
                      fontWeight="400"
                      _dark={{color: 'gray.900'}}
                      _light={{color: 'darkText'}}>
                      {code.code}
                    </Text>
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </Box>
    </ScrollView>
  );
}