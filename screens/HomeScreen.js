import {
	FlatList,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	View,
	TextInput,
	Button,
	KeyboardAvoidingView,
	Keyboard,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ToastAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeHeader from '../components/HomeHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalScreen from './ModalScreen';
import Voice from '@react-native-voice/voice';
import axios from 'axios';

const HomeTab = () => {
	const [dialect, setDialect] = useState('지역 선택');
	const [modalVisible, setModalVisible] = useState(false);
	const [loadingVisible, setLoadingVisible] = useState(false);
	const [text, setText] = useState('');
	const [translateText, setTranslateText] = useState('');

	// 파일 업로드 파트
	const [uploadVisible, setUploadVisible] = useState(false);

	// 음성 인식 파트
	const [isRecord, setIsRecord] = useState(false);
	let timer;
	const [check, setCheck] = useState(false);
	const buttonLabel = isRecord ? 'Stop' : 'Start';
	const voiceLabel = text ? text : isRecord ? '번역할 내용을 입력하세요.' : '';

	const onPressModal = () => {
		setModalVisible(() => !modalVisible);
	};

	const mapping = region => {
		if (region === '강원도') return 0;
		else if (region === '경상도') return 1;
		else if (region === '전라도') return 2;
		else if (region === '제주도') return 3;
		else if (region === '충청도') return 4;
		else undefined;
	};

	const onSubmit = useCallback(
		e => {
			const url = 'http://202.31.202.9/translate';
			const header = {Accept: 'application/json', 'Content-type': 'application/json'};
			const crossOriginIsolated = {withCredentials: true};
			const data = {
				dialect: text,
				label: mapping(dialect),
			};
			console.log('data : ', data);
			// fetch(url, {method: 'POST', header, crossOriginIsolated}, data)
			// 	.then(response => {
			// 		console.log(response);
			// 		setDialect(response.region);
			// 		setTranslateText(response.standard_form);
			// 		console.log(response.region);
			// 		console.log(response.standard_form);
			// 	})
			// 	.catch(err => console.error(`Error Occured : ${err}`));
			axios
				.post(url, data, header, crossOriginIsolated)
				.then(response => {
					console.log(response.data);
					setDialect(response.data.region);
					setTranslateText(response.data.standard_form);
					console.log(response.data.region);
					console.log(response.data.standard_form);
				})
				.catch(err => console.error(`Error Occured : ${err}`));
			// e.event.preve // 불필요한 렌더링 방지
		},
		[dialect, text],
	);

	// 파일 업로드 파트 함수
	const onChangeUploadVisible = () => {
		setUploadVisible(() => !uploadVisible);
	};

	// 음성 인식 파트 함수
	const onChangeLoadingModal = () => {
		setLoadingVisible(() => !loadingVisible);
		Voice.stop();
	};

	const onVoiceEnd = () => {
		if (Voice.isRecognizing() === 0) return;

		Voice.stop();
	};

	const _onSpeechStart = () => {
		console.log('onSpeechStart');
		setText('');
	};

	const _onSpeechEnd = () => {
		console.log('onSpeechEnd');
		setIsRecord(!isRecord);
		setLoadingVisible(() => false);
		console.log('loading state : ', loadingVisible);
	};

	const _onSpeechRecognized = event => {
		console.log('음성 인식 시작!!');
		if (Voice.isRecognizing() === 0) clearTimeout(timer);
	};

	const _onSpeechResults = event => {
		console.log('onSpeechResults');

		setText(event.value[0]);
		timer = setTimeout(() => onVoiceEnd(), 3000);
	};

	const _onRecordVoice = () => {
		if (isRecord) {
			Voice.stop();
		} else {
			setLoadingVisible(true);
			Voice.start('ko-KR');
		}
		setIsRecord(!isRecord);
	};

	const _onSpeechError = event => {
		Voice.start('ko-KR');
	};

	useEffect(() => {
		Voice.onSpeechStart = _onSpeechStart;
		Voice.onSpeechEnd = _onSpeechEnd;
		Voice.onSpeechRecognized = _onSpeechRecognized;
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
			{uploadVisible && (
				<Modal
					isVisible={uploadVisible}
					useNativeDriver={true}
					onBackdropPress={() => onChangeUploadVisible()}
					animationIn="slideInUp"
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View style={styles.modalBox}>
						<Icon style={styles.icon} name="insert-drive-file" size={48} />
						<Text style={styles.text}>파일 업로드</Text>
						<View style={styles.fileBox}>
							<Text style={styles.text_white}>DROP!!</Text>
						</View>
						<Text style={styles.text}>번역 Test</Text>
						<Pressable
							style={({pressed}) => [
								Platform.OS === 'ios' && {
									opacity: pressed ? 0.6 : 1,
								},
								styles.buttonBox,
							]}
							android_ripple={{color: '#ededed'}}>
							<Text style={styles.text_white}>번역하기</Text>
						</Pressable>
					</View>
				</Modal>
			)}
			{loadingVisible && (
				<Modal
					isVisible={loadingVisible}
					useNativeDriver={true}
					onBackdropPress={() => onChangeLoadingModal()}
					animationIn="slideInUp"
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View style={styles.loadingBox}>
						<Icon style={styles.icon} name="mic" size={48} />
						<Text style={styles.text}>녹음 중입니다.</Text>
					</View>
				</Modal>
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

			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<View style={styles.translateContainer}>
					<View style={styles.inputTextBox}>
						<TextInput
							style={styles.textBox}
							placeholder="번역할 내용을 입력하세요."
							returnKeyType="done"
							onChangeText={setText}
							value={text}
							multiline
						/>

						<View style={styles.button}>
							<Pressable
								style={({pressed}) => [
									Platform.OS === 'ios' && {
										opacity: pressed ? 0.6 : 1,
									},
								]}
								android_ripple={{color: '#ededed'}}
								onPress={() => onChangeUploadVisible()}>
								<Icon name="file-upload" color="black" size={32} />
							</Pressable>
							<Pressable
								style={({pressed}) => [
									Platform.OS === 'ios' && {
										opacity: pressed ? 0.6 : 1,
									},
								]}
								android_ripple={{color: '#ededed'}}
								onPress={() => _onRecordVoice()}>
								<Icon name="mic" color="black" size={32} />
							</Pressable>
						</View>
					</View>

					<TouchableOpacity
						style={styles.touchContainer}
						onPress={() => onSubmit()}
						activeOpacity={0.7}>
						<Text style={styles.text_white}>번역하기</Text>
					</TouchableOpacity>
					<Text style={[styles.inputTextBox, styles.inputText]}>{translateText}</Text>
				</View>
			</TouchableWithoutFeedback>
			{console.log('loading state2 : ', loadingVisible)}
		</SafeAreaView>
	);
};

export default HomeTab;

const styles = StyleSheet.create({
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
		padding: 15,
		fontWeight: 'bold',
		color: '#263238',
	},
	text_white: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	inputText: {
		fontSize: 18,
	},
	seperator: {
		backgroundColor: '#263238',
		height: 1,
	},
	translateContainer: {
		marginHorizontal: 10,
		flex: 1,
	},
	inputTextBox: {
		flexDirection: 'column',
		borderWidth: 1,
		borderColor: '#263238',
		marginTop: 50,
		height: '30%',
		borderRadius: 6,
	},
	textBox: {
		flex: 1,
		fontSize: 18,
		textAlignVertical: 'top',
	},
	buttonBox: {
		height: '10%',
		backgroundColor: '#25DA69',
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		bottom: 0,
		right: 0,
	},
	touchContainer: {
		height: '8%',
		backgroundColor: '#25DA69',
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalBox: {
		width: '90%',
		height: '50%',
		backgroundColor: '#fafafa',
		paddingHorizontal: 20,
		flexDirection: 'column',
		alignItems: 'center',
	},
	fileBox: {
		width: '80%',
		height: '30%',
		backgroundColor: '#00c853',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingBox: {
		position: 'absolute',
		bottom: 1,
		flexDirection: 'column',
		alignItems: 'center',
		width: '90%',
		// height: '50%',
		backgroundColor: '#fafafa',
	},
	icon: {
		paddingTop: 15,
		size: '32',
	},
});
