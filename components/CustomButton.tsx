import { Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { ActionColor, BtnDisabled } from '../colors';

export default function CustomButton({
    text,
    action,
    disabled = false,
  }: {
    text: string;
    action: any | null;
    disabled: boolean;
  }) {
    return (
      <Pressable
        style={[styles.btn_bg, disabled ? styles.btn_disabled : undefined]}
        onPress={action}
        android_ripple={{}}
        disabled={disabled}
      >
        <Text style={styles.btn_text}>{text}</Text>
      </Pressable>
    );
  }
    



  const styles = StyleSheet.create({
    btn_bg: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      padding: 6,
      // height: 36px;
      paddingHorizontal: 18,
      paddingVertical: 12,
      flexShrink: 0,
      backgroundColor: ActionColor,
      // box-shadow: 0px 16px 32px 0px rgba(0, 0, 0, 0.15);
      elevation: 8,
      //shadowColor: ShadowColor,
      shadowOpacity: 0.15,
      shadowOffset: {
        width: 0,
        height: 16,
      },
      shadowRadius: 32,
    },
    btn_text: {
      color: '#FFF',
      fontSize: 14,
      fontWeight: '700',
      fontFamily: 'Arimo_700Bold',
    },
    btn_disabled: {
      backgroundColor: BtnDisabled,
      borderColor: BtnDisabled,
    },
  });
  