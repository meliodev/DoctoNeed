import React, { Component } from 'react';
import ApiView from './Axios';
import axios from 'axios';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity
} from "react-native";


class ApiContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fromFetch: false,
            fromAxios: false,
            dataSource: [],
            axiosData: null
        };
    }
    goForFetch = () => {
        this.setState({
            fromFetch: true,
            loading: true,

        })
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => response.json())
            .then((responseJson) => {
                console.log('getting data from fetch', responseJson)
                this.setState({
                    loading: false,
                    dataSource: responseJson
                })
            })
            .catch(error => console.log(error))
    }
    goForAxios = () => {
        this.setState({
            fromFetch: false,
            loading: true,
        })

        axios.get("https://jsonplaceholder.typicode.com/users")
            .then(response => {
                console.log('getting data from axios', response.data);
                this.setState({
                    loading: false,
                    axiosData: response.data
                })
            })
            .catch(error => console.log(error));
    }

    // FlatListSeparator = () => {
    //     return (
    //         <View style={{
    //             height: .5,
    //             width: "100%",
    //             backgroundColor: "rgba(0,0,0,0.5)",
    //         }}
    //         />
    //     );
    // }

    renderItem = (data) => {
        return (
            <TouchableOpacity style={{flex: 1}}>
                <Text>{data.item.name}</Text>
                <Text>{data.item.email}</Text>
                <Text>{data.item.company.name}</Text></TouchableOpacity>
        )
    }

    render() {
        const { dataSource, fromFetch, fromAxios, loading, axiosData } = this.state
        return (
            <ApiView
                goForFetch={this.goForFetch}
                goForAxios={this.goForAxios}
                dataSource={dataSource}
                loading={loading}
                //fromFetch={fromFetch}
                fromAxios={fromAxios}
                axiosData={axiosData}
                FlatListSeparator={this.FlatListSeparator}
                renderItem={this.renderItem}
            />
        );
    }
}

export default ApiContainer;