import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, {useEffect, useState} from 'react'
import { signIn, confirmSignIn, type ConfirmSignInInput } from 'aws-amplify/auth'

const Login = ({navigation} : any) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword , setConfirmPassword] = useState(false);

    const login = async () => {
        try {
            const { isSignedIn, nextStep } = await signIn({ 
                username: username,
                password: password,
                // this is required to login using username and password and no SRP 
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });
            if(nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'){
                setConfirmPassword(true)
            }
            else if(isSignedIn === true){
                navigation.navigate('List')
            }
            console.log('isSignedIn', isSignedIn);
            console.log('nextStep', nextStep);
        } catch (error) {
            console.log('error signing in', error);
        }
    }

    const confirmNewPassword = async () => {
        console.log(password)
        const {
            isSignedIn,
            nextStep
          } = await confirmSignIn({challengeResponse: password});
        console.log('isSignedIn', isSignedIn);
        console.log('nextStep', nextStep);
        if(isSignedIn === true){
            navigation.navigate('List')
        }
    }


    ////////////////
    if(confirmPassword === false){
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text>Username</Text>
                    <TextInput placeholder='Username' onChangeText={(text: string) => setUsername(text)} value={username} />
                    <Text>Password</Text>
                    <TextInput secureTextEntry={true} placeholder='Password' onChangeText={(text: string) => setPassword(text)} value={password} />
                    <Button onPress={login} title="Login" />
                </View>
            </View>
        )
    }
    if(confirmPassword === true){
        return(
        <View style={styles.container}>
            <View style={styles.form}>
                <Text>Hello {username}!</Text>
                <Text>Password</Text>
                <TextInput secureTextEntry={true} placeholder='Password' onChangeText={(text: string) => setPassword(text)} value={password} />
                <Button onPress={confirmNewPassword} title="Comfirm" />
            </View>
        </View>
        )
    }

    
}

export default Login

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