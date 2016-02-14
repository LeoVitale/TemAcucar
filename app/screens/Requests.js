import React, {
  Component,
  Text,
  View,
  MapView,
} from 'react-native'
import Slider from 'react-native-slider'

import Colors from "../Colors"
import Button from "../components/Button"

export default class Requests extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      delta: 0.02,
    }
  }

  handleSlide(value) {
    this.setState({delta: -(value / 1000)})
  }

  renderMap() {
    const { latitude, longitude } = this.props.currentUser
    const { delta } = this.state

    return (
      <MapView
        scrollEnabled={false}
        zoomEnabled={false}
        style={{
          height: 200,
          alignSelf: 'stretch',
        }}
        region={{
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude),
          latitudeDelta: parseFloat(delta),
          longitudeDelta: parseFloat(delta),
        }}
        annotations={[{
          latitude: latitude,
          longitude: longitude,
          image: require('../img/icon.png'),
        }]}
      />
    )
  }

  //      { latitude && longitude && this.renderMap() }
  render() {
    const { latitude, longitude } = this.props.currentUser
    const delta = this.state.delta * 1000
    return (
      <View>
        <Slider
          disabled={false}
          minimumValue={-50}
          maximumValue={-1}
          step={1}
          value={-delta}
          onValueChange={this.handleSlide.bind(this)}
          style={{marginHorizontal: 40}}
          minimumTrackTintColor={Colors.pink}
          trackStyle={{
            height: 2,
            backgroundColor: Colors.gray,
          }}
          thumbStyle={{
            width: 10,
            height: 10,
            backgroundColor: Colors.pink,
            borderRadius: 10 / 2,
            shadowColor: Colors.pink,
            shadowOffset: {width: 0, height: 0},
            shadowRadius: 2,
            shadowOpacity: 1,
          }}
        />
      </View>
    )
  }
}