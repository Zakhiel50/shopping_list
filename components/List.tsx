import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Modal} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { ActionColor, BtnDisabled, CardColor, ReducColor } from '../colors';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import supabase from '../supabase.init'
import { useFocusEffect } from '@react-navigation/native';
import { searchTerms } from '../SearchTerm';

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

const List = ({ onTotalPriceChange }:any) => {
    const [productEnter, setProductEnter] = useState<string>("")
    const [priceEnter, setPriceEnter] = useState<number>(0)
    const [numberProduct, setNumberProduct] = useState<number | string>(1)
    const [listProducts, setListProducts] = useState<ListProducts[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [reductionEuros, setReductionEuros] = useState(0)
    const [reductionPercent, setReductionPercent] = useState(0)
    const [reductionOtherProductPercent, setReductionOtherProductPercent] = useState(0)
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [lastAction, setLastAction] = useState<string | null>(null); // Nouvel état pour suivre la dernière action

    const filteredTerms = searchTerms.filter(term => term.toLowerCase().includes(productEnter.toLowerCase()));



    if (numberProduct === 0 || numberProduct === null || numberProduct === undefined) {
        setNumberProduct(1)
    }



    const fetchData = async() => {
        const {data, error}: any = await supabase
        .from('shopping_List')
        .select('*')
        .order('name', {ascending: true})

        setListProducts(data)
    }

    // Remove product and fetch name and price
    const updateProduct = async (product: Product, productId: number) => {
        const number = product.nb.toString()
        setProductEnter(product.name)
        setNumberProduct(number)
        const { error } = await supabase
            .from('shopping_List')
            .delete()
            .eq('id', productId)
            .order('name', {ascending: true})

        if (error) {
            console.error(error.message);
            
        }
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
        setLastAction('updateProduct');

    };

    const deleteProduct = async (productId: number) => {
        const { error } = await supabase
        .from('shopping_List')
        .delete()
        .eq('id', productId)

        if (error) {
            console.error(error.message);
            
        }
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
        setLastAction('deleteProduct');
        if (listProducts.length === 1) {
            onTotalPriceChange(0)
        }
    };

    const addHistory = async (product: Product, productId: number) => {
    
        const { productToHistory, errorProductToHistory }: any = await supabase
        .from('history_list')
        .insert([
            {
                id: productId,
                name: product.name,
                price: product.price,
                nb: product.nb,
                reduction_percent: Number(product.reduction_percent),
                reduction_euros: Number(product.reduction_euros),
                reduction_other_product: Number(product.reduction_other_product),
            }
        ])
        .select();
        if (errorProductToHistory) {
            console.error(errorProductToHistory.message)
        }
        deleteProduct(productId)     
        setLastAction('addHistory');
        if (listProducts.length === 1) {
            onTotalPriceChange(0)
        }
        
    }

    useEffect(() => {
        if (listProducts.length > 0) {
            calcTotal()
            
        } else {
            setTotalPrice(0);
        }
    }, [listProducts, modalVisible]);

    const calcTotal = () => {
        if (modalVisible === false ){
            const total = listProducts
                    .map((product) => {
                        const discountedPrice : number = calcPercent(product.price, product.reduction_percent, product.reduction_euros, product.nb, product.reduction_other_product);
                        return discountedPrice;
                    })
                    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

                setTotalPrice(total);
                
                onTotalPriceChange(total);
            }
    }

    const addProduct = async () => {
        const product: Product =
            {
                'id': Date.now(),
                'name': productEnter.trim(),
                'price': Number(priceEnter),
                'nb': Number(numberProduct),
                'reduction_percent': Number(reductionPercent),
                'reduction_euros': Number(reductionEuros),
                'reduction_other_product': Number(reductionOtherProductPercent),
            }
            
        const {addProductToSupabase, errorToAddProduct}: any = await supabase
        .from('shopping_List')
        .insert([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            nb: product.nb,
            reduction_percent: product.reduction_percent,
            reduction_euros: product.reduction_euros,
            reduction_other_product: product.reduction_other_product
          }
        ])
        .select();
        

        if (errorToAddProduct) {
          console.error(errorToAddProduct.message)
        }
        if (product.price !== 0) {
            setModalVisible(true)
        } 
                    
        if ( !Number.isNaN(product.price) && product.price !== undefined ) {
            if (listProducts !== undefined) {
                setListProducts(prevListProducts => [...prevListProducts, product]);
            } else {
                setListProducts([product])
            }
            setPriceEnter(Number(''))
            setProductEnter('')
            setNumberProduct(Number(''))
            setReductionEuros(Number(''))
            setReductionPercent(Number(''))
            setReductionOtherProductPercent(Number(''))
            setShowSuggestions(false);

        } else {
            alert('Entrez un nombre valide')
        }
        setLastAction('addProduct');
       
    }
    

    listProducts.map((product) => product.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    const calcPercent = (price: number, reduction: number, reductionEuro: number, nbP: number, reductionOther: number):number => {
        const calc: number = price * reduction / 100
        const other: number = price * (reductionOther / 100 / nbP)
        const val: number = (price - calc - other - reductionEuro) * nbP
        return val
    }



    useFocusEffect(
        useCallback(() => {
            fetchData();
            // Optional cleanup function
            return () => {
                // Clean up logic if necessary
            };
        }, [deleteProduct])
    );


    
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
                <Pressable onPress={() => updateProduct(item, item.id)}>
                    <EvilIcons name="pencil" size={33} color="#DDEB73" />
                </Pressable>
                <Pressable onPress={() => deleteProduct(item.id)}>
                    <MaterialIcons name="delete-forever" size={30} color="#EABAB7" />
                </Pressable>
                <Pressable onPress={() => addHistory(item, item.id)}>
                    <AntDesign name="checksquare" size={28} color="#9EEB51" />
                </Pressable>
            </View>
            { modalVisible === true ?
        <Modal>
            <View style={styles.modal}>
                <Text style={styles.textModal}>Cette action supprimera le ticket de caisse.</Text>
                <Text style={styles.textModal}>Voulez vous continuer ?</Text>
                <CustomButton 
                addStyle={[styles.redBtn, styles.greenBtn]}
                action={() => [addHistory(item, item.id), setModalVisible(false), deleteProduct(item.id) ]}
                text="OUI"
                disabled= {false}
                />
                <CustomButton 
                addStyle={styles.redBtn}
                action={() => [setModalVisible(false), addProduct]}
                text="NON"
                disabled= {false}
                />
            </View>
        </Modal>
        : null }
        </View>
    );

    const renderProductTerms = ({ item }: { item: string }) => (
        <Pressable onPress={() => {
        setProductEnter(item);
        setShowSuggestions(false)}
        }>
            <Text style={styles.suggestionText}>{item}</Text>
        </Pressable>
    );

    return (
    <View style={styles.listContainer}>
         {productEnter !== '' && showSuggestions && filteredTerms.length > 0 && (
            <View style={styles.suggestionsContainer}>
                <FlatList
                    data={filteredTerms}
                    renderItem={renderProductTerms}
                    keyExtractor={item => item}
                />
            </View>
        )}
        <View style={styles.containerInputs}>
        <CustomInput 
        style= {[[styles.inputName, styles.input]]}
        value = {productEnter}
        onChangeText={text => {
            setProductEnter(text);
            setShowSuggestions(true);
        }}  
        textContentType='name'
        placeholder='Article'
        autoFocus= {false}
        />
        <View>
        
        </View>
        <CustomInput 
        style= {[[styles.inputPrice, styles.input]]}
        value = {priceEnter}
        defaultValue='0'
        onChangeText={setPriceEnter}  
        textContentType='price'
        placeholder='Prix'
        keyboardType='numeric'
        autoFocus={false}
        />
        
        <CustomInput 
        style= {[[styles.inputPrice, styles.input]]}
        value = {numberProduct} 
        defaultValue= '1'
        onChangeText={setNumberProduct}  
        textContentType='price'
        placeholder='Nb'
        keyboardType='numeric'
        autoFocus= {false}
        />
        </View>
        <View style={styles.containerReductionInput}>
            <View style={{flexDirection: 'column'}}>
            <Text style= {{marginLeft: 15}}>Reduction €</Text>
            <CustomInput 
            style= {[[styles.inputPrice, styles.input, styles.inputReduction]]}
            value = {reductionEuros}
            defaultValue='0'
            onChangeText={setReductionEuros}  
            textContentType='price'
            placeholder='Réduction (€)'
            keyboardType='numeric'
            autoFocus= {false}
            />
            </View>
            <View style={{flexDirection: 'column'}}>
            <Text style= {{marginLeft: 15}}>Reduction %</Text>
                <CustomInput 
                style= {[[styles.inputPrice, styles.input, styles.inputReduction]]}
                value = {reductionPercent}
                defaultValue='0'
                onChangeText={setReductionPercent}  
                textContentType='price'
                placeholder='Réduction (%)'
                keyboardType='numeric'
                autoFocus= {false}
                />
            </View>
            <View style={{flexDirection: 'column'}}>
                <Text style= {{marginLeft: 15}}>2éme produit %</Text>
                <CustomInput 
                style= {[[styles.inputPrice, styles.input, styles.inputReduction]]}
                value = {reductionOtherProductPercent}
                defaultValue='0'
                onChangeText={setReductionOtherProductPercent}  
                textContentType='price'
                placeholder='2ème produit (%)'
                keyboardType='numeric'
                autoFocus= {false}
                />
            </View>
        </View>
        <CustomButton 
        text='Ajouter'
        action={addProduct}
        disabled={productEnter === ''}
        />
         
        <FlatList
                data={listProducts}
                renderItem={renderProduct}
                keyExtractor={item => item.id.toString()}
        />
    </View>
    )
}


export default List

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
    suggestionsContainer: {
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        top: 55,
        left: 0,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 8,
    },
    suggestionText: {
        backgroundColor: '#fff',
        padding: 8,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
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
