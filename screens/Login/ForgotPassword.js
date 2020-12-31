import React, { Component, Fragment } from 'react'
import { Text, SafeAreaView, View, TextInput, Dimensions, StyleSheet } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import firebase from 'react-native-firebase'

import Button from '../../components/Button'

// import FormInput from '../../components/FormInput'
// import FormButton from '../../components/FormButton'
import ErrorMessage from '../../components/ErrorMessage'
//import { withFirebaseHOC } from '../../config/Firebase'

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label('Email')
        .email('Enter a valid email')
        .required('Please enter a registered email')
})

class ForgotPassword extends Component {

    handlePasswordReset = async (values, actions) => {
        const { email } = values

        let em = ''
        em = email
        em = em.trim()

        try {
            await firebase.auth().sendPasswordResetEmail(em)
            alert('Un email pour réinitialiser votre mot de passe a été envoyé avec succés.')
            this.props.navigation.navigate('Login')
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/user-not-found') {
                actions.setFieldError('general', 'Utilisateur introuvable !')
            } 
            else if (errorCode == 'auth/invalid-email') {
                actions.setFieldError('general', 'Adresse email invalide !')
            } 
            
            else {
                actions.setFieldError('general', 'Erreur, veuillez vérifier votre réseau internet')
            }

            console.log(error);
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.text}>Mot de passe oublié?</Text>
                <Formik
                    initialValues={{ email: '' }}
                    onSubmit={(values, actions) => {
                        this.handlePasswordReset(values, actions)
                    }}
                validationSchema={validationSchema}
                >
                    {({
                        handleChange,
                        values,
                        handleSubmit,
                        errors,
                        isValid,
                        touched,
                        handleBlur,
                        isSubmitting
                    }) => (
                            <View>
                                <TextInput
                                    name='email'
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    placeholder='Veuillez saisir votre adresse email'
                                    autoCapitalize='none'
                                    style={styles.textInput}
                                // iconName='ios-mail'
                                // iconColor='#2C384A'
                                //onBlur={handleBlur('email')}
                                />

                                {/* <ErrorMessage errorValue={touched.email && errors.email} /> */}
                                <View style={styles.buttonContainer}>
                                    <Button
                                        text='Envoyer un email'
                                        buttonType='outline'
                                        onPress={handleSubmit}
                                        disabled={!isValid || isSubmitting}
                                    />
                                </View>

                                <ErrorMessage errorValue={errors.general} />

                            </View>
                        )}
                </Formik>
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 150
    },
    text: {
        textAlign: 'center',
        marginBottom: SCREEN_HEIGHT * 0.05,
        color: '#333',
        fontSize: 24,
        marginLeft: 25
    },
    buttonContainer: {
        margin: 25
    },
    textInput: {
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 50,
        padding: 15,
        paddingLeft: SCREEN_WIDTH * 0.1,
        width: SCREEN_WIDTH * 0.8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 3,
    },
})

export default ForgotPassword
// export default withFirebaseHOC(ForgotPassword)