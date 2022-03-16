import React, {useState, useEffect, memo} from 'react';
import {
  Button,
  Modal,
  FormControl,
  useControllableState,
  Radio,
  Input,
  useToast,
} from 'native-base';
import {UpdateAppItem} from '@apis/apps';
interface DialogProps {
  isOpen: boolean;
  info: API.AppItem | null;
  onSuccess: () => void;
  onClose: () => void;
}

function areEqual(prevProps: DialogProps, nextProps: DialogProps) {
  return prevProps.isOpen === nextProps.isOpen;
}

const Dialog = (props: DialogProps) => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useControllableState({
    value: props.isOpen,
    defaultValue: false,
    onChange: () => {
      props.onClose();
    },
  });
  const [formData, setFormData] = useState({
    name: '',
    status: '0',
  });
  const [errors, setErrors] = React.useState({});
  const validate = () => {
    if (!formData.name) {
      setErrors({
        ...errors,
        equipmentStatus: '请填写应用名称',
      });
      return false;
    }
    return true;
  };
  const onClose = () => setIsOpen(false);

  const onConfirm = () => {
    validate() &&
      UpdateAppItem({
        _id: props.info!._id,
        status: Number(formData.status) as API.AppStatus,
        name: formData.name,
      })
        .then(() => {
          toast.show({
            description: '设置成功',
          });
          setIsOpen(true);
          props.onSuccess;
        })
        .catch(e => {
          console.log(e);
          toast.show({
            description: e.message || '网络错误',
          });
        });
  };

  useEffect(() => {
    if (props.isOpen) {
      setFormData({
        name: (props.info as API.AppItem).name,
        status: String((props.info as API.AppItem).status),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} zIndex={1}>
        <Modal.Content maxWidth="400px" width="85%">
          <Modal.CloseButton />
          <Modal.Header>应用信息</Modal.Header>
          <Modal.Body>
            <FormControl mb="3">
              <FormControl.Label>应用名称：</FormControl.Label>
              <Input
                defaultValue={props.info?.name || ''}
                placeholder="维修说明"
                onChangeText={value => setFormData({...formData, name: value})}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>应用状态：</FormControl.Label>
              <Radio.Group
                name="myRadioGroup"
                accessibilityLabel="favorite number"
                value={formData.status}
                onChange={value => setFormData({...formData, status: value})}>
                <Radio value="0">停用</Radio>
                <Radio value="1">启用</Radio>
              </Radio.Group>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  onClose();
                }}>
                取消
              </Button>
              <Button
                onPress={() => {
                  onConfirm();
                }}>
                确定
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default memo(Dialog, areEqual);
