import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable} from 'react-native';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { BtnDisabled } from '../colors';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import supabase from '../supabase.init'


interface ListProducts {
    id: number;
    name: string;
    price: number;
    nb: number
}

interface Product {
    id: number;
    name: string;
    price: number;
    nb: number
}

const List = () => {
    const [productEnter, setProductEnter] = useState<string>("")
    const [priceEnter, setPriceEnter] = useState<number>()
    const [numberProduct, setNumberProduct] = useState<number>(1)
    const [listProducts, setListProducts] = useState<ListProducts[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
//    const [historyList, setHistoryList] = useState<Product | ListProducts[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async() => {
        const {data, error} = await supabase
        .from('shopping_List')
        .select('*')

        console.log('data : ', data);
        setListProducts(data)
    }

    // Remove product and fetch name and price
    const updateProduct = async (product: Product, productId: number) => {
        setProductEnter(product.name)
        console.log(product.price);
        
        setPriceEnter(product.price)
        const { error } = await supabase
            .from('shopping_List')
            .delete()
            .eq('id', productId)

        if (error) {
            console.log(error.message);
            
        }
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
      };

    const deleteProduct = (productId: number) => {
        setListProducts(prevListProducts => prevListProducts.filter(product => product.id !== productId));
      };

    const addHistory = async (product: Product, productId: number) => {
      //  setHistoryList(product);
      console.log("------------------",product);
      
      const { productToHistory, errorProductToHistory }: {productToHistory: Product} = await supabase
      .from('history_list')
      .insert([
        {
          id: productId,
          name: product.name,
          price: product.price,
          nb: product.nb
        }
      ])
      .select();
      if (errorProductToHistory) {
        console.log(errorProductToHistory.message)
      }
        deleteProduct(productId)        
    }

    useEffect(() => {
        if (listProducts.length > 0){
            if (totalPrice !== undefined) {
                setTotalPrice(listProducts.map((product) => product.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0))

            } 
        }
    }, [listProducts])

    const addProduct = async () => {
        if (numberProduct === 0 || numberProduct === null || numberProduct === undefined) {
            
        }
        const product: Product =
            {
                'id': Date.now(),
                'name': productEnter.trim(),
                'price': Number(priceEnter),
                'nb': Number(numberProduct)
            }

        const {addProductToSupabase, errorToAddProduct} = await supabase
        .from('shopping_List')
        .insert([
          {
            id: product.id,
            name: product.name,
            price: product.price,
            nb: product.nb
          }
        ])
        .select();

        if (errorToAddProduct) {
          console.log(errorToAddProduct.message)
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
        } else {
            alert('Entrez un nombre valide')
        }
    }
    listProducts.map((product) => product.price).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    console.log('product : ', listProducts);
    
    return (
    <View style={styles.listContainer}>
        <View style={styles.containerInputs}>
        <CustomInput 
        style= {[[styles.inputName, styles.input]]}
        value = {productEnter}
        onChangeText={setProductEnter}  
        textContentType='name'
        placeholder='Article'
        autoFocus= {true}
        />
        <CustomInput 
        style= {[[styles.inputPrice, styles.input]]}
        value = {priceEnter}
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
        <CustomButton 
        text='Ajouter'
        action={addProduct}
        disabled={priceEnter === undefined || productEnter === ''}
        />

        {listProducts.map((product) => (
          <View style={styles.cardProduct} key={product.id}>
            <View style={styles.containerProduct}>
              <View style={styles.containerNameModify}>
                <Pressable onPress={() => updateProduct(product, product.id)}>
                  <EvilIcons name="pencil" size={24} color="black" />
                </Pressable>
                <Text>{product.nb}</Text>
                <Text>{product.name}</Text>
              </View>
              <Text>{product.price} €</Text>
            </View>
            <View style={styles.containerBtns}>
            <Pressable onPress={() => deleteProduct(product.id)}>
            <MaterialIcons name="delete-forever" size={24} color="black" />
                </Pressable>
                <Pressable onPress={() => addHistory(product, product.id)}>
                <AntDesign name="checksquare" size={24} color="black" />
                </Pressable>
            </View>
          </View>
        ))}
        
        <Text>A faire:</Text>
        <Text>- btns modif, delete</Text>
        <Text>- Supabase</Text>
        <View>
             { totalPrice !== 0 ?
            <Text>Total: {totalPrice.toFixed(2)} €</Text>
            : null}
        </View>
    </View>
    )
}

export default List

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
