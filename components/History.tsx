import React, { useCallback, useEffect, useState } from "react"

import { View, Text, Pressable, StyleSheet, FlatList, Modal } from "react-native"
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import supabase from "../supabase.init";
import { error } from "console";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "./CustomButton";
import { ActionColor, CardColor, ReducColor } from "../colors";

interface ListProducts {
    id: number;
    name: string;
    price: number;
    nb: number;
    reduction_percent: number;
    reduction_euros: number;
    reduction_other_product: number
}

interface Product {
    id: number;
    name: string;
    price: number;
    nb: number;
    reduction_percent: number;
    reduction_euros: number;
    reduction_other_product: number
}


const History = ({onHistoryTotalPriceChange}:any) => {
    const [productEnter, setProductEnter] = useState<string>("")
    const [priceEnter, setPriceEnter] = useState<number>(0)
    const [numberProduct, setNumberProduct] = useState<number>(1)
    const [listProducts, setListProducts] = useState<ListProducts[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [reductionEuros, setReductionEuros] = useState(0)
    const [reductionPercent, setReductionPercent] = useState(0)
    const [reductionOtherProductPercent, setReductionOtherProductPercent] = useState(0)
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    useFocusEffect(
        useCallback(() => {
            fetchData();

            // Optional cleanup function
            return () => {
                // Clean up logic if necessary
            };
        }, [])
    );

    
    const deleteHistory = async () => {
        const { data, errorfetchId } = await supabase
        .from('history_list')
        .select('id')
        
        if (errorfetchId) {
            console.error(errorfetchId.message);
        }
        if (data ){
            for (let i= 0; i < data.length; i++) {
                const { error } = await supabase
                .from('history_list')
                .delete()
                .eq('id', data[i].id)

                if (error) {
                    console.error(error.message);
                }
            }
        }
        setModalVisible(false)
        setListProducts([])
        onHistoryTotalPriceChange(0);
    }
    

    const fetchData = async() => {
        const {data, error}: any = await supabase
        .from('history_list')
        .select('*')
        .order('name', {ascending: true})

        setListProducts(data)

        if (error) {
            console.error(error.message);
            
        }
    }
    useEffect(() => {
        if (listProducts.length > 0) {
            const total = listProducts
                .map((product) => {
                    const discountedPrice : number = calcPercent(product.price, product.reduction_percent, product.reduction_euros, product.nb, product.reduction_other_product);
                    return discountedPrice;
                })
                .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            setTotalPrice(total);
            onHistoryTotalPriceChange(total);
        } else {
            setTotalPrice(0);
        }
    }, [listProducts, fetchData]);

    const deleteProduct = async (productId: number) => {
        
        const { error } = await supabase
            .from('history_list')
            .delete()
            .eq('id', productId)
            if (error) {
              console.error(error.message);
              
            }
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
        if (listProducts.length === 1) {
            onHistoryTotalPriceChange(0)
        }
      };

      const calcPercent = (price: number, reduction: number, reductionEuro: number, nbP: number, reductionOther: number):number => {
        const calc: number = price * reduction / 100
        const other: number = price * (reductionOther / 100 / nbP)
        const val: number = (price - calc - other - reductionEuro) * nbP
        return val
    }

    const renderProduct = ({ item }: { item: ListProducts }) => (
        <View style={styles.cardProduct} key={item.id}>
            <View style={styles.containerProduct}>
                <View style={styles.containerNameNumber}>
                    <Text style={[styles.text, {paddingHorizontal: 6}]}>{item.nb}</Text>
                    <Text style={[styles.text, {maxWidth: 60}]}>{item.name}</Text>
                    <Text style={[styles.text, styles.priceUnite]}> unité: {item.price} €</Text>
                    <Text style={[styles.text, {marginRight: 'auto', marginLeft: 'auto'}]}>
                        Prix: {calcPercent(
                            Number(item.price),
                            Number(item.reduction_percent),
                            Number(item.reduction_euros),
                            Number(item.nb),
                            Number(item.reduction_other_product)
                        ).toFixed(2)} €
                    </Text>
                </View>

                <View style={styles.containerReduction}>
                    {item.reduction_euros > 0 || item.reduction_other_product > 0 || item.reduction_percent > 0 ? 
                        <Text style={styles.textReduction}>Réduction:</Text>
                    : null}
                    {item.reduction_euros > 0 ? 
                        <Text style={styles.textReduction}>- {item.reduction_euros.toFixed(2)}€</Text>
                    : null}
                    {item.reduction_percent > 0 ? 
                        <Text style={styles.textReduction}>- {item.reduction_percent}%</Text>
                    : null}
                    {item.reduction_other_product > 0 ? 
                        <Text style={styles.textReduction}> 2ème produit: - {item.reduction_other_product}%</Text>
                    : null}
                </View>
            </View>
            <View style={styles.containerBtns}>
               
                <Pressable onPress={() => deleteProduct(item.id)}>
                    <MaterialIcons name="delete-forever" size={30} color="#EABAB7" />
                </Pressable>
               
            </View>
        </View>
    );

    return (
    <View style={styles.listContainer}>
        { listProducts.length !== 0 ?
        <CustomButton 
        addStyle={styles.redBtn}
            action={() => setModalVisible(true)}
            text="Tout supprimer"
            disabled= {false}
            />
            : null}
        { modalVisible === true ?
        <Modal>
            <View style={styles.modal}>
                <Text style={styles.textModal}>Cette action supprimera le ticket de caisse.</Text>
                <Text style={styles.textModal}>Voulez vous continuer ?</Text>
                <CustomButton 
                addStyle={styles.redBtn}
                action={deleteHistory}
                text="OUI"
                disabled= {false}
                />
                <CustomButton 
                addStyle={[styles.redBtn, styles.greenBtn]}
                action={() => setModalVisible(false)}
                text="NON"
                disabled= {false}
                />
            </View>
        </Modal>
        : null }
        <FlatList
                data={listProducts}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
        />
        <Text>Prix Total: {totalPrice.toFixed(2)} €</Text>
    </View>
    )
}

export default History

const styles = StyleSheet.create({
    listContainer: {
        borderRadius: 8,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: '89%',
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
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginVertical: 4,
        backgroundColor: CardColor,
        marginHorizontal: 10,
        borderRadius: 6,
        paddingVertical: 10
    },
    containerProduct : {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    containerNameNumber: {
        flexDirection: 'row',
        marginRight: 'auto',
        marginLeft: 'auto',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    containerBtns: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 10,
        justifyContent: 'space-around'
    },
    containerReduction: {
        width:'80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: ReducColor,
        borderRadius: 6,
        paddingHorizontal: 6
    },
    containerReductionInput: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingBottom: 16,
        
    },
    inputReduction: {
        minWidth: 100,
        marginLeft: 10,
    },
    priceUnite: {
        marginLeft: "auto",
        marginRight: "auto"
    },row1: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    },
    textReduction: {

    },
    modal: {
        marginTop: 'auto',
        marginBottom: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
    redBtn: {
        backgroundColor: "salmon",
        width: '40%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10
    },
    greenBtn: {
        backgroundColor: ActionColor,
    },
    textModal: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    }
    
})
