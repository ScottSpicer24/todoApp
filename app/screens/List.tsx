import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native';

const List = ({navigation} : any) => {
    //const navigation = useNavigation(); // use navigation hook? No
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('');
    const [err, setErr] = useState(false);
    const username = 'Scott';
    

    useEffect(() => {
      fetch("https://lkeqmh3fs5.execute-api.us-east-1.amazonaws.com/dev/todos")
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoading(false);
            setTodos(result.body);
          }
        )
        .catch(
          (error) => {
            setIsLoading(false);
            setErr(true);
            console.log(error);
          }
        )
    }, []);

    const getContent = () => {
      if(isLoading){
        return <ActivityIndicator size = "large" />;
      }
      
      if(err){
        return <Text>Error</Text>
      }

      if(todo === ""){
        return <Text>Blank todos Error</Text>
      }
      
      let items = JSON.parse(todo);
      console.log(typeof items);




      return <Text>{todo}</Text>
      
    }

    const saveDataAPI = async () => {
      const url = "https://lkeqmh3fs5.execute-api.us-east-1.amazonaws.com/dev/todos";
      const data = {
        "username" : username,
        "todos" : {
          "text" : todo,
          "completed" : 0
        }
      }
      
      let response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      response = await response.json();
      console.log(response);
    }

    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder='Add new new doo doo' onChangeText={(text: string) => setTodo(text)} value={todo} />
          <Button onPress={saveDataAPI} title="Add TODO" disabled={todo === ''}/>
          {/*<Button onPress={() => navigation.navigate('Details')} title="Add TODO" disabled={todo === ''}/>*/}
          {/*getContent()*/}
        </View>
      </View>
    )

    
}

export default List

const styles = StyleSheet.create({
  container: {
    marginHorizontal : 20, 
  },
  form: {
    marginVertical: 20,
    flexDirection : 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 15,
    backgroundColor: '#fff',
  }
})

interface TodoItem {
  item: string;
  completed: number;
}


// {/*<TextInput style={styles.input} placeholder='Add new new doo doo' onChangeText={(text: string) => setTodo(text)} value={todo} /><Button onPress={() => navigation.navigate('Details')} title="Add TODO" disabled={todo === ''}/>*/}