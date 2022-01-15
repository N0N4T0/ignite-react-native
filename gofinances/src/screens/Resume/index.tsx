import React, {useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components'

import { HistoryCard } from '../../components/HistoryCard'

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MontSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles'
import { categories } from '../../utils/categories'
import { ActivityIndicator } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

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
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    // Estado para carregamento da informação
    const[isLoading, setIsLoading] = useState(false)
    //Estado para armazenar a data selecionada 
    const [selectedDate, setSelectedDate] = useState(new Date())  
    // Estado para armazenar o total por catarias/
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    const theme = useTheme()

    // Função para lidar com alteração da data
    function handleDateChange(action: 'next' | 'prev'){
        // Biblioteca date-fns para lidar com datas

        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate, 1))
        } else {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    async function loadData(){
        setIsLoading(true)

        const dataKey = '@gofinances:transactions'
 
        const response = await AsyncStorage.getItem(dataKey)
        const responseFormatted = response ? JSON.parse(response) : []

        // filtrando para saber se o type é negativo e se o ano é o mesmo e a data
        const expensives = responseFormatted
            .filter((expensive: TransactionData) => 
                expensive.type === 'negative' && 
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            )
        // console.log(expensives)

        // reduce = pega uma coleção e soma
        const expensivesTotal = expensives
            .reduce((acumullator: number, expensive: TransactionData) =>{
                return acumullator + Number(expensive.amount)
        }, 0)

        // console.log(expensivesTotal)

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
                const totalFormatted = categorySum
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'brl'
                    })

                    const percent = `${(categorySum/expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                })    
            }
        })

        // console.log(totalByCategory)
        setTotalByCategories(totalByCategory)
        setIsLoading(false)
    }

    // toda ve que minha data selecionada mudar eu disparo o loadData()
    // useEffect(() => {
    //     loadData()
    // }, [])

    useFocusEffect(useCallback(() => {
        loadData()
      }, [selectedDate]))

    return(
        <Container>
                <Header>
                    <Title>
                        Resumo por Categoria
                    </Title>
                </Header>
            {
                isLoading ? 
                <LoadContainer>
                <ActivityIndicator 
                    color={theme.colors.primary} 
                    size="large"
                />
                </LoadContainer> : 
                
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle= {{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
                >

                    <MonthSelect>
                        <MontSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left"/>
                        </MontSelectButton>

                        <Month>
                            {format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                        </Month>

                        <MontSelectButton onPress={() => handleDateChange('next')}>
                        <MonthSelectIcon name="chevron-right"/>
                        </MontSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: { 
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={50}
                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    
                    {
                        totalByCategories.map(item => (
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            }
        </Container>
    )
}