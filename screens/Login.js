import React from 'react';
import {View, KeyboardAvoidingView, TextInput, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import {Card} from 'react-native-elements';
import Colors from '../API/Colors';
import {Ionicons} from '@expo/vector-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateEmail, updatePassword, login} from '../redux/ActionCreators';
import Firebase, {db} from '../Firebase.js';

export const mapDispatchToProps = dispatch => {
    return bindActionCreators({ updateEmail, updatePassword, login}, dispatch)
}

export const mapStateToProps = state => {
    return {
        user: state.users
    }
}
  
class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hidePassword: true,
            sendPassword: false
        }
    }

    componentDidMount() {
        Firebase.auth().onAuthStateChanged(user => {
            if (user){
                this.props.navigation.navigate('Main');
            }
        });
    }

    sendPassword() {
        Firebase.auth().sendPasswordResetEmail(this.props.user.email)
            .then(function() {
                alert("Correu electrònic enviat");
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorCode + ": " + errorMessage);
        });
    }

    managePasswordVisibility() {
        this.setState({hidePassword: !this.state.hidePassword});
    }

    checkPermission(userEmail) {
        // Check if user has permission
        db.collection('users').where('email', '==', userEmail).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    if(doc.data().hasPermission) {   
                        return this.props.login();     
                    } else {
                        alert('Sembla que no tens permisos per accedir');
                    }
                });
            });
    } 

    renderLoginForm(){
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}> 
                <View style={styles.logoHeader}>
                    <Ionicons name='ios-flame' size={35} color={Colors.white} style={{ margin: 20 }}/>
                    <Text style={styles.logoText}>BurnApp</Text>
                </View>
                <Text style={styles.title}>Iniciar sessió</Text>
                <Text style={styles.subtitle}>Benvingut/uda de nou</Text>
                <Card containerStyle={styles.card}>
                    <TextInput
                        style={styles.inputBox}
                        value={this.props.user.email}
                        onChangeText={email => this.props.updateEmail(email)}
                        placeholder='Correu electrònic'
                        autoCapitalize='none'
                    />
                    <Text style={styles.inputDivider}></Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.inputIcon}
                            value={this.props.user.password}
                            onChangeText={password => this.props.updatePassword(password)}
                            placeholder='Contrasenya'
                            secureTextEntry={this.state.hidePassword}
                        />
                        <TouchableOpacity onPress={() => this.managePasswordVisibility()}>
                            <Ionicons 
                                name={this.state.hidePassword ? "ios-eye" : "ios-eye-off"} 
                                size={25} 
                                color={Colors.darkGray}
                            />
                        </TouchableOpacity>
                    </View>
                </Card>
                <TouchableOpacity style={styles.button} onPress={() => this.checkPermission(this.props.user.email)}>
                    <Text style={styles.buttonText}>Accedir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSignup} onPress={() => this.props.navigation.navigate('Signup')}>
                    <Text style={styles.buttonSignupText}>Registra't 100% gratis!</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendPasswordContainer} onPress={() => this.setState({sendPassword: true})}>
                    <Text style={styles.sendPassword}>Has oblidat la contrasenya?</Text>
                    <Ionicons 
                        name='ios-arrow-round-forward'
                        size={25} 
                        color={Colors.white}
                    />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }

    renderPasswordForm(){
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <TouchableOpacity style={styles.logoHeader} onPress={() => this.setState({sendPassword: false})}>
                    <Ionicons
                        name='ios-arrow-round-back'
                        size={35}
                        style={{ marginLeft: 20 }}
                        color={Colors.white}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Restablir la contrasenya</Text>
                <Text style={styles.subtitle}>T'enviarem un correu per reestablir la teva contrasenya</Text>
                <Card containerStyle={styles.card}>
                    <TextInput
                        style={styles.inputBox}
                        value={this.props.user.email}
                        onChangeText={email => this.props.updateEmail(email)}
                        placeholder='Correu electrònic'
                        autoCapitalize='none'
                    />
                </Card>
                <TouchableOpacity style={styles.button} onPress={() => this.sendPassword(this.props.user.email)}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }

    render() {
        return !this.state.sendPassword ? this.renderLoginForm() : this.renderPasswordForm()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.yellow
    },
    logoHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        top: 0,
        left: 0,
        position: 'absolute',
        marginTop: 30,
    },
    logoText: {
        color: Colors.white,
        fontSize: 22,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 16,
        margin: 10,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: Colors.white,
        fontWeight: 'bold',
    },  
    subtitle: {
        fontSize: 22,
        margin: 10,
        marginBottom: 30,
        letterSpacing: 1.5,
        color: Colors.white,
        textAlign: 'center'
    },
    card: {
        borderWidth: 0,
        borderRadius: 8,
        width: '85%',
        elevation: 5
    },
    inputDivider: {
        backgroundColor: Colors.lightGray,
        width: '100%',
        height: 1
    },
    inputBox: {
        fontSize: 16,
        color: Colors.darkGray, 
        padding: 5
    },
    passwordContainer: { 
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    inputIcon: {
        fontSize: 16,
        color: Colors.darkGray,
        width: '90%'
    },
    button: {
        marginTop: 30,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: Colors.darkYellow1,
        borderRadius: 8,
        width: '85%'
    },
    buttonText: {
        fontSize: 16,
        color: Colors.white
    },
    buttonSignup: {
        marginTop: 10,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: Colors.darkYellow2,
        borderRadius: 8,
        width: '85%'
    },
    buttonSignupText: {
        fontSize: 16,
        color: Colors.white
    },
    sendPasswordContainer: {
        bottom: 0,
        position: 'absolute',
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sendPassword: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: 'bold',
        marginRight: 10
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
