import React from "react";
import {connect} from 'react-redux';
import { StyleSheet, TouchableHighlight,Image,Dimensions,View, ScrollView,FlatList} from "react-native";
import { Block, theme, Text, } from "galio-framework";
import axios from 'axios';
import styles from '../Styles/Style';
import { Card, Button } from "../components";
import articles from "../constants/articles";
import { nowTheme } from '../constants';

import * as selectors from './MainReducer/selectors';
import * as actions from './MainReducer/actions'; 

const { width } = Dimensions.get("screen");

class Featured extends React.Component {
  constructor(props){
    super(props);
    this.state={
      products:[],
      isLoading:true
    }
  }

async componentDidMount() {    
    await axios.get('https://5f331380ac00.ngrok.io/api/farmerProducts/').then(res=>{
      if(res.status === 200){
        this.setState({
          isLoading: false,
          products: res.data 
        })
        console.log(this.state.products)
      }
      else{
        console.log("data no fetch successfully");
      }
   })
   .then(error => {
     console.log(error);
   })
  }
  
  onPressProduct = item => {
    const {chooseProductItem} = this.props;

    chooseProductItem(item);

    this.props.navigation.navigate('ProductDetail');
  };


  renderProducts = ({item}) => {
    return (
      <Block>
        <TouchableHighlight underlayColor = 'rgba(73,182,77,1,0.9)' onPress={() => this.onPressProduct(item)}>
          <View style={styles.container}>
            <Image style={styles.photo} source={{ uri: item.productPicture }} />
            <Text 
              style={styles.title}
            >
              {item.productName}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        </TouchableHighlight>  
      </Block>      
      
    );
  };

  render() {
    if(this.state.isLoading) 
      return(
        <View>
          <Text style={{justifyContent:"center", alignContent:"center"}}>LOADING . . .</Text>
        </View>
    )
    else{
      return (
        <View >
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={this.state.products}
            renderItem={this.renderProducts}
            keyExtractor={item => `${item.id}`}
          />
        </View>
      );
    }
  }
}

const styless = StyleSheet.create({
  shadows:{
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  }  
});

const mapStateToProps = (state) => ({
  product: selectors.getProduct(state),
});

export default connect(mapStateToProps, {...actions})(Featured);

