import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { truncate } from 'lodash';
import React, { memo, useCallback } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';

const { green, blue, light_blue, icon } = Colors.light;

// Memoize StarRating component to prevent unnecessary re-renders
const StarRating = memo(
  ({ rating, maxStars = 5, size = 14 }: StarRatingProps) => {
    const color = rating > 2 ? '#facc15' : '#FD5E53';

    return (
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          if (starValue <= Math.floor(rating)) {
            return <Ionicons key={i} name="star" size={size} color={color} />;
          } else if (starValue - rating < 1) {
            return (
              <Ionicons key={i} name="star-half" size={size} color={color} />
            );
          } else {
            return (
              <Ionicons key={i} name="star-outline" size={size} color={color} />
            );
          }
        })}
      </View>
    );
  },
);

// Preload static images
const verifiedIcon = require('../assets/images/verified.png');
const barAirIcon = require('../assets/images/bar-air.png');

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

interface User {
  id: string;
  name: string;
  college: string;
  branch?: string;
  air: string;
  strength: string;
  sessions: number;
  languages: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  rating: number;
  subjectExpertise: string;
  inSession: boolean;
  available: boolean;
}

interface MentorCardProps {
  index: number;
  user: User;
  openChatSheet?: () => void;
  setSelectedItem: (val: User) => void;
  buttonText?: string;
  from?: string;
  goToProfile?: () => void;
}

const MentorCard = ({
  index,
  user,
  openChatSheet,
  setSelectedItem,
  buttonText = 'Chat',
  from = 'normal',
  goToProfile,
}: MentorCardProps) => {
  // Memoize status color calculation
  const statusColor = React.useMemo(() => {
    return user.inSession ? '#FFC20C' : user.available ? green : '#C30707';
  }, [user.inSession, user.available]);

  // Memoize truncated name
  const truncatedName = React.useMemo(() => {
    return truncate(user.name, { length: 12 });
  }, [user.name]);

  // Memoize status text
  const statusText = React.useMemo(() => {
    return user.inSession
      ? `In ${buttonText}`
      : user.available
        ? 'Online'
        : 'Offline';
  }, [user.inSession, user.available, buttonText]);

  // Memoize price display
  const priceDisplay = React.useMemo(() => {
    return from === 'booking' ? (
      <Text className="text-black font-semibold font-uber-bold text-[19px]">
        ₹{user.discountedPrice}
      </Text>
    ) : (
      <Text className="text-black font-semibold font-uber-bold text-[19px]">
        ₹{user.discountedPrice}/min
      </Text>
    );
  }, [from, user.discountedPrice]);

  // Memoize button disabled state
  const isButtonDisabled = React.useMemo(() => {
    return (!user.available || user.inSession) && buttonText !== 'Book';
  }, [user.available, user.inSession, buttonText]);

  // Memoize button background color
  const buttonBgColor = React.useMemo(() => {
    return (user.available && !user.inSession) || buttonText === 'Book'
      ? blue
      : '#8FC6FD';
  }, [user.available, user.inSession, buttonText]);

  // Memoize handlers
  const handlePress = useCallback(() => {
    if (openChatSheet) {
      openChatSheet();
    }
    setSelectedItem(user);
  }, [openChatSheet, setSelectedItem, user]);

  const handleProfilePress = useCallback(() => {
    if (goToProfile) {
      goToProfile();
    }
  }, [goToProfile]);

  return (
    <View
      key={index}
      className="border-2 border-gray-100 w-full rounded-[20px] px-2 py-2 mb-4 bg-white"
    >
      <View className="flex-row">
        <View className="bg-white w-3/12">
          <Pressable onPress={handleProfilePress}>
            <Image
              source={
                user?.image
                  ? { uri: user.image }
                  : {
                      uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                    }
              }
              style={{
                borderColor: 'green',
                width: 70,
                height: 70,
                borderRadius: 40,
                marginRight: 12,
                borderWidth: 3,
              }}
              contentFit="contain" // similar to FastImage.resizeMode.contain
              className="w-20 h-20 rounded-full border-[3px] mr-3"
            />
          </Pressable>
          <View className="w-[6rem] flex-none mt-4 items-start self-start">
            <StarRating rating={user.rating} size={12} />
          </View>
          <Text className={'font-nunito-Medium text-[9px] text-[#1c1c1c] mt-2'}>
            {user.sessions} Sessions
          </Text>
        </View>
        <View className="w-9/12">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleProfilePress}
              className="flex-row items-center"
            >
              <Text className="font-uber-bold text-[16px] mr-2">
                {truncatedName}
              </Text>
              <Image
                className="w-6 h-6"
                source={verifiedIcon}
                contentFit="contain" // replaces FastImage.resizeMode.contain
              />
            </TouchableOpacity>
            {buttonText !== 'Book' && (
              <View
                style={{ backgroundColor: statusColor }}
                className="rounded-full flex-row justify-between items-center px-4"
              >
                <MaterialCommunityIcons
                  name="circle"
                  size={10}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-uber-medium text-[8px]">
                  {statusText}
                </Text>
              </View>
            )}
          </View>
          <Text className={'text-black font-nunito-Medium text-[9px] my-0.5'}>
            {user.college} {user.branch && `| ${user.branch}`}
          </Text>
          <View className="flex-row mt-1 space-x-2 gap-2">
            <View
              style={{ backgroundColor: light_blue }}
              className="rounded-full px-[5px] py-1 flex-row justify-between items-center gap-[5px]"
            >
              <Image
                className="h-[11px] w-[11px]"
                source={barAirIcon}
                contentFit="contain"
              />
              <Text className={'text-[9px]  font-nunito-Medium'}>
                {user.air}
              </Text>
            </View>
            {user.subjectExpertise && (
              <View
                style={{ backgroundColor: light_blue }}
                className="rounded-full px-[5px] py-1"
              >
                <Text className={'text-[9px]  font-nunito-Medium'}>
                  Strength : {user.subjectExpertise}
                </Text>
              </View>
            )}
          </View>
          <View className="items-center w-full">
            <View className="flex-row">
              <Text className="text-black flex-1 text-left mt-2 font-uber-medium text-[9px]">
                {user.languages}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row gap-1 items-center">
              <Text className="line-through text-gray-400 font-uber-bold text-[21px]">
                ₹{user.originalPrice}
              </Text>
              {priceDisplay}
            </View>
            <TouchableOpacity
              disabled={isButtonDisabled}
              onPress={handlePress}
              style={{
                backgroundColor: buttonBgColor,
              }}
              className="rounded-[14px] px-8 py-2"
            >
              <Text className="text-white font-nunito-Bold font-bold text-[12px]">
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(MentorCard);
