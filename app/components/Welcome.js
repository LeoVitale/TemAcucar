import React, {
  Component,
  StyleSheet,
  Image,
  Text,
  View,
} from 'react-native'

import StyleSheets from "../styles/StyleSheets"
import Button from "./Button"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export default class Welcome extends Component {
  handleSignIn() {
    this.props.navigator.push({
      title: 'Login',
      component: SignIn,
      passProps: {
        onSignIn: this.props.onSignIn,
        onFacebook: this.props.onFacebook,
      },
    })
  }

  handleSignUp() {
    this.props.navigator.push({
      title: 'Crie sua conta',
      component: SignUp,
    })
  }

  render() {
    return (
      <View style={StyleSheets.container}>
        <Image source={require('../img/logo.jpg')} />
        <Text style={[StyleSheets.headline, StyleSheets.bigMarginVertical]}>
          Compartilhe suas coisas com seus vizinhos
        </Text>
        <Button onPress={this.handleSignIn.bind(this)}>
          Já possuo cadastro
        </Button>
        <Text style={[StyleSheets.label, StyleSheets.margin]}>ou</Text>
        <Button onPress={this.handleSignUp.bind(this)}>
          Quero me cadastrar
        </Button>
      </View>
    )
  }
}
