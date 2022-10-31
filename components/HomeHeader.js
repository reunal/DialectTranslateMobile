import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const HomeHeader = () => {
	return (
		<View style={styles.block}>
			<Text style={styles.headerText}>동네 사람들</Text>
		</View>
	);
};

export default HomeHeader;

const styles = StyleSheet.create({
	block: {
		backgroundColor: 'white',
		padding: 12,
		height: 80,
		borderBottomWidth: 1,
		borderBottomColor: '#263238',
	},
	headerText: {
		fontSize: 48,
		color: '#00c853',
		fontWeight: 'bold',
	},
});
