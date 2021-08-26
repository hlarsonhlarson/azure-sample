import { useNavigation } from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import Button from './Button';

const Cactus = require('../../assets/images/cactus.png');

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const InfosText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
  margin: 15px 0;
`;

const Image = styled.Image`
  width: 150px;
  height: 150px;
  margin-top: 50px;
`;

interface Props {
  actionTitle?: string;
  hideAction?: boolean;
}

const Empty = ({
  actionTitle = 'Create your first artwork!',
  hideAction = false
}: Props) => {
  const navigation = useNavigation();
  return (
    <Wrapper>
      <Image source={Cactus} />
      <InfosText>There's nothing to show here yet!</InfosText>
      {!hideAction && (
        <Button
          onPress={() => navigation.navigate('EditorModal')}
          fill={false}
          title={actionTitle}
        />
      )}
    </Wrapper>
  );
};

export default Empty;
