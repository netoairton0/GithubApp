import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import * as React from "react";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

function CheckIcon({icon}) {
  if(icon == 'bio') {
    return(<MaterialIcons name="person-outline" size={22} color="black" />);
  }
  else if(icon == 'orgs') {
    return(<FontAwesome5 name="headset" size={20} color="black" />);
  }
  else if(icon == 'repos') {
    return(<MaterialCommunityIcons name="file-document-outline" size={22} color="black" />);
  }
  else {
    return(<FontAwesome name="users" size={20} color="black" />);
  }
}

function Button({style, title, subtitle, destination, inputText, navigation, icon}) { 
  return(
    <View style={style}>
      <View style={styles.icon_button}>
        <CheckIcon icon = {icon}></CheckIcon>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'flex-start', flex: 4}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.navigator_button}>
        <TouchableOpacity
          style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} 
          onPress={() => navigation.navigate(destination , {inputText})}>
            <MaterialIcons name="keyboard-arrow-right" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BioScreen({ navigation, route}){ 

  const { bio } = route.params;

  return(
    <SafeAreaView>
      <View style={styles.secundary_screen}>
        <Text>Bio:</Text>
        <Text>{bio}</Text>
      </View>
    </SafeAreaView>
  );
}

function OrgsScreen({ navigation, route}){

  const { inputText } = route.params;
  const [orgs, setOrgs] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.github.com/users/" + {inputText} + "/orgs")
      .then((response) => response.json())
      .then((data) => {
        setOrgs(data);
      })
  }, [{inputText}]);

  return(
    <SafeAreaView>
      <View style={styles.secundary_screen}>
        <Text>Lista de organizações:</Text>
        {orgs.length?
          orgs.map((item) => <View>
            <Text>{item.name}</Text>
            </View>)
          : null
        }
      </View>
    </SafeAreaView>
  );
}

function RepositoriosScreen({ navigation, route}){

  const { inputText } = route.params;
  const [repos, setRepos] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.github.com/users/" + {inputText} + "/repos")
      .then((response) => response.json())
      .then((data) => {
        setRepos(data);
      })
  }, [{inputText}]);

  return(
    <SafeAreaView>
      <View style={styles.secundary_screen}>
        <Text>Lista de repositorios:</Text>
        {repos.length?
          repos.map((item) => <View>
            <Text>{item.name}</Text>
            </View>)
          : null
        }
      </View>
    </SafeAreaView>
  );
}

function SeguidoresScreen(navigation, route){

  const { inputText } = route.params;
  const [seg, setSeg] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.github.com/users/" + {inputText} + "/followers")
      .then((response) => response.json())
      .then((data) => {
        setSeg(data);
      })
  }, [{inputText}]);

  return(
    <SafeAreaView>
      <View style={styles.secundary_screen}>
        <Text>Lista de seguidores:</Text>
        {seg.length?
          seg.map((item) => <View>
            <Text>{item.login}</Text>
            </View>)
          : null
        }
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {

  const [name, setName] = React.useState(null);
  const [login, setLogin] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [input, setInput] = React.useState("");
  const [bio, setBio] = React.useState(null);

  React.useEffect(() => { 
    fetch("https://api.github.com/users/" + input)
      .then((response) => response.json())
      .then((data) => {
        setName(data.name)
        setLogin(data.login)
        setAvatar(data.avatar_url)
        setBio(data.bio)});
  }, [input]);

  
  return(
    <View style={styles.container}>
      <View style={styles.profile}>
        <View>
          <Image source={{uri: avatar}}
                style={{width: 125, height: 125, borderRadius: 40}} />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {setInput(text)}}
        />
        <Text style={{fontSize: 25, fontWeight: 'bold'}}>{name}</Text>
        <Text style={{fontSize: 16, color: 'grey', fontWeight: 500}}>@{login}</Text>
      </View>
      <View style={styles.infos}>
        <Button style={styles.button_top} title='Bio' subtitle= 'Um pouco sobre o usuário' destination="Bio" inputText={bio} navigation={navigation} icon = 'bio'></Button>
        <Button style={styles.button_2} title='Orgs' subtitle= 'Organizações que o usuário faz parte' destination="Orgs" inputText={input} navigation={navigation} icon = 'orgs'></Button>
        <Button style={styles.button_3} title='Repositórios' subtitle= 'Lista contendo todos os repositórios' destination="Repos" inputText={input} navigation={navigation} icon = 'repos'></Button>
        <Button style={styles.button_bottom} title='Seguidores' subtitle= 'Lista de seguidores' destination="Seguidores" inputText={input} navigation={navigation} icon = 'followers'></Button>
      </View>
      <View style={styles.reset}>
        <View>
          <TouchableOpacity 
            style={styles.button_reset}
            onPress={() => {
              setName(null)
              setLogin(null)
              setAvatar(null)
              setBio(null)
              setOrgs(null)
              setRepos(null)
              setSeg(null)
              setInput("")
            }}>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons name="restart" size={21} color="black" />
                <Text style={styles.text_reset}> Resetar</Text>
              </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Bio' component={BioScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Orgs' component={OrgsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Repos' component={RepositoriosScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='Seguidores' component={SeguidoresScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2.4,
    backgroundColor: '#f7f8fd',
    flexDirection: "column",
  },
  profile: {
    flex: 1,
    backgroundColor: '#f7f8fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infos: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    margin: 20,
    borderRadius: 20,
    elevation: 5
  },
  reset: {
    flex: 0.3,
    backgroundColor: "#ffffff",
    justifyContent: 'center',
    alignItems: 'stretch',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 5,
  },
  button_2: {
    flexDirection: 'row',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    flex: 1
  },
  button_3: {
    flexDirection: 'row',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    flex: 1
  },
  icon_button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  subtitle: {
    color: 'grey',
    fontSize: 13
  },
  navigator_button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  button_top: {
    flexDirection: 'row',
    borderWidth: 0.5,
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  button_bottom: {
    flexDirection: 'row',
    borderWidth: 0.5,
    flex: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  input: {
    height: 40, 
    borderWidth:1,
    width: 100,
  },
  text_reset: {
    fontSize: 17,
    fontFamily: 'notoserif'
  },
  button_reset: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1.3,
    borderRadius: 12,
    height: 55,
  },
  secundary_screen: {
    alignItems: 'center',
  }
});
