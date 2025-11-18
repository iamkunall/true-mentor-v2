'use client';

import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { router } from 'expo-router';

import { api } from '@/components/ApiHelper';
import GlobalTextInput from '@/components/GlobalTextInput';

export default function LoginScreen() {
  const [phone, setPhone] = useState({ val: '', valid: true, error: '' });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'phone':
        if (!value)
          return { valid: false, error: 'Please enter mobile number' };
        if (!/^\d+$/.test(value))
          return { valid: false, error: 'Invalid phone number format' };
        if (value.length < 10)
          return { valid: false, error: 'Please enter valid number' };
        return { valid: true, error: '' };
      default:
        return { valid: true, error: '' };
    }
  };

  const sendOTP = async () => {
    try {
      const { res, error } = await api('auth/send-otp', 'POST', {
        phoneNumber: phone.val,
      });

      if (error) {
        console.log('📩 sendOTP failed:', error);
        setPhone({ ...phone, valid: false, error: error });
      } else {
        console.log('📩 sendOTP success:', res);

        const num = phone.val;
        router.navigate(`/otp-verify?num=${num}`); // Navigate to OTP verification screen with phone number
      }
    } catch (err) {
      console.log('📩 sendOTP exception:', err);
      // setPhone({ ...phone, valid: false, error: err });
    }
  };

  const handleRegister = async () => {
    const phoneCheck = validateField('phone', phone.val);
    if (!phoneCheck.valid) {
      setPhone({ ...phone, ...phoneCheck });
      return;
    }
    sendOTP();
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 40,
          backgroundColor: '#FFFFFF',
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          {/* IITian Card */}
          <View className="items-center">
            <Image
              source={require('../../assets/images/login-background.jpeg')}
              className=" mb-4"
              style={{ height: 400, width: 400 }}
              resizeMode="cover"
            />
          </View>

          {/* Badge */}
          <View className="flex-row justify-center  mb-4">
            <Text className="text-xs  py-3 bg-brandYellow text-yellow-900 px-3 rounded-lg  font-medium">
              🏅 India's Most Trusted Student App For IIT-JEE Mentorship
            </Text>
          </View>

          {/* Headline */}
          <Text className="font-uber-bold text-2xl font-bold text-center mb-4">
            Talk With Top IITians Instantly
          </Text>
          <Text className="font-nunito text-sm text-center text-gray-600 mb-6 px-4">
            Get expert guidance for JEE preparation - anytime, anywhere,
            starting at just ₹4/minute
          </Text>

          {/* Phone Input */}
          <GlobalTextInput
            placeholder="Enter Your Phone Number"
            keyboardType="phone-pad"
            value={phone.val}
            onChangeText={(txt) => {
              const check = validateField('phone', txt);
              setPhone({ val: txt, ...check });
            }}
            error={phone.error}
            isValid={phone.valid}
          />

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#1A8CFF] rounded-lg py-3 mb-4"
          >
            <Text className="text-white text-center text-xl font-nunito font-semibold">
              Continue
            </Text>
          </TouchableOpacity>

          {/* Terms and Privacy */}
          <View className="mt-10">
            <Text className="text-sm text-center text-gray-500">
              By continuing, you agree to our{' '}
              <Text
                className="text-blue-500"
                onPress={() => Linking.openURL('#')}
              >
                Terms & Conditions
              </Text>{' '}
              and{' '}
              <Text
                className="text-blue-500"
                onPress={() => Linking.openURL('#')}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
