import React, {useLayoutEffect} from 'react';
import useSWRInfinite from 'swr/infinite';
import {
  Text,
  HStack,
  VStack,
  Box,
  Pressable,
  FlatList,
  useColorMode,
} from 'native-base';
import {formatDateTime} from '@utils/index';
import type {ListRenderItemInfo} from 'react-native';
import ListFooter from '@components/ListFooter';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

export default ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Logs'>) => {
  const {colorMode} = useColorMode();
  const go2Detail = (id: API.AppItem['_id']) => {
    navigation.navigate('LogDetail', {id});
  };
  const {data, error, size, mutate, setSize, isValidating} = useSWRInfinite<
    API.PageResponse<API.LogItem>
  >(
    page => {
      return {
        url: '/api/logs/page',
        params: {
          page: page + 1,
          size: 10,
        },
        hasToken: true,
      };
    },
    {
      revalidateFirstPage: false,
    },
  );
  let list: API.LogItem[] = [];
  let total = 0;

  if (data && data.length > 0) {
    console.log(data);
    data.forEach(item => {
      item.data.forEach(citem => {
        list.push({
          ...citem,
        });
      });
    });
    total = data[data.length - 1].total;
  }
  const isEmpty = data?.[0]?.data?.length === 0;
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = !!(
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  );
  const isReachingEnd = isEmpty || (size + 1) * 10 >= total;
  const isRefreshing = !!(isValidating && data && data.length === size);
  const renderItem = (row: ListRenderItemInfo<API.LogItem>) => (
    <Pressable onPress={() => go2Detail(row.item._id)}>
      <Box
        key={row.item._id}
        borderBottomWidth="1"
        _dark={{bg: '#422c15', borderColor: '#925518'}}
        _light={{bg: '#fff', borderColor: 'warmGray.200'}}
        pl="4"
        pr="5"
        py="2">
        <VStack space={3} justifyContent="space-between">
          <HStack>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
              应用名称：
            </Text>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
              {row.item.appInfo.name}/{row.item.appInfo.appKey}
            </Text>
          </HStack>
          <HStack>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
              报错时间：
            </Text>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
              {formatDateTime(row.item.time)}
            </Text>
          </HStack>
          <HStack>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
              上传时间：
            </Text>
            <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
              {formatDateTime(row.item.createdAt)}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );

  const onEndReached = () => {
    if (isReachingEnd) {
      return;
    }
    setSize(lastSize => lastSize + 1);
  };
  const refresh = () => {
    mutate();
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? '#eee' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <Box _light={{bg: '#fff'}} _dark={{bg: '#201E20'}} flex={1}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        data={list}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={rowData => renderItem(rowData)}
        ListFooterComponent={
          <ListFooter
            isLoading={isLoadingMore}
            isReachingEnd={isReachingEnd}
            isEmpty={isEmpty}
          />
        }
      />
    </Box>
  );
};
