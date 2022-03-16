import React, {memo} from 'react';
import {Center, HStack, Text, Spinner} from 'native-base';

interface FooterProps {
  isLoading: boolean;
  isReachingEnd: boolean;
  isEmpty: boolean;
}

const ListFooters = (props: FooterProps) => {
  return (
    <>
      {props.isLoading && (
        <HStack h="10" justifyContent="center" alignItems="center">
          <Spinner mr="2" />
          <Text color="gray.500" _dark={{color: '#422c15'}}>
            正在加载中...
          </Text>
        </HStack>
      )}
      {!props.isLoading && props.isReachingEnd && !props.isEmpty && (
        <Center h="10">
          <Text _dark={{color: '#422c15'}}>已经加载所有</Text>
        </Center>
      )}
      {props.isEmpty && (
        <Center h="10">
          <Text _dark={{color: '#422c15'}}>暂无数据</Text>
        </Center>
      )}
    </>
  );
};

export default memo(ListFooters);
