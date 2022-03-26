import React, {useState, useLayoutEffect} from 'react';
import useSWRInfinite from 'swr/infinite';
import {UpdateAppItem} from '@apis/apps';
import {
  Text,
  HStack,
  VStack,
  Box,
  Pressable,
  useToast,
  useColorMode,
} from 'native-base';
import {SwipeListView} from 'react-native-swipe-list-view';
import type {ListRenderItemInfo} from 'react-native';
import {formatDateTime} from '@utils/index';
import ListFooter from '@components/ListFooter';
import ConfirmDialog from '@components/ConfirmDialog';
import ListEditDialog from './listEditDialog';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

export default ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Apps'>) => {
  const {colorMode} = useColorMode();
  const toast = useToast();
  const [isOpenConfirm, setIsOpenConfig] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [confirmTip, setConfirmTip] = useState('');
  const [currentItem, setCurrentItem] = useState<null | API.AppItem>(null);
  const getKey = (page: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) {
      return null;
    }
    return {
      url: '/api/type/page',
      params: {
        page: page + 1,
        size: 10,
      },
      hasToken: true,
    };
  };
  const {data, error, size, mutate, setSize, isValidating} = useSWRInfinite<
    API.PageResponse<API.AppItem>
  >(getKey, {
    revalidateFirstPage: false,
  });
  let list: API.AppItem[] = [];
  let total = 0;
  if (data && data.length > 0) {
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
  const renderHiddenItem = (row: ListRenderItemInfo<API.AppItem>) => (
    <HStack flex="1" pl="2">
      <Pressable
        w="70"
        ml="auto"
        bg="primary.500"
        justifyContent="center"
        onPress={() => {
          handleEdit(row.item);
        }}
        _pressed={{
          opacity: 0.5,
        }}>
        <VStack alignItems="center" space={2}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            _dark={{color: '#eee'}}
            _light={{color: '#fff'}}>
            修改
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w="70"
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
            _dark={{color: '#eee'}}
            _light={{color: '#fff'}}>
            {row.item.status === 1 ? '停用' : '启用'}
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );

  const renderItem = (row: ListRenderItemInfo<API.AppItem>) => (
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
            {row.item.name}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
            应用Key：
          </Text>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
            {row.item._id}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
            创建时间:
          </Text>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
            {formatDateTime(row.item.createdAt)}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
            更新时间:
          </Text>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
            {formatDateTime(row.item.updatedAt)}
          </Text>
        </HStack>
        <HStack>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}} bold>
            状态：
          </Text>
          <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
            {row.item.status === 1 ? '启用' : '停用'}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );

  const onEndReached = () => {
    if (isReachingEnd) {
      return;
    }
    setSize(size + 1);
  };
  const refresh = () => {
    mutate();
  };

  const handleConfim = (info: API.AppItem) => {
    setCurrentItem(info);
    setIsOpenConfig(true);
    setConfirmTip(`确定设置该应用为${info.status === 1 ? '停用' : '启用'}吗？`);
  };

  const handleEdit = (info: API.AppItem) => {
    setCurrentItem(info);
    setIsOpenEdit(true);
  };

  const confirmStatusChange = () => {
    UpdateAppItem({
      _id: currentItem!._id,
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
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? '#eee' : '#27272a',
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
        rightOpenValue={-140}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        ListFooterComponent={
          <ListFooter
            isLoading={isLoadingMore}
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
      <ListEditDialog
        info={currentItem}
        isOpen={isOpenEdit}
        onSuccess={mutate}
        onClose={() => setIsOpenEdit(false)}
      />
    </Box>
  );
};
