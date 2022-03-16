import React, {useMemo} from 'react';
import {AlertDialog, Button, useControllableState} from 'native-base';
interface DialogProps {
  tip: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default (props: DialogProps) => {
  const [isOpen, setIsOpen] = useControllableState({
    value: props.isOpen,
    defaultValue: false,
    onChange: val => {
      if (!val) {
        props.onClose && props.onClose();
      }
    },
  });

  const onClose = () => setIsOpen(false);

  const onConfirm = () => {
    props.onConfirm();
  };

  const cancelRef = React.useRef(null);
  return useMemo(
    () => (
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>提示</AlertDialog.Header>
          <AlertDialog.Body>{props.tip}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                取消
              </Button>
              <Button colorScheme="primary" onPress={onConfirm}>
                确定
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen],
  );
};
