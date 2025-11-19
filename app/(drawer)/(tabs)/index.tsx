import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import YoutubePlayer from 'react-native-youtube-iframe';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import { api } from '@/components/ApiHelper';
// import GlobalChatWaitlistModal from '@/components/GlobalChatWaitlistModal';
import MentorCard from '@/components/MentorCard';
// import Orders from '@/components/Orders';

import useAuthStore from '../../store/Store';

interface Card {
  id: string;
  name: string;
  college: string;
  branch: string;
  air: string;
  strength: string;
  sessions: number;
  languages: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  rating: number;
  subjectExpertise: string;
}

const mapMentorData = (mentorData: any[]) => {
  return mentorData.map((user) => ({
    id: user?._id || user?.id,
    name: user?.name,
    college: user?.institute || '',
    branch: user?.subjectExpertise || '',
    air: user?.airRank || user.mainsRank || '',
    strength: user?.expertise?.[0] || 'N/A',
    sessions: user?.totalSessions || 0,
    languages: user?.languages?.join(', ') || '',
    originalPrice: user?.offeredChatRate || user.chatRate || 0,
    discountedPrice: user?.chatRate || 0,
    image:
      user?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    rating: user.ratings || 0,
    subjectExpertise: user.subjectExpertise,
    inSession: user.inSession || false,
    available: user.availableForChat || false,
  }));
};

export default function HomeScreen() {
  console.log('This is Home screen file');

  const [data, setData] = useState<Card[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const [sheetChatIndex, setSheetChatIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const chatIntakeRef = useRef<BottomSheetModal>(null);

  const fetchMentors = useCallback(async () => {
    const { res, error } = await api('mentor/chat', 'GET', {});
    if (error) {
      console.log('📩 fetchMentors failed:', error);
    } else {
      const mappedData: Card[] = mapMentorData(res?.mentors || []);
      setData(mappedData);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const snapPointsChat = useMemo(() => ['50%', '90%'], []);

  const closeChatSheet = useCallback(() => {
    setSheetChatIndex(-1);
    chatIntakeRef.current?.dismiss();
  }, []);

  const closeModal = () => {
    setModalVisible(true);
  };

  const openChatSheet = useCallback(() => {
    console.log('open');
    setSheetChatIndex(1);
    chatIntakeRef.current?.present();
  }, []);

  const propData = {
    router,
    selectedItem,
    closeChatSheet,
    closeModal,
  };

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              className="flex-row items-center space-x-2"
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <MaterialIcons name="menu" size={28} color="#000000" />
              <Image
                source={require('../../../assets/images/user.png')}
                className="w-14 h-14 rounded-full mr-2"
              />
            </TouchableOpacity>
            <Text className="text-lg font-[16px] font-uber-bold">
              Hi {user?.name ?? ''}!
            </Text>
          </View>
          <TouchableOpacity
            // onPress={() => router.navigate('/screens/RechargeScreen')}
            className="bg-[#FFB70020] border-[#FFB700] border py-2 px-2 text-center justify-center rounded-2xl flex flex-row items-center "
          >
            {!user?.wallet && (
              <Ionicons
                name="wallet"
                size={14}
                color="#FFB700"
                className="mr-1"
              />
            )}

            <Text className="font-uber-bold text-[10px] text-black">
              {user?.wallet > 0 ? `₹ ${user.wallet}` : 'Add Cash'}
            </Text>
            {!user?.wallet && (
              <AntDesign name="plus-circle" size={14} className="ml-2" />
            )}
            {user?.wallet > 0 && (
              <Ionicons
                name="wallet"
                size={14}
                color="#FFB700"
                className="ml-1"
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Section */}
          <View className="px-4 mt-2">
            <View className="h-[200px]  bg-black w-full overflow-hidden rounded-2xl">
              {/* <YoutubePlayer
                height={220}
                // play={playing}
                videoId={'2l7DDNnxbo0'}
                // onChangeState={onStateChange}
              /> */}
            </View>
          </View>

          {/* Your Sessions */}
          {/* <Orders /> */}

          {/* Banner */}
          <View className="px-4 mt-5">
            <LinearGradient
              // Button Linear Gradient
              colors={['#1A8CFF', '#AA8FFF']}
              className="rounded-2xl p-4 flex-row justify-between items-center"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderRadius: 16,
              }}
            >
              <View className="flex-row items-start">
                <MaterialIcons
                  name="star"
                  size={21}
                  className="mr-1"
                  color="white"
                />
                <View>
                  <Text className="font-semibold font-uber text-[12px] text-white">
                    Try Asking Sparq
                  </Text>
                  <Text className="text-[9px]  font-nunito font-medium mt-1 text-white">
                    Your Personal AI Tutor Buddy
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert('Coming Soon')}
                className="bg-white rounded-xl px-4 py-3"
              >
                <Text className="text-black px-4 font-semibold text-sm">
                  Ask Now
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* IITians List */}
          <View className="px-4 mt-5">
            <Text className="text-lg font-semibold  font-uber-bold  text-black mb-3">
              Popular Mentors
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.map((item: any, idx) => (
                <View key={idx} className={`mr-2 w-[320px]`}>
                  <MentorCard
                    key={idx}
                    index={idx}
                    user={item}
                    openChatSheet={openChatSheet}
                    setSelectedItem={setSelectedItem}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Chapter wise PYQs */}
          <View className="px-4 mt-5">
            <Text className="text-lg font-semibold font-uber-bold mb-3 text-black">
              Chapter wise PYQs
            </Text>
            <Image
              source={require('../../../assets/images/upcomming.png')}
              className="w-full h-[75px] mx-auto border-gray-300 rounded-xl"
            />
          </View>

          {/* Chapter wise formulas revision */}
          <View className="px-4 mt-12">
            <Text className="text-lg font-semibold font-uber-bold mb-3 text-black">
              Chapter wise formulas revision
            </Text>
            <Image
              source={require('../../../assets/images/upcomming.png')}
              className="w-full h-[75px] mx-auto border-gray-300 rounded-xl"
            />
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View className="absolute bottom-2 left-4 right-4 flex-row">
          <TouchableOpacity
            className="flex-1 bg-[#1A8CFF] py-4 items-center justify-center mr-2 rounded-[12px] flex-row"
            onPress={() => router.navigate('/chat')}
          >
            <MaterialIcons
              name="chat"
              size={20}
              color="white"
              className="mr-1"
            />
            <Text className="text-white font-bold font-nunito-Bold text-[12px]">
              Chat with IITian
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-[#1A8CFF] py-4 items-center justify-center mr-2 rounded-[12px] flex-row"
            onPress={() => router.navigate('/call')}
          >
            <MaterialIcons
              name="call"
              size={20}
              color="white"
              className="mr-1"
            />
            <Text className="text-white font-bold font-nunito-Bold text-[12px]">
              Talk with IITian
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetModal
        ref={chatIntakeRef}
        snapPoints={snapPointsChat}
        index={sheetChatIndex}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            appearsOnIndex={1}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView style={{ paddingHorizontal: 10 }}>
          <View>
            <Text className="text-lg font-uber-bold text-center mt-4 mb-2">
              Before you start chatting...
            </Text>
          </View>
          {/* <ChatIntakeForm router={propData} /> */}
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* <GlobalChatWaitlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        studentName={user?.name || ''}
        studentAvatar="https://files.idyllic.app/files/static/2743403?width=1920&optimizer=image"
        mentorName={selectedItem?.name || ''}
        mentorAvatar={
          selectedItem?.image ||
          'https://res.cloudinary.com/dligtgemi/image/upload/v1740572777/roshan_ncuwli.webp'
        }
        waitTime="~1 min"
      /> */}
    </BottomSheetModalProvider>
  );
}
