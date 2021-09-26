import React from "react";
import { categories } from "../../utils/categories";

import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date
} from './styles'

export interface TransactionCardProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface Props {
    data: TransactionCardProps;
}

export function TransactionCard({ data }: Props){
    // pega a 1 posição e nomeia de category
    const [ category ] = categories.filter(
        // retorna uma unica categoria em função da chave associada
        item => item.key === data.category
    )

    return(
        <Container>
            <Title>
                {data.name}
            </Title>

            <Amount type={data.type}>
                {/* se for negativo acrescenta o sinal de menos */}
                { data.type === 'negative' && '- ' }
                { data.amount }
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon}/>
                    <CategoryName>
                        {category.name}
                    </CategoryName>
                </Category>

                <Date>
                    {data.date}
                </Date>
            </Footer>
        </Container>
    )
}