import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const EmptyList = ({ iconName, iconStyle, header, headerTextStyle, description, descriptionTextStyle, style, ...props }) => (
    <View style={[styles.container, style]}>
        <View style={[{ width: 130, height: 130, borderRadius: 75, justifyContent: 'center', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff' }, iconStyle]}>
            <Icon name={iconName} size={80} color='#BDBDBD' />
        </View>
        <View style={[{ marginBottom: 10 }]}>
            <Text style={[{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#BDBDBD' }, headerTextStyle]}>{header}</Text>
        </View>
        <View>
            <Text style={[ { textAlign: 'center', color: 'gray' }, descriptionTextStyle]}>{description}</Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 33,
        paddingTop: 50,
        //justifyContent: 'center',
        alignItems: 'center',
    },
})

export default EmptyList
