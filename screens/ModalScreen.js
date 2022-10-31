import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import ModalListItem from '../components/ModalListItem';

const ModalScreen = ({dialect, setDialect, modalVisible, setModalVisible}) => {
	const text = ['지역 감지', '강원도', '경상도', '전라도', '제주도', '충청도'];

	const onPressDialect = data => {
		setDialect(data);
		setModalVisible(!modalVisible);
	};

	return (
		<View>
			<Modal
				isVisible={modalVisible}
				useNativeDriver={true}
				onBackdropPress={() => setModalVisible(false)}
				animationIn="slideInUp"
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitle}>지역 선택</Text>
					<View style={styles.textList}>
						<FlatList
							data={text}
							style={styles.block}
							renderItem={({item}) => (
								<ModalListItem
									data={item}
									dialect={dialect}
									onPress={onPressDialect}
								/>
							)}
						/>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default ModalScreen;

const styles = StyleSheet.create({
	modalContainer: {
		width: '90%',
		height: '50%',
		backgroundColor: 'white',
		paddingHorizontal: 20,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	modalTitle: {
		fontSize: 24,
		padding: 15,
		fontWeight: 'bold',
		color: '#263238',
	},
	textList: {
		flex: 3,
	},
});
