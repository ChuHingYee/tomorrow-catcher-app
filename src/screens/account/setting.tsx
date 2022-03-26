import React, {useLayoutEffect} from 'react';
import {Box, Center, Text, Switch, useColorMode} from 'native-base';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';
function DarkModeSetting() {
  const {colorMode, toggleColorMode} = useColorMode();
  return (
    <Center
      justifyContent="space-between"
      h="48px"
      pl="3"
      pr="3"
      _dark={{bg: '#422c15', borderColor: '#925518'}}
      _light={{bg: '#fff', borderColor: 'warmGray.200'}}
      flexDirection="row"
      borderTopWidth="1px"
      borderBottomWidth="1px">
      <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
        暗黑模式
      </Text>
      <Switch
        isChecked={colorMode === 'light' ? false : true}
        onToggle={toggleColorMode}
      />
    </Center>
  );
}

export default function Setting({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Setting'>) {
  const {colorMode} = useColorMode();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? '#eeeeee' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <Box flex="1" pt="6" pb="6" _dark={{bg: '#201E20'}}>
      <DarkModeSetting />
    </Box>
  );
}
