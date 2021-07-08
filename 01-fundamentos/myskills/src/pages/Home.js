import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native'
import { Button } from '../components/Button'
import { SkillCard } from '../components/SkillCard'

export function Home() {
  // estado para armazenar nova Skill
  const [newSkill, setNewSill] = useState('')
  // estado para armazenar todas as Skills
  const [mySkills, setMySkills] = useState([])

  function handleAddSkill(){
    setMySkills(oldState => [...oldState, newSkill])
  }

  return(
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome, Lúcio
        </Text>

        <TextInput
          style={styles.input}
          placeholder="New skill"
          placeholderTextColor="#555"
          onChangeText={setNewSill}
        />

        <Button/>

        <Text style={[styles.title, {marginVertical: 50}]}>
          My Skills
        </Text>

        {
          mySkills.map(skill =>(
            <SkillCard />
          ))
        }

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
  }
})