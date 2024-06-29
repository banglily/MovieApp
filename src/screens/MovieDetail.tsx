import React from 'react'
import { View, Text } from 'react-native'

const MovieDetail = ({ route }: any ) => {
  const { id } = route.params

  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        marginTop: '32',
      }}
    >
      <Text style={{ fontSize: 30 }}>Movie ID: {id}</Text>
    </View>
  )
}

export default MovieDetail