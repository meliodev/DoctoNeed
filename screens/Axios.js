import React, { Component } from 'react'
import { View, Text, Button, FlatList, ActivityIndicator } from 'react-native';

const ApiView = (props) => {

    const { goForFetch, goForAxios, fromFetch, fromAxios, axiosData, renderItem, FlatListItemSeparator, dataSource, loading } = props

    return (
        <View style={{ flex: 1 }}>
            <View style={{ margin: 18 }}>
                <Button
                    title={'Click using Fetch'}
                    onPress={goForFetch}
                    color='green'
                />
            </View>
            <View style={{ margin: 18 }}>
                <Button
                    title={'Click using axios'}
                    onPress={goForAxios}
                    color='green'
                />
            </View>


            {fromFetch ?
                <FlatList
                    data={dataSource}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    renderItem={item => renderItem(item)}
                    keyExtractor={item => item.id.toString()}
                /> : <FlatList
                    data={axiosData}
                    ItemSeparatorComponent={FlatListItemSeparator}
                    renderItem={item => renderItem(item)}
                    keyExtractor={item => item.id.toString()}
                />
            }
            {loading &&
                <View style={{ flex: 1 }}>
                    <ActivityIndicator size="large" color="#0c9" />
                    <Text>Fetching Data</Text>
                </View>
            }
        </View>
    )
}
export default ApiView;

