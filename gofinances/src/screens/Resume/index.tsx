import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HistoryCard } from '../../components/HistoryCard'

import { 
    Container,
    Header,
    Title,
    Content
} from './styles'
import { categories } from '../../utils/categories'

interface TransactionData{
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: string;
    color: string;
}

export function Resume(){
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    async function loadData(){
        const dataKey = '@gofinances:transactions'
 
        const response = await AsyncStorage.getItem(dataKey)
        const responseFormatted = response ? JSON.parse(response) : []

        // filtrando para saber se o type é negativo
        const expensives = responseFormatted
            .filter((expensive: TransactionData) => expensive.type === 'negative')

        const totalByCategory: CategoryData[] = []

        // percorre cada categoria
        categories.forEach(category => {
            let categorySum = 0;
            // percorre para cada categoria a coleção de expensives
            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount)
                }
            });

            // se o total for maior que zero adciona no vetor, isso aqui evitará
            // mostrar categoria vazia
            if(categorySum > 0){
                const total = categorySum
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'brl'
                    })

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total
                })    
            }
        })

        // console.log(totalByCategory)
        setTotalByCategories(totalByCategory)
    }

    useEffect(() => {
        loadData()
    }, [])

    return(
        <Container>
            <Header>
                <Title>
                    Resumo por Categoria
                </Title>
            </Header>

            <Content>
                {
                    totalByCategories.map(item => (
                        <HistoryCard
                            key={item.key}
                            title={item.name}
                            amount={item.total}
                            color={item.color}
                        />
                    ))
                }
            </Content>

        </Container>
    )
}