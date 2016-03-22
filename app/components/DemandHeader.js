import React, { View, Text, Image } from 'react-native'
import moment from 'moment'
import Colors from "../Colors"

moment.locale('pt-br', {
  relativeTime : {
    future: "Em %s",
    past:   "Há %s",
    s:  "segundos",
    m:  "um minuto",
    mm: "%d minutos",
    h:  "an hora",
    hh: "%d horas",
    d:  "um dia",
    dd: "%d dias",
    M:  "um mês",
    MM: "%d meses",
    y:  "um ano",
    yy: "%d anos",
  }
})

export default DemandHeader = ({ demand: { user, name, distance, created_at }}) => (
  <View style={{
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Image source={{uri: user.image_url}} style={{
      width: 36,
      height: 36,
      borderRadius: 18,
      marginBottom: 6,
    }} />
    <Text style={{
      textAlign: 'center',
      color: Colors.brown,
      fontSize: 10,
      fontFamily: 'OpenSans-Bold',
    }}>
      {user.first_name} precisa de um(a)
    </Text>
    <Text style={{
      textAlign: 'center',
      color: Colors.pink,
      fontSize: 12,
      fontFamily: 'OpenSans-Bold',
    }}>
      { name.toUpperCase() }
    </Text>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
    }}>
      <Icon name="access-time" style={{ 
        color: Colors.ice,
        marginRight: 4,
        marginTop: 2,
        fontSize: 14,
      }} />
      <Text style={{
        color: Colors.brown,
        fontSize: 10,
        fontFamily: 'OpenSans',
      }}>
        { moment(created_at).fromNow() }
      </Text>
      <Icon name="place" style={{ 
        color: Colors.ice,
        marginLeft: 10,
        marginRight: 2,
        marginTop: 2,
        fontSize: 14,
      }} />
      <Text style={{
        color: Colors.brown,
        fontSize: 10,
        fontFamily: 'OpenSans',
      }}>
        A { distance > 1 ? `${Math.round(distance)}km` : `${Math.round(distance * 1000)}m` }
      </Text>
    </View>
  </View>
)
