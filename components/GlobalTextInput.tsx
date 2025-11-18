import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { isEmpty } from './Utility';

type GlobalTextInputProps = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  isValid?: boolean; // better name than `validate`
};

const GlobalTextInput: React.FC<GlobalTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  error = '',
  isValid = true,
  ...props
}) => {
  const showError = !isValid && !isEmpty(error);

  return (
    <View className="mb-5">
      <TextInput
        className={`border px-4 py-3 rounded-xl font-nunito bg-white ${
          showError ? 'border-rose-500' : 'border-gray-300'
        }`}
        value={value}
        placeholderTextColor={'#6d6b6bff'}
        onChangeText={onChangeText}
        placeholder={placeholder || ''}
        {...props}
      />
      {showError && (
        <Text className="text-rose-500 text-sm font-nunito mt-1">{error}</Text>
      )}
    </View>
  );
};

export default GlobalTextInput;
