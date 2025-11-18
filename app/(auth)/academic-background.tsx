import { apiWithAuth } from '@/components/ApiHelper';
import TopProgressBar from '@/components/TopProgressBar';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import useAuthStore from '../store/Store';

export default function AcademicBackground() {
  const { data } = useLocalSearchParams();

  const parsedData = data ? JSON.parse(data as string) : {};
  const [classSelected, setClassSelected] = useState('10th');
  const [examYear, setExamYear] = useState('2025');
  const [board, setBoard] = useState('CBSE');
  const { tempToken, setStudent, setUser, setToken, setTempToken } =
    useAuthStore();

  const classes = ['9th', '10th', '11th', '12th', 'Drop Year'];
  const years = ['2025', '2026', '2027', '2028', '2029', '2030'];
  const boards = ['CBSE', 'ICSE', 'STATE'];

  const onboardingApi = async () => {
    const { res, error } = await apiWithAuth(
      'auth/student-onboarding',
      'POST',
      {
        name: parsedData?.fullName,
        email: parsedData?.email,
        gender: parsedData?.gender?.toLowerCase(),
        class: classSelected,
        targetYear: examYear,
        board: board,
      },
      tempToken ? tempToken : '',
    );

    if (error) {
      console.log('onboarding failed:', error, tempToken);
    } else {
      setToken(tempToken);
      setTempToken('');
      setStudent(res.student);
      setUser(res.user);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 40 }}
      className="px-6 py-2 bg-white"
    >
      <TopProgressBar step={2} router={router} />
      <View className="my-2  mt-6">
        <Text className="text-sm text-black mb-2 font-bold font-nunito-Medium">
          Step 2: Academic Background
        </Text>
        <Text className="text-4xl font-bold text-black mb-4 font-uber-bold">
          Your Academics
        </Text>
      </View>

      <Text className="text-sm text-black mb-2 font-uber-medium">Class</Text>
      <View className="flex-row flex-wrap gap-3 mb-8">
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls}
            onPress={() => setClassSelected(cls)}
            className={`px-4 py-2 rounded-full border ${
              classSelected === cls
                ? 'bg-primary border-primary'
                : 'border-primary-50 bg-[#E4F0FF] text-white'
            }`}
          >
            <Text
              className={`text-sm ${classSelected === cls ? 'text-white' : 'text-primary'} font-nunito-Medium`}
            >
              {cls}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-sm text-black mb-2 font-uber-medium">
        Target Exam Year
      </Text>
      <View className="flex-row gap-3 mb-8 flex-wrap">
        {years.map((yr) => (
          <TouchableOpacity
            key={yr}
            onPress={() => setExamYear(yr)}
            className={`px-4 py-2 rounded-full border ${
              examYear === yr
                ? 'bg-primary border-primary'
                : 'border-primary-50 bg-[#E4F0FF] text-white'
            }`}
          >
            <Text
              className={`text-sm ${examYear === yr ? 'text-white' : 'text-black'} font-nunito-Medium`}
            >
              {yr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-sm text-black mb-2 ">School Board</Text>
      <View className="flex-row gap-3 mb-6">
        {boards.map((b) => (
          <TouchableOpacity
            key={b}
            onPress={() => setBoard(b)}
            className={`px-4 py-2 rounded-full border ${
              board === b
                ? 'bg-primary border-primary'
                : 'border-primary-50 bg-[#E4F0FF] text-white'
            }`}
          >
            <Text
              className={`text-sm ${board === b ? 'text-white' : 'text-black'}`}
            >
              {b}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={onboardingApi}
        className="bg-blue-500 py-4 rounded-xl items-center"
      >
        <Text className="text-white text-base font-semibold">Finish Setup</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
