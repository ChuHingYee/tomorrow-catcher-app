import React from 'react';
import {Center, Text} from 'native-base';

export default () => {
  return (
    <Center
      _dark={{bg: '#422c15'}}
      _light={{bg: '#fff'}}
      height="100%"
      w="100%">
      <Text _dark={{color: '#eee'}} _light={{color: 'darkText'}}>
        正在加载中
      </Text>
    </Center>
  );
};
