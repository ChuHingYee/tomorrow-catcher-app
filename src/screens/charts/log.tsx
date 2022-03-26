import React, {useLayoutEffect} from 'react';
import {Box, ScrollView, useColorMode} from 'native-base';
import LogAppsChart from './logAppsChart';
import LogMonthChart from './logMonthChart';
import LogYearlyChart from './logYearlyChart';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';
export default ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Charts'>) => {
  const {colorMode} = useColorMode();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? 'gray.900' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <ScrollView flex="1" _dark={{bg: '#201E20'}}>
      <Box p="3">
        <Box
          p="2"
          _dark={{bg: '#422c15'}}
          _light={{bg: '#fff'}}
          borderRadius="20"
          mb="10">
          <LogAppsChart theme={colorMode} />
        </Box>
        <Box
          p="2"
          _dark={{bg: '#422c15'}}
          _light={{bg: '#fff'}}
          borderRadius="20"
          mb="10">
          <LogMonthChart theme={colorMode} />
        </Box>
        <Box
          p="2"
          _dark={{bg: '#422c15'}}
          _light={{bg: '#fff'}}
          borderRadius="20"
          mb="10">
          <LogYearlyChart theme={colorMode} />
        </Box>
      </Box>
    </ScrollView>
  );
};
