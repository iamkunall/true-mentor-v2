import { api } from '@/components/ApiHelper';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import useAuthStore from '../store/Store';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(36);
  const [errorMsg, setErrorMsg] = useState('');

  const { num } = useLocalSearchParams();

  const inputRefs: any = useRef([]);
  const setTempToken = useAuthStore((state) => state.setTempToken);
  const setToken = useAuthStore((state) => state.setToken);
  const setRole = useAuthStore((state) => state.setRole);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const sendOTP = async () => {
    try {
      const { res, error } = await api('auth/send-otp', 'POST', {
        phoneNumber: num,
      });

      if (error) {
        console.log('📩 sendOTP failed:', error);
        setErrorMsg(error);
      } else {
        console.log('📩 sendOTP success:', res);
        setErrorMsg('');
      }
    } catch (err) {
      console.log('📩 sendOTP exception:', err);
    }
  };

  const verifyOTP = async () => {
    try {
      console.log('otp', otp);
      const formattedOtp = otp;
      if (formattedOtp.length < 6) {
        setErrorMsg('Please enter all 6 digits.');
        return;
      }

      const { res, error } = await api('auth/verify-otp', 'POST', {
        phoneNumber: num,
        otp: formattedOtp,
      });

      if (error) {
        console.log('✅ verifyOTP failed:', error);
        setErrorMsg(error);
      } else {
        console.log('✅ verifyOTP success:', res);
        setErrorMsg('');

        if (res?.token) {
          console.log('res user', res.user);

          if (res.user.role == 'student') {
            if (res.firstTimeLogin || !res?.user?.name) {
              setTempToken(res.token);
              router.replace('/(auth)/basic-identity');
            } else if (res.user.name) {
              setToken(res.token);
              console.log('setting user', res.user);
              setUser(res.user);
              router.replace('/(drawer)/(tabs)');
            }
          } else {
            setToken(res.token);
            // router.replace('/screens/MentorDashboard');
          }
          setRole(res.user.role);
        }
      }
    } catch (err) {
      console.log('✅ verifyOTP exception:', err);
    }
  };

  const handleOtpChange = (text: string) => {
    console.log('text-----------', text);
    // if (text.length > 1) text = text[text.length - 1];
    // const newOtp = [...otp];
    // newOtp[index] = text;
    // setOtp(newOtp);
    // if (text && index < 5) {
    //   inputRefs.current[index + 1]?.focus();
    // }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();

    const keyboardListener = Keyboard.addListener('keyboardDidHide', () => {
      inputRefs.current[0]?.focus();
    });

    return () => {
      keyboardListener.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="bg-white"
        >
          <View className="flex-1 items-center">
            {/* Background Image */}
            <Image
              source={require('../../assets/images/login-background.jpeg')}
              className=" mb-4"
              style={{ height: 400, width: 400 }}
              resizeMode="cover"
            />

            {/* OTP Container */}
            <View className="w-full flex-1 bg-white rounded-t-3xl px-9 pt-8 pb-10 shadow-top-lg -mt-36">
              <Text className="text-xl font-uber-bold text-center mb-2">
                Verify OTP
              </Text>
              <Text className="text-center text-gray-600 text-sm mb-6">
                Enter the OTP sent to your number {num}
              </Text>

              {/* OTP Inputs */}
              <View className="flex-row justify-between mb-6 gap-2 ">
                <OtpInput
                  theme={{
                    pinCodeContainerStyle: {
                      width: 50,
                      height: 50,
                    },
                    pinCodeTextStyle: {
                      fontSize: 20,
                    },
                  }}
                  // value={otp}
                  numberOfDigits={6}
                  focusColor="#0058C8"
                  autoFocus={false}
                  hideStick={true}
                  placeholder=""
                  blurOnFilled={true}
                  disabled={false}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onFocus={() => console.log('Focused')}
                  onBlur={() => console.log('Blurred')}
                  onTextChange={(text: string) => setOtp(text)}
                  onFilled={(text) => console.log(`OTP is ${text}`)}
                  textInputProps={{
                    accessibilityLabel: 'One-Time Password',
                  }}
                  textProps={{
                    accessibilityRole: 'text',
                    accessibilityLabel: 'OTP digit',
                    allowFontScaling: false,
                  }}
                />

                {/* <OtpInput numberOfDigits={6} onTextChange={(text) =>  handleOtpChange(text, index)} /> */}
                {/* {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    className="border border-gray-300 rounded-lg text-center text-[18px] w-14 h-12"
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))} */}
              </View>
              {errorMsg ? (
                <Text className="text-red-500 text-center mb-4">
                  {errorMsg}
                </Text>
              ) : null}

              {/* <Text className="text-center text-gray-500 text-sm mb-6">Resend code in 00:36</Text> */}
              <Pressable
                disabled={timeLeft > 0}
                onPress={() => {
                  sendOTP();
                  setTimeLeft(36);
                }}
              >
                <Text
                  className={`text-center ${timeLeft > 0 ? 'text-gray-500' : 'text-blue-500'} text-sm mb-6`}
                >
                  {timeLeft > 0
                    ? `Resend code in ${formatTime(timeLeft)}`
                    : 'Resend Code'}
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={() => verifyOTP()}
                className="bg-[#1A8CFF] rounded-lg py-3 mb-2"
              >
                <Text className="text-white text-center text-lg font-nunito font-semibold">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
