import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const Writer = () => {
	return (
		<View style={styles.block}>
			<TextInput
				placeholder="번역할 내용을 입력하세요."
				style={styles.textBox}
				returnKeyType="send"
				onChangeText={onChangeText}
				value={text}
			/>
		</View>
	);
};

export default Writer;

const styles = StyleSheet.create({
	block: {},
});
