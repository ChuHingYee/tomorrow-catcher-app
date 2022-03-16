import React, {useState} from 'react';
import {Keyboard} from 'react-native';
import {
  Box,
  FormControl,
  Input,
  Icon as NIcon,
  Button,
  Pressable,
  useToast,
} from 'native-base';
import Icon from 'react-native-vector-icons/AntDesign';
import {useUserReactStore} from '../../stores/userWithReact';
import regexs from '@utils/regexs';
export default function Login() {
  const toast = useToast();
  const {login, isLogining} = useUserReactStore();
  const [isPassword, setIsPassword] = useState(true);

  const [formData, setFormData] = useState({
    account: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    account: '',
    password: '',
  });
  const validate = () => {
    return validateMobile() && validatePassword();
  };
  const validateMobile = () => {
    if (!regexs.account.test(formData.account)) {
      setErrors(val => {
        return {
          account: '账号格式不对，请输入6-10数字或字母',
          password: val.password,
        };
      });
      return false;
    } else {
      setErrors(val => {
        return {
          account: '',
          password: val.password,
        };
      });
      return true;
    }
  };
  const validatePassword = () => {
    if (!regexs.password.test(formData.password)) {
      setErrors(val => {
        return {
          account: val.account,
          password: '密码格式不对，请输入6-19数字或字母',
        };
      });
      return false;
    } else {
      setErrors(val => {
        return {
          account: val.account,
          password: '',
        };
      });
      return true;
    }
  };
  const handleLogin = () => {
    dismissKeyboard();
    validate() &&
      login(formData).catch(err => {
        console.log(err);
        toast.show({
          description: '账号或密码错误',
        });
      });
  };
  const triggerIsPassword = () => {
    setIsPassword(!isPassword);
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <Pressable flex={1} onPress={dismissKeyboard}>
      <Box flex={1} position="relative" pt="35%">
        <Box
          position="absolute"
          top={0}
          w="100%"
          h="40%"
          background="primary.500"
          zIndex={1}
        />
        <Box
          w="100%"
          h="100%"
          background="#fff"
          borderTopRadius="20"
          zIndex={2}
          pt="10"
          pl="12"
          pr="12">
          <FormControl isRequired isInvalid={!!errors.account} mb="3">
            <Input
              color="darkText"
              variant="underlined"
              InputLeftElement={
                <NIcon as={Icon} ml="2" size={5} name="user" color="darkText" />
              }
              placeholder="请输入手机号码"
              onChangeText={value => setFormData({...formData, account: value})}
              onBlur={() => validateMobile()}
            />
            {errors.account ? (
              <FormControl.ErrorMessage
                _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                {errors.account}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.password} mb="6">
            <Input
              color="darkText"
              variant="underlined"
              type={isPassword ? 'password' : 'text'}
              InputLeftElement={
                <NIcon as={Icon} ml="2" size={5} name="lock" color="darkText" />
              }
              InputRightElement={
                <NIcon
                  onPress={() => triggerIsPassword()}
                  as={Icon}
                  mr="2"
                  size={5}
                  name={isPassword ? 'eyeo' : 'eye'}
                  color="darkText"
                />
              }
              placeholder="请输入登录密码"
              onChangeText={value =>
                setFormData({...formData, password: value})
              }
              onBlur={() => validatePassword()}
            />
            {errors.password ? (
              <FormControl.ErrorMessage
                _text={{fontSize: 'xs', color: 'error.500', fontWeight: 500}}>
                {errors.password}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <Button
            onPress={handleLogin}
            borderRadius="30"
            isLoading={isLogining}
            isLoadingText="正在登录">
            登录
          </Button>
        </Box>
      </Box>
    </Pressable>
  );
}
