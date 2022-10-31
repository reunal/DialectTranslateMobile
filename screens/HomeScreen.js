import {
	FlatList,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	TouchableOpacity,
	KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeHeader from '../components/HomeHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalScreen from './ModalScreen';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const HomeTab = () => {
	const [dialect, setDialect] = useState('지역 선택');
	const [modalVisible, setModalVisible] = useState(false);
	const [text, setText] = useState('');
	const [translateText, setTranslateText] = useState('');

	// 음성 인식 파트
	const [isRecord, setIsRecord] = useState(false);
	const [voiceText, setVoiceText] = useState('');
	const buttonLabel = isRecord ? 'Stop' : 'Start';
	const voiceLabel = voiceText ? voiceText : isRecord ? 'Say somethings' : 'press Start Button';

	const onPressModal = () => {
		setModalVisible(!modalVisible);
	};

	const onSubmit = () => {
		const getTranslateResult = async () => {
			try {
				// const translateResult = await axios.get('url');
				// setTranslateText(translateResult);
			} catch (err) {
				console.log('Err', err);
			}
		};
		console.log('서버로 통신');
	};

	// 음성 인식 파트 함수
	const _onSpeechStart = () => {
		console.log('onSpeechStart');
		setVoiceText('');
	};

	const _onSpeechEnd = () => {
		console.log('onSpeechEnd');
	};

	const _onSpeechResults = event => {
		console.log('onSpeechResults');
		setVoiceText(event.value[0]);
	};

	const _onRecordVoice = () => {
		if (isRecord) {
			Voice.stop();
		} else {
			Voice.start('ko-KR');
		}
		setIsRecord(!isRecord);
	};

	const _onSpeechError = event => {
		console.log('_onSpeechError');
		console.log(event.error);
	};

	useEffect(() => {
		Voice.onSpeechStart = _onSpeechStart;
		Voice.onSpeechEnd = _onSpeechEnd;
		Voice.onSpeechResults = _onSpeechResults;
		Voice.onSpeechError = _onSpeechError;

		return () => {
			Voice.destroy().then(Voice.removeAllListeners);
		};
	}, []);

	return (
		<SafeAreaView style={styles.block}>
			<HomeHeader />
			{modalVisible && (
				<ModalScreen
					dialect={dialect}
					setDialect={setDialect}
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				/>
			)}
			<View style={styles.areaSelect}>
				<Pressable
					style={({pressed}) => [
						Platform.OS === 'ios' && {
							opacity: pressed ? 0.6 : 1,
						},
					]}
					android_ripple={{color: '#ededed'}}
					onPress={onPressModal}>
					<Text style={styles.text}>{dialect}</Text>
				</Pressable>
				<Icon name="double-arrow" size={24} />
				<Text style={styles.text}>표준어</Text>
			</View>
			<View style={styles.seperator} />

			<View style={styles.translateContainer}>
				<TextInput
					style={styles.textBox}
					placeholder="번역할 내용을 입력하세요."
					returnKeyType="next"
					onChangeText={setText}
					multiline
					value={text}
				/>
				<TouchableOpacity
					style={styles.translate}
					onPress={() => onSubmit()}
					activeOpacity={0.7}>
					<Text style={styles.translateText}>번역하기</Text>
				</TouchableOpacity>
				<Text style={styles.textBox}>{translateText}</Text>
			</View>
			{/* <View style={styles.test}>
				<Text>{voiceLabel} 안녀앟세요</Text>
				<Button onPress={_onRecordVoice} title={buttonLabel} />
			</View> */}
		</SafeAreaView>
	);
};

export default HomeTab;

const styles = StyleSheet.create({
	test: {
		flex: 1,
		justifyContent: 'center',
	},
	block: {
		flex: 1,
		backgroundColor: 'white',
	},
	areaSelect: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		padding: 20,
		fontWeight: 'bold',
		color: '#263238',
	},
	text2: {
		fontSize: 14,
		padding: 5,
		fontWeight: 'bold',
		color: '#263238',
	},
	seperator: {
		backgroundColor: '#263238',
		height: 1,
	},
	textBox: {
		height: '30%',
		fontSize: 18,
		marginTop: 50,
		borderWidth: 1,
		borderColor: '#263238',
		textAlignVertical: 'top',
		borderRadius: 6,
	},
	translateContainer: {
		marginHorizontal: 10,
	},
	translate: {
		height: '8%',
		backgroundColor: '#25DA69',
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	translateText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
});
