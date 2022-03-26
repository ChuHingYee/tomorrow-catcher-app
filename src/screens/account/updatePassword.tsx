import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  Box,
  VStack,
  Button,
  FormControl,
  Input,
  useToast,
  useColorMode,
} from 'native-base';
import {useUserReactStore} from '@stores/userWithReact';
import {UpdatePassword} from '@apis/users';
import regexs from '@utils/regexs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../Navigators';

export default ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'UpdatePassword'>) => {
  const {colorMode} = useColorMode();
  const toast = useToast();
  const {setUserInfo} = useUserReactStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setData] = useState({
    oldPassword: '',
    password: '',
    rePassword: '',
  });
  const [errors, setErrors] = useState({
    oldPassword: '',
    password: '',
    rePassword: '',
  });
  const validate = () => {
    return (
      validatePassword('oldPassword') &&
      validatePassword('password') &&
      validatePassword('rePassword')
    );
  };
  const validatePassword = (key: 'oldPassword' | 'password' | 'rePassword') => {
    if (key === 'rePassword' && formData.password !== formData.rePassword) {
      setErrors({
        oldPassword: '',
        password: '',
        rePassword: '请输入一样的新密码',
      });
      return false;
    }
    if (!regexs.password.test(formData[key])) {
      setErrors({
        oldPassword: '',
        password: '',
        rePassword: '',
        [key]: '请输入6-19数字或字母',
      });
      return false;
    } else {
      setErrors({
        oldPassword: '',
        password: '',
        rePassword: '',
      });
      return true;
    }
  };
  const onSubmit = () => {
    validate() && confirmUpdate();
  };
  const confirmUpdate = () => {
    setIsLoading(true);
    UpdatePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.password,
    })
      .then(() => {
        toast.closeAll();
        setUserInfo(null);
        toast.show({
          description: '更改成功，请重新登录',
        });
      })
      .catch(e => {
        toast.show({
          description: e.message || '网络错误',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    validatePassword('oldPassword');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.oldPassword]);
  useEffect(() => {
    validatePassword('password');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.password]);
  useEffect(() => {
    validatePassword('rePassword');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.rePassword]);
  useEffect(() => {
    setErrors({
      oldPassword: '',
      password: '',
      rePassword: '',
    });
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {backgroundColor: colorMode === 'dark' ? '#553718' : '#fff'},
      headerTintColor: colorMode === 'dark' ? '#eee' : '#27272a',
    });
  }, [colorMode, navigation]);
  return (
    <Box _dark={{bg: '#422c15'}} px={4} flex={1}>
      <VStack width="90%" mx="3" mt="10">
        <FormControl isRequired isInvalid={!!errors.oldPassword} mb="4">
          <FormControl.Label _text={{color: '#eee'}}>原密码</FormControl.Label>
          <Input
            type="password"
            variant="underlined"
            placeholder="请输入原密码"
            onChangeText={value => setData({...formData, oldPassword: value})}
          />
          {errors.oldPassword ? (
            <FormControl.ErrorMessage
              _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
              {errors.oldPassword}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.password} mb="4">
          <FormControl.Label _text={{color: '#eee'}}>新密码</FormControl.Label>
          <Input
            type="password"
            variant="underlined"
            placeholder="请输入新密码"
            onChangeText={value => setData({...formData, password: value})}
          />
          {errors.password ? (
            <FormControl.ErrorMessage
              _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
              {errors.password}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.rePassword} mb="4">
          <FormControl.Label _text={{color: '#eee'}}>
            确认新密码
          </FormControl.Label>
          <Input
            type="password"
            variant="underlined"
            placeholder="请再次输入新密码"
            onChangeText={value => setData({...formData, rePassword: value})}
          />
          {errors.rePassword ? (
            <FormControl.ErrorMessage
              _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
              {errors.rePassword}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <Button
          onPress={onSubmit}
          mt="5"
          isLoading={isLoading}
          _text={{
            color: colorMode === 'dark' ? '#1F2937' : '#fff',
          }}>
          确定修改
        </Button>
      </VStack>
    </Box>
  );
};
