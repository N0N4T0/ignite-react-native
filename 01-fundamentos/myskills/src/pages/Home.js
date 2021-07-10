import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  FlatList,
} from 'react-native'
import { Button } from '../components/Button'
import { SkillCard } from '../components/SkillCard'

export function Home() {
  // estado para armazenar nova Skill
  const [newSkill, setNewSkill] = useState('')
  // estado para armazenar todas as Skills
  const [mySkills, setMySkills] = useState([])
  // estado para exibir saudação
  const [greeting, setGreeting] = useState('')

  function handleAddSkill(){
    setMySkills(oldState => [...oldState, newSkill])
  }

  useEffect(() => {
    const currentHour = new Date().getHours()

    if(currentHour < 12){
      setGreeting('Good Morning!')
    }
    else if(currentHour >= 12 && currentHour < 18){
      setGreeting('Good Afternoon!')
    }
    else {
      setGreeting('Good Night!')
    }

  }, [])

  return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome, Lúcio
        </Text>

        <Text style={styles.greetings}>
          {greeting}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="New skill"
          placeholderTextColor="#555"
          onChangeText={setNewSkill}
        />

        <Button onPress={handleAddSkill}/>

        <Text style={[styles.title, {marginVertical: 50}]}>
          My Skills
        </Text>

        <FlatList 
          showsVerticalScrollIndicator={false}
          data={mySkills}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <SkillCard skill={item}/>
          )}
        />

      </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#121015',
    paddingVertical: 70,
    paddingHorizontal: 30
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#1f1e25',
    color: '#fff',
    fontSize: 18,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginTop: 30,
    borderRadius: 7
  },
  greetings: {
    color: '#FFF',
  }
})