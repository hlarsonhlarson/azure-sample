/* eslint-disable react-native/no-inline-styles */
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Platform, Alert } from 'react-native';
import styled from 'styled-components/native';

import Button from '../components/Button';
import { BUTTON_WIDTH } from '../constants';
import User from '../stores/User';

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
  background: ${({ theme }) => theme.secondary};
`;

const IntroText = styled.Text`
  width: ${BUTTON_WIDTH}px;
  text-align: center;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.secondaryText};
`;

const Image = styled.Image``;

const Title = styled.Text`
  margin: 30px 0 15px 0;
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Koala = require('../../assets/images/koala.png');

const LoginSelection = () => {
  const userStore = useContext(User);

  const onAppleButtonPress = async () => {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    // Sign the user in with the credential
    const { user } = await auth().signInWithCredential(appleCredential);

    await firestore()
      .collection('Users')
      .doc(user.uid)
      .set({
        displayName: user.displayName || 'Unknown Artist',
        badges: [],
        avatar: 'cat-1'
      });

    const value = await auth().currentUser?.updateProfile({
      displayName: user.displayName || 'Unknown Artist',
      photoURL: 'cat-1'
    });
    return value;
  };

  const navigation = useNavigation();
  return (
    <Wrapper>
      <Image source={Koala} />
      <Title>Hello there!</Title>
      <IntroText>
        Log in or create an account to share your work and fully enjoy the app
        and its community.
      </IntroText>
      <Button
        onPress={() => navigation.navigate('AccountCreation')}
        title="Create an account"
        style={{ marginBottom: 10 }}
      />
      <Button
        onPress={() => navigation.navigate('Login')}
        fill={false}
        title="Sign in"
      />
      {Platform.OS === 'ios' && (
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE_OUTLINE}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            marginTop: 10,
            width: BUTTON_WIDTH,
            height: 45
          }}
          onPress={() =>
            onAppleButtonPress().then(() => {
              Alert.alert(
                'Welcome to Pix 👋',
                'You can try our editor and post your first artwork right now! You can set your username at any time in your profile page.'
              );
            })
          }
        />
      )}
    </Wrapper>
  );
};

export default LoginSelection;
