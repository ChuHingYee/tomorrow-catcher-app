import {HStack, VStack, Box} from 'native-base';
import type {IHStackProps} from 'native-base/lib/typescript/components/primitives/Stack/HStack';
import type {IVStackProps} from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React from 'react';

interface Props {
  column: number[];
  _hStack: IHStackProps;
  _vStack: IVStackProps;
  children: JSX.Element | JSX.Element[] | string | any;
}

export const MasonaryLayout = ({column, _hStack, _vStack, children}: Props) => {
  const vStackChildren: Props['children'][] = [];
  const columnLength = column.length;
  let row = 0;
  React.Children.map(children, (child, cIndex) => {
    const pos = cIndex % columnLength;
    if (pos === 0) {
      vStackChildren[row] = [];
    }
    vStackChildren[row].push(
      <Box key={cIndex} flex={column[pos]}>
        {child}
      </Box>,
    );
    if (pos === 1) {
      row++;
    }
  });
  const lastChildren = vStackChildren[vStackChildren.length - 1];
  const lastChildrenLength = lastChildren.length;
  if (lastChildrenLength !== columnLength) {
    column.forEach((c, i) => {
      lastChildren[i] = (
        <Box flex={c} key={i}>
          {lastChildren[i]}
        </Box>
      ) || <Box flex={c} key={i} />;
    });
  }
  const vstackTomorrow = () => {
    console.log(vStackChildren);
    return vStackChildren.map((item, index) => {
      return (
        <HStack {..._hStack} key={index} flex={1}>
          {item}
        </HStack>
      );
    });
  };

  return <VStack {..._vStack}>{vstackTomorrow()}</VStack>;
};
