import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

export default function TopProgressBar({
  step,
  router,
}: {
  step: number;
  router: any;
}) {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const widthPercent = (step / 3) * 100;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: widthPercent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [step, widthPercent]);

  return (
    <View className="flex flex-row w-11/12">
      <TouchableOpacity
        onPress={() => router.back()}
        className="px-0 -ml-[5px]"
      >
        <AntDesign name="left" size={24} color="black" className="mr-2" />
      </TouchableOpacity>
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2 mb-4">
        <Animated.View
          className="h-2 bg-blue-500"
          style={{
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  );
}
