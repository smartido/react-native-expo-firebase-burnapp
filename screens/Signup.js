import React from 'react';
import {View, KeyboardAvoidingView, TextInput, StyleSheet, TouchableOpacity, Text, Switch, Alert} from 'react-native';
import {Card} from 'react-native-elements';
import Colors from '../API/Colors';
import {Ionicons} from '@expo/vector-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateName, updateEmail, updatePassword, updateCompany, updateAdmin, updatePermission, updateEntries, signup} from '../redux/ActionCreators';
import Firebase from '../Firebase.js';

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateName, updateEmail, updatePassword, updateCompany, updateAdmin, updatePermission, updateEntries, signup}, dispatch)
}

const mapStateToProps = state => {
    return {
        user: state.users
    }
}

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          showCompany: false,
          hidePassword: true,
          switchValue: false
        };
    }

    handleSignUp() {
        this.props.updateAdmin(this.state.switchValue ? true : false);
        this.props.updatePermission(this.state.switchValue ? true : false);
        this.props.updateEntries([]);
        this.props.signup();

        if(this.state.switchValue) {
            this.props.navigation.navigate('Login');
        } else {
            Alert.alert(
                'Felicitats!',
                "Espera a que l'administrador de la teva empresa accepti la teva sol·licitud",
                [
                    {text: 'OK', onPress: () => this.handleSignout(), style: 'cancel'}
                ],
                {cancelable: false},
            );
        }
    }

    handleSignout() {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    managePasswordVisibility() {
        this.setState({hidePassword: !this.state.hidePassword});
    }

    toggleSwitch = value => {
        this.setState({switchValue: value});
    };

    renderSignupForm() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <TouchableOpacity style={styles.logoHeader} onPress={() => this.props.navigation.navigate('Login')}>
                    <Ionicons
                        name='ios-arrow-round-back'
                        size={35}
                        style={{ marginLeft: 10 }}
                        color={Colors.white}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Registra't gratis!</Text>
                <Text style={styles.subtitle}>Registra el teu estrès a la feina amb BurnApp</Text>
                <Card containerStyle={styles.card}>
                    <TextInput
                        style={styles.inputBox}
                        value={this.props.user.username}
                        onChangeText={username => this.props.updateName(username)}
                        placeholder='Nom complert'
                    />
                    <Text style={styles.inputDivider}></Text>
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
                <TouchableOpacity style={styles.button} onPress={() => {this.props.user.username != undefined && this.props.user.email != undefined && this.props.user.password != undefined ? this.setState({showCompany: true}) : alert("Tots els camps són obligatoris")}}>
                    <Text style={styles.buttonText}>Començar a utilizar BurnApp</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }

    renderCompanyForm() {
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <TouchableOpacity style={styles.logoHeader} onPress={() => this.setState({showCompany: false})}>
                    <Ionicons
                        name='ios-arrow-round-back'
                        size={35}
                        style={{ marginLeft: 10 }}
                        color={Colors.white}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Detalls de l'empresa</Text>
                <Text style={styles.subtitle}>Per començar a utilitzar BurnApp necessitem alguns detalls de la teva empresa</Text>
                <Card containerStyle={styles.card}>
                    <TextInput
                        style={styles.inputBox}
                        value={this.props.user.companyName}
                        onChangeText={companyName => this.props.updateCompany(companyName)}
                        placeholder="Nom de l'empresa"
                    />
                    <Text style={styles.inputDivider}></Text>
                    <View style={styles.switch}>
                        <Text style={styles.inputPassword}>N'ets l'administrador/a?</Text>
                        <Switch
                            style={{ transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }] }}
                            onValueChange={this.toggleSwitch}
                            value={this.state.switchValue}
                            trackColor={{true: '#000', false: Colors.lightGray}}
                            thumbColor={Colors.lightGray}
                        />
                    </View>
                </Card>
                <TouchableOpacity style={styles.button} onPress={() => {this.props.user.companyName != undefined ? this.handleSignUp() : alert("Tots els camps són obligatoris")}}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }

    render() {
        return !this.state.showCompany ? this.renderSignupForm() : this.renderCompanyForm()
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
        backgroundColor: '#e6ac00',
        borderRadius: 8,
        width: '85%'
    },
    buttonText: {
        fontSize: 16,
        color: Colors.white
    },
    switch: {
        padding: 5,
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        width: '100%',
    },
})

export default connect(mapStateToProps,mapDispatchToProps)(Signup)