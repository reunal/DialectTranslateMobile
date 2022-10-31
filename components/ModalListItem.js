import {Platform, Pressable, StyleSheet, Text} from 'react-native';
import React from 'react';

const ModalListItem = ({data, dialect, onPress}) => {
	return (
		<Pressable
			style={({pressed}) => [
				styles.block,
				Platform.OS === 'ios' && pressed && {backgroundColor: '#efefef'},
			]}
			android_ripple={{color: '#ededed'}}
			onPress={() => onPress(data)}>
			<Text style={styles.body}>{data}</Text>
		</Pressable>
	);
};

export default ModalListItem;

const styles = StyleSheet.create({
	block: {
		paddingHorizontal: 5,
		paddingVertical: 15,
		borderBottomWidth: 1,
	},
	body: {
		color: '#37474f',
		fontSize: 20,
		fontWeight: 'bold',
	},
});
