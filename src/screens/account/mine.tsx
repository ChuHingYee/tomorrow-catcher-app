import React, {useLayoutEffect} from 'react';
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  Icon as NIcon,
  Pressable,
  useColorMode,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {useUserReactStore} from '@stores/userWithReact';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

interface Tab {
  label: string;
  icon: string;
  path: keyof RootStackParamList;
}

const tabs: Tab[] = [
  {
    label: '更改密码',
    icon: 'lock1',
    path: 'UpdatePassword',
  },
];

export default function Mine({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Tabs'>) {
  const {colorMode} = useColorMode();
  const {userInfo, logout} = useUserReactStore();
  const shortName = userInfo?.name.substring(userInfo?.name.length - 2) || '-';
  const handleLogin = () => {
    logout();
  };
  const go2Other = (path: keyof RootStackParamList) => {
    navigation.navigate(path);
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => go2Other('Setting')}>
          <NIcon
            as={Icon}
            mr="2"
            size={6}
            _dark={{color: '#eee'}}
            _light={{color: '#fff'}}
            name="setting"
          />
        </Pressable>
      ),
      headerTintColor: colorMode === 'dark' ? '#eeeeee' : '#27272a',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);
  return (
    <Box flex="1" _dark={{bg: '#201E20'}}>
      <HStack w="100%" h="80px" background="primary.500" pl="3" pr="3">
        <Avatar
          bg="primary.600"
          size="60px"
          mr="3"
          _text={{
            color: colorMode === 'dark' ? '#eee' : '#fff',
          }}>
          {shortName}
        </Avatar>
        <VStack h="100%">
          <Text
            fontWeight="bold"
            fontSize="22"
            _dark={{color: '#eee'}}
            _light={{color: '#fff'}}
            mb="0">
            {userInfo?.name || '-'}
          </Text>
          <Text fontSize="16" _dark={{color: '#eee'}} _light={{color: '#fff'}}>
            {userInfo?.name || '-'}
          </Text>
        </VStack>
      </HStack>
      <VStack mt="3" mb="3" space={5}>
        {tabs.map(tab => {
          return (
            <Pressable
              w="100%"
              h="48px"
              onPress={() => {
                go2Other(tab.path);
              }}
              key={tab.path}
              _dark={{bg: '#422c15'}}
              _light={{bg: '#fff'}}>
              <HStack
                w="100%"
                h="48px"
                pl="3"
                pr="3"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <HStack flexDirection="row" alignItems="center">
                  <NIcon
                    as={Icon}
                    mr="2"
                    size={6}
                    name={tab.icon}
                    _dark={{color: '#eee'}}
                    _light={{color: 'darkText'}}
                  />
                  <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
                    {tab.label}
                  </Text>
                </HStack>
                <NIcon
                  as={Icon}
                  ml="2"
                  size={5}
                  name="right"
                  _dark={{color: '#eee'}}
                  _light={{color: 'darkText'}}
                />
              </HStack>
            </Pressable>
          );
        })}
      </VStack>
      <VStack p="3">
        <Button
          onPress={handleLogin}
          _text={{
            color: colorMode === 'dark' ? '#eee' : '#fff',
          }}>
          退出登录
        </Button>
      </VStack>
    </Box>
  );
}
