import GlobalTextInput from '@/components/GlobalTextInput';
import TopProgressBar from '@/components/TopProgressBar';
import { isEmpty, validateEmail } from '@/components/Utility';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function BasicIdentity() {
  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState({ val: '', valid: true, error: '' });
  const [email, setEmail] = useState({ val: '', valid: true, error: '' });
  const [phone, setPhone] = useState({ val: '', valid: true, error: '' });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'fullName':
        if (isEmpty(value))
          return { valid: false, error: 'Please enter fullname' };
        return { valid: true, error: '' };

      case 'email':
        if (isEmpty(value))
          return { valid: false, error: 'Please enter email' };
        if (!validateEmail(value))
          return { valid: false, error: 'Please enter valid email' };
        return { valid: true, error: '' };

      default:
        return { valid: true, error: '' };
    }
  };
  const handleValidation = () => {
    let isValid = true;

    const nameCheck = validateField('fullName', fullName.val);
    if (!nameCheck.valid) isValid = false;
    setFullName({ ...fullName, ...nameCheck });

    const emailCheck = validateField('email', email.val);
    if (!emailCheck.valid) isValid = false;
    setEmail({ ...email, ...emailCheck });

    return isValid;
  };

  const data = {
    fullName: fullName.val,
    email: email.val,
    phone: phone.val,
    gender: gender,
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, paddingBottom: 40 }}
      className="px-4 bg-white"
    >
      <TopProgressBar step={1} router={router} />
      <View className="my-2 mt-6">
        <Text className="text-sm text-black mb-2 font-bold font-nunito-Bold">
          Step 1: Basic Identity
        </Text>
        <Text className="text-4xl font-bold text-black mb-6 font-uber-bold">
          Let’s get to know you
        </Text>
      </View>

      <Text className="text-sm text-black mb-2 font-uber-medium">
        Full Name
      </Text>
      <GlobalTextInput
        placeholder="Enter your full name"
        placeholderTextColor="#999"
        value={fullName.val}
        onChangeText={(txt) => {
          const check = validateField('fullName', txt);
          setFullName({ val: txt, ...check });
        }}
        error={fullName.error}
        isValid={fullName.valid}
      />

      <Text className="text-sm text-black mb-2 font-uber-medium">Email</Text>
      <GlobalTextInput
        placeholder="Enter your Email ID"
        placeholderTextColor="#999"
        value={email.val}
        onChangeText={(txt) => {
          const check = validateField('email', txt);
          setEmail({ val: txt, ...check });
        }}
        error={email.error}
        isValid={email.valid}
      />

      <Text className="text-sm text-black mb-4 mt-2 font-uber-medium">
        Gender (Optional)
      </Text>
      <View className="flex-row gap-3 mb-6">
        {['Male', 'Female', 'Prefer not to say'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setGender(item)}
            className={`border px-4 py-2 rounded-full ${
              gender === item
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-300'
            }`}
          >
            <Text
              className={`text-sm ${gender === item ? 'text-white' : 'text-black'}`}
            >
              {item === 'Male'
                ? '👨 Male'
                : item === 'Female'
                  ? '👩 Female'
                  : 'Prefer not to say'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={() =>
          handleValidation() &&
          router.navigate(
            `/(auth)/academic-background?data=${JSON.stringify(data)}`,
          )
        }
        className="bg-blue-500 py-4 rounded-xl items-center mt-4"
      >
        <Text className="text-white text-base font-semibold">Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
