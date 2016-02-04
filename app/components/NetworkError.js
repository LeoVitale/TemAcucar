import React, {
  Component,
  StyleSheet,
  Text,
} from 'react-native'
import Libraries, { LinkingIOS } from 'react-native'

import StyleSheets from "../styles/StyleSheets"
import SimplePage from "./SimplePage"
import Button from "./Button"

export default class ExpiredVersion extends Component {
  render() {
    const { onTryAgain } = this.props
    return (
      <SimplePage headline="Oops! Ocorreu um erro ao acessar nosso servidor.">
        <Text style={[StyleSheets.label, StyleSheets.bigMarginBottom]}>
          Por favor, verifique sua conexão ou tente novamente em alguns minutos.
        </Text>
        <Button onPress={onTryAgain}>
          Tentar novamente
        </Button>
      </SimplePage>
    )
  }
}
