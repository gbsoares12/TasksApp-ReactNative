import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native';
import commonStyles from '../commonStyles';
import backgroundImagem from '../../assets/imgs/login.jpg';
import AuthInput from '../components/AuthInput';
import axios from 'axios';
import {
    server,
    showError
} from '../common/common';


export default class Auth extends Component {
    state = {
        stageNew: false,//true está na tela de cadastro, false está na tela de login.
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    signin = async () => {
        try {
            const resp = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })

            axios.defaults.headers.common['Authorization'] = `bearer ${resp.data.token}`//recebe o token gerado pelo backend e adiciona no header das proximas req

            AsyncStorage.setItem('userData', JSON.stringify(resp.data))

            this.props.navigation.navigate('Home', resp.data)//Redireciona a tela até logar e passa as informações do usuário pelo segundo parametro acessando o data.
        } catch (err) {
            Alert.alert('Erro', 'Falha no Login!')
            //showError(err)
        }
    }

    signup = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword
            })
            Alert.alert('Sucesso!', 'Usuário cadastrado!')
            this.setState({ stageNew: false })
        } catch (err) {
            showError(err)
        }
    }

    signinOrSignup = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    render() {
        const validations = []

        validations.push(this.state.email.trim() && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim())
            validations.push(this.state.confirmPassword)
            validations.push(this.state.confirmPassword === this.state.password)
        }
        // All é um acumulo das validações e o v é cada uma das validações
        const validForm = validations.reduce((all, v) => all && v)//Se uma validação estiver false, a expressão vai dar false.

        return (
            <ImageBackground source={backgroundImagem} style={styles.background}>
                <Text style={styles.title}>YesList</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder='Nome'
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })} />}
                    <AuthInput icon='at' placeholder='E-mail'
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })} />
                    <AuthInput icon='lock' secureTextEntry={true} placeholder='Senha'
                        style={styles.input}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })} />
                    {this.state.stageNew &&
                        <AuthInput icon='asterisk' secureTextEntry={true} placeholder='Confirmação'
                            style={styles.input}
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} />}
                    <TouchableOpacity disabled={!validForm} onPress={this.signinOrSignup}>
                        <View style={[styles.button, !validForm ? { backgroundColor: '#aaa' } : {}]}>
                            <Text style={styles.buttonText}>
                                {this.state.stageNew ? 'Registrar' : 'Entrar'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}>
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta?' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 21,
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 1,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#fff'
    },
    button: {
        marginTop: 10,
        backgroundColor: '#080',
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
    }

})