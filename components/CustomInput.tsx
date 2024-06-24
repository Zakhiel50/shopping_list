/* eslint-disable @typescript-eslint/indent */

// Custom Input
// Used in ForgetPassword.tsx, Login.rsx, Register.tsx, ResetPassword.tsx
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
    value: any;
    onChangeText: (text: any) => void;
    textContentType:
    'none' |
    'URL' |
    'emailAddress' |
    'familyName' |
    'location' |
    'middleName' |
    'name' |
    'namePrefix' |
    'nameSuffix' |
    'nickname' |
    'postalCode' |
    'telephoneNumber' |
    'username' |
    'password' |
    'price' |
    'newPassword';
    autoFocus: boolean;
}

function CustomInput({
    value,
    onChangeText,
    placeholder,
    keyboardType,
    textContentType,
    autoCapitalize,
    autoComplete,
    autoFocus = false,
    enterKeyHint = 'next',
    style,
    secureTextEntry,
    editable,
    onFocus,
    onBlur,
}: CustomInputProps) {
    return <TextInput
        style={style}
        autoFocus={autoFocus}
        placeholder={placeholder}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        onChangeText={onChangeText}
        value={value}
        enterKeyHint={enterKeyHint}
        secureTextEntry={secureTextEntry}
        editable={editable}
        onFocus={onFocus}
        onBlur={onBlur}
    />;
}

export default CustomInput;
