import React, { useState } from "react"

import { View, Text, Pressable, StyleSheet } from "react-native"
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

interface ListProducts {
    id: number;
    name: string;
    price: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
}


const History = () => {
    const [listProducts, setListProducts] = useState<ListProducts[]>([])

    const deleteProduct = (productId: number) => {
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
      };

    return (
        <View style={styles.listContainer}>
            {listProducts.map((product) => (
              <View style={styles.cardProduct} key={product.id}>
                <View style={styles.containerProduct}>
                  <View style={styles.containerNameModify}>
                    <Pressable>
                      <EvilIcons name="pencil" size={24} color="black" />
                    </Pressable>
                    <Text>{product.name}</Text>
                  </View>
                  <Text>{product.price.toFixed(2)}</Text>
                </View>
                <View style={styles.containerBtns}>
                <Pressable onPress={() => deleteProduct(product.id)}>
                <MaterialIcons name="delete-forever" size={24} color="black" />
                    </Pressable>
                </View>
              </View>
            ))}
        </View>
        )
}
export default History


const styles = StyleSheet.create({
    listContainer: {
        borderWidth: 1,
        borderBlockColor: 'black',
        borderRadius: 8,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '80%'
    },
    containerInputs: {
        paddingTop: 20,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
       flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 6,

    },
    input: {
        height: 40,
        borderWidth: 1,
        borderBlockColor: 'black',
        borderRadius: 6,
        paddingLeft: 10,
    },
    inputName: {
        width: '50%',
    },
    inputPrice: {
        width: '20%',
    },
    cardProduct: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 4,
        backgroundColor: 'yellow',
        marginHorizontal: 10,
        borderRadius: 6,
        paddingVertical: 10
    },
    containerProduct : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    containerNameModify: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: 100,
    },
    containerBtns: {
        flexDirection: 'row'

    }
})
