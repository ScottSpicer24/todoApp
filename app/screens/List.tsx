import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from 'aws-amplify/auth';

const List = ({navigation} : any) => {
    //const navigation = useNavigation(); // use navigation hook? No
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('');
    const [err, setErr] = useState(false);


    async function currentAuthenticatedUser() {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log(`The signInDetails: ${signInDetails}`);
        return username
      } catch (err) {
        console.log(err);
      }
    }
    

    useEffect(() => {
      const username = currentAuthenticatedUser()
      fetch("https://lkeqmh3fs5.execute-api.us-east-1.amazonaws.com/dev/todos?username=" + username)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoading(false);
            console.log(result.body);
            setTodo(result.body);
            setErr(false);
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
        return <Text>Error in Fetch</Text>
      }

      if(todo === ""){
        return <Text>Blank todos Error</Text>
      }

      console.log(typeof todo);
      //let text = todo.text;
      //let compVal = todo.completed == '0' ? false : true ;
      //console.log(compVal);

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
          {getContent()}
          <TextInput style={styles.input} placeholder='Add new new doo doo' onChangeText={(text: string) => setTodo(text)} value={todo} />
          <Button onPress={saveDataAPI} title="Add TODO" disabled={todo === ''}/>
          {/*<Button onPress={() => navigation.navigate('Details')} title="Add TODO" disabled={todo === ''}/>*/}
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
    flexDirection : 'column',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom : 15,
    marginTop : 10,
    marginRight: 15,
    backgroundColor: '#fff',
  }
})

interface TodoItem {
  item: string;
  completed: number;
}


// {/*<TextInput style={styles.input} placeholder='Add new new doo doo' onChangeText={(text: string) => setTodo(text)} value={todo} /><Button onPress={() => navigation.navigate('Details')} title="Add TODO" disabled={todo === ''}/>*/}