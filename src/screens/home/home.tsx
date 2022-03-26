import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native';
import type {ImageSourcePropType} from 'react-native';
import {
  Box,
  Center,
  Text,
  Icon as NIcon,
  useBreakpointValue,
  Image,
  Pressable,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {MasonaryLayout} from '@components/MasonLayout';
import {useUserReactStore} from '@stores/userWithReact';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

const navs: Nav[] = [
  {
    label: '用户管理',
    path: 'Users',
    icon: require('@assets/images/home_user.png'),
  },
  {
    label: '应用管理',
    path: 'Apps',
    icon: require('@assets/images/home_app.png'),
  },
  {
    label: '日志管理',
    path: 'Logs',
    icon: require('@assets/images/home_log.png'),
  },
  {
    label: '日志统计',
    path: 'Charts',
    icon: require('@assets/images/home_chart.png'),
  },
];

type Path = 'Users' | 'Apps' | 'Logs' | 'Charts';

type Nav = {
  path: Path;
  label: string;
  icon: ImageSourcePropType;
};

export default function Home({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const {userInfo} = useUserReactStore();
  console.log(userInfo);
  const [timeStr, SetTimeStr] = useState('');
  const getTime = () => {
    const time = new Date();
    const hour = time.getHours();
    console.log(hour);
    SetTimeStr(
      hour < 9
        ? '早上好'
        : hour <= 11
        ? '上午好'
        : hour <= 13
        ? '中午好'
        : hour < 20
        ? '下午好'
        : '晚上好',
    );
  };
  const go2Page = (path: Path) => {
    navigation.navigate(path);
  };
  useEffect(() => {
    const _navListener = navigation.addListener('focus', getTime);
    return _navListener;
  }, [navigation]);
  return (
    <Box flex="1" pt="40%" position="relative" _dark={{bg: '#201E20'}}>
      <Box w="100%" h="55%" bg="primary.500" pt="12" pl="3" position="absolute">
        <Text _dark={{color: '#eee'}} _light={{color: '#fff'}} fontSize={16}>
          您好，{timeStr}！
        </Text>
        <Text
          _dark={{color: '#eee'}}
          _light={{color: '#fff'}}
          fontSize={24}
          fontWeight="bold">
          {userInfo?.name}
        </Text>
      </Box>
      <Box w="100%" pt="3" borderTopRadius="20" zIndex={2}>
        <ScrollView>
          <Box p="3">
            <MasonaryLayout
              column={useBreakpointValue({
                base: [1, 1],
                sm: [1, 1],
                md: [1, 1, 1],
              })}
              _hStack={{
                space: 4,
              }}
              _vStack={{space: 4, mb: 4}}>
              {navs.map(nav => {
                return (
                  <Pressable onPress={() => go2Page(nav.path)} key={nav.path}>
                    <Box
                      position="relative"
                      flex={1}
                      p="3"
                      minH={150}
                      rounded="lg"
                      shadow={2}
                      _dark={{bg: '#422c15'}}
                      _light={{bg: '#fff'}}>
                      <Center flex={1} minH={100}>
                        <Image source={nav.icon} size="16" alt={nav.label} />
                      </Center>
                      <Text
                        _dark={{color: '#eee'}}
                        _light={{color: 'darkText'}}>
                        {nav.label}
                      </Text>
                      <NIcon
                        position="absolute"
                        bottom="3"
                        right="3"
                        as={Icon}
                        ml="2"
                        size={5}
                        name="arrowright"
                        _dark={{color: '#eee'}}
                        _light={{color: 'primary.500'}}
                      />
                    </Box>
                  </Pressable>
                );
              })}
            </MasonaryLayout>
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
}
