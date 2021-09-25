import React, { useState } from "react";
import { 
    Keyboard,
    Modal,
    TouchableWithoutFeedback,
    Alert
} from 'react-native'
import * as Yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import {useForm} from 'react-hook-form'
import {useNavigation} from '@react-navigation/native'

import { InputForm } from '../../components/Forms/InputForm'
import { Button } from '../../components/Forms/Button'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'

import {CategorySelect} from '../CategorySelect'

import { 
    Container,
    Title,
    Header,
    Form, 
    Fields,
    TransactionsTypes
} from "./styles";

interface formData {
    name: string;
    amount: string;
}

// tipando navigation
type NavigationProps = {
    navigate:(screen: string) => void
}

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome é obrigatório'),
    amount: Yup
        .number()
        .typeError('Informe um valor numérico')
        .positive('O valor não pode ser negativo')
})

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)

    const dataKey = '@gofinances:transactions'

    // Definindo objeto no useState
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const navigation = useNavigation<NavigationProps>()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors  }
    } = useForm({
        resolver: yupResolver(schema)
    })

    function handleTransactionsTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true)
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false)
    }

    async function handleRegister(form: formData){
        // validando estados com Alert
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação')

        // validando estados com Alert
        if(category.key === 'category')
            return Alert.alert('Selecione a categoria')
            
        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: new Date()
        }
        // console.log(newTransaction)

        try {
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []
            
            // garantindo que os dados não serão sobrescritos
            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            // no segundo parametro se esperado uma string, por isso é usado o
            //  JSON.stringfy no meu vetor data
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            // resetando formulário
            reset()

            // "resetando" estados
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria'
            })

            navigation.navigate('Listagem')

        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível salvar")
        }
    }

    

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message }
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton 
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionsTypeSelect('up')}    
                                isActive={transactionType === 'up'}
                            />
                            <TransactionTypeButton 
                                type="down"
                                title="Outcome"   
                                onPress={() => handleTransactionsTypeSelect('down')}    
                                isActive={transactionType === 'down'}
                            />
                        </TransactionsTypes>
                    
                        <CategorySelectButton 
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button 
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
           </Container>
        </TouchableWithoutFeedback>
    )
}