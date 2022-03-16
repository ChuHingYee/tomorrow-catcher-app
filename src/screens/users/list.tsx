import React, {useState, useLayoutEffect} from 'react';
import useSWRInfinite from 'swr/infinite';
import {UpdateUserStatus} from '@apis/users';
import {
  Text,
  HStack,
  VStack,
  Box,
  Pressable,
  useToast,
  useColorMode,
} from 'native-base';
import {formatDateTime} from '@utils/index';
import {SwipeListView} from 'react-native-swipe-list-view';
import type {ListRenderItemInfo} from 'react-native';
import ListFooter from '@components/ListFooter';
import ConfirmDialog from '@components/ConfirmDialog';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

export default ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Users'>) => {
  const {colorMode} = useColorMode();
  const toast = useToast();
  const [isOpenConfirm, setIsOpenConfig] = useState(false);
  const [confirmTip, setConfirmTip] = useState('');
  const [currentItem, setCurrentItem] = useState<null | API.UserItem>(null);
  const getKey = (page: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) {
      return null;
    }
    return {
      url: '/api/user/page',
      params: {
        page: page + 1,
        size: 10,
      },
      hasToken: true,
    };
  };
  const {data, size, mutate, setSize, isValidating} = useSWRInfinite<
    API.PageResponse<API.UserItem>
  >(getKey, {
    revalidateFirstPage: false,
  });
  let list: API.UserItem[] = [];
  let total = 0;
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (size + 1) * 10 >= total;
  const isRefreshing = !!(isValidating && data && data.length === size);
  if (data && data.length > 0) {
    data.forEach(item => {
      item.data.forEach(citem => {
        list.push({...citem});
      });
    });
    total = data[data.length - 1].total;
  }
  const renderHiddenItem = (row: ListRenderItemInfo<API.UserItem>) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        bg={row.item.status === 1 ? 'rose.600' : 'emerald.600'}
        justifyContent="center"
        onPress={() => {
          handleConfim(row.item);
        }}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            _dark={{color: 'gray.900'}}
            _light={{color: '#fff'}}>
            {row.item.status === 1 ? '停用' : '启用'}
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  const renderItem = (row: ListRenderItemInfo<API.UserItem>) => (
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
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}} bold>
            账号：
          </Text>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}}>
            {row.item.account}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}} bold>
            姓名：
          </Text>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}}>
            {row.item.name}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}} bold>
            创建时间：
          </Text>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}}>
            {formatDateTime(row.item.createdAt)}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}} bold>
            上次登录时间：
          </Text>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}}>
            {formatDateTime(row.item.lastLoginTime)}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}} bold>
            状态：
          </Text>
          <Text _dark={{color: 'gray.900'}} _light={{color: 'darkText'}}>
            {row.item.status === 1 ? '启用' : '停用'}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );

  const onEndReached = () => {
    if (size === total) {
      return;
    }
    setSize(size + 1);
  };
  const refresh = () => {
    mutate();
  };

  const handleConfim = (info: API.UserItem) => {
    setCurrentItem(info);
    setIsOpenConfig(true);
    setConfirmTip(`确定设置该用户为${info.status === 1 ? '停用' : '启用'}吗？`);
  };

  const confirmStatusChange = () => {
    UpdateUserStatus({
      ids: [currentItem!._id],
      status: currentItem!.status === 0 ? 1 : 0,
    })
      .then(() => {
        toast.show({
          description: '设置成功',
        });
        mutate();
      })
      .catch(e => {
        console.log(e);
        toast.show({
          description: e.message,
        });
      })
      .finally(() => {
        setIsOpenConfig(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colorMode === 'dark' ? '#553718' : '#fff',
      },
      headerTintColor: colorMode === 'dark' ? '#27272a' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <Box _dark={{bg: '#201E20'}} flex={1}>
      <SwipeListView
        onEndReachedThreshold={0.5}
        onEndReached={onEndReached}
        useFlatList={true}
        data={list}
        refreshing={isRefreshing}
        onRefresh={refresh}
        renderItem={rowData => renderItem(rowData)}
        renderHiddenItem={rowData => renderHiddenItem(rowData)}
        rightOpenValue={-70}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        ListFooterComponent={
          <ListFooter
            isLoading={isValidating}
            isReachingEnd={isReachingEnd}
            isEmpty={isEmpty}
          />
        }
      />
      <ConfirmDialog
        tip={confirmTip}
        isOpen={isOpenConfirm}
        onConfirm={() => confirmStatusChange()}
        onClose={() => setIsOpenConfig(false)}
      />
    </Box>
  );
};
