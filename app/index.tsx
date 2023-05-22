import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import blurBg from '../src/assets/blur.png'
import Stripes from '../src/assets/stripes.svg'
import Logo from '../src/assets/logo.svg'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { styled } from 'nativewind'
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session'
import { useEffect } from 'react'
import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/5fe146b2fb09c979c695',
}

const StyleStripes = styled(Stripes)

export default function App() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '5fe146b2fb09c979c695',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  // useEffect(() => {
  //   console.log(
  //     makeRedirectUri({
  //       scheme: 'spacetime',
  //     }),
  //   )
  // }, [response])

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      api
        .post('/register', {
          code,
        })
        .then((response) => {
          const { token } = response.data

          SecureStore.setItemAsync('token', token)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [response])

  if (!hasLoadedFonts) {
    return null
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex flex-1 bg-gray-900 px-8"
      imageStyle={{ position: 'absolute', left: '-100%' }}
      style={{
        backgroundColor: '#000',
      }}
    >
      <StyleStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <Logo />

        <View className="space-y-2">
          <Text
            className="text-center font-title text-2xl leading-tight text-gray-50"
            style={{ color: 'red' }}
          >
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => promptAsync()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  )
}
