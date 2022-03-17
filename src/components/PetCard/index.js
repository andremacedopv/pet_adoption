import * as React from 'react';
import { Title } from 'react-native-paper';
import { ImageBackground, StyleSheet, Text, View, Image } from "react-native";
import {TitleArea, ImageArea, Container, DescriptionArea, LineDescription} from './styles';
import { FontAwesome } from '@expo/vector-icons';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const PetCard = ({name, sex, age, size, city, state, photo}) => {
  React.useEffect(() => {
    console.log(photo)
  }, [photo])
  
  const sexHash = {
    'female': 'Fêmea',
    'male': 'Macho'
  }

  const ageHash = {
    'young': 'Jovem',
    'old': 'Velho',
    'adult': 'Adulto'
  }

  const sizeHash = {
    'small': 'Pequeno',
    'big': 'Grande',
    'medium': 'Médio'
  }

  return (
  <Container>
    <TitleArea>
      <Title>{name}</Title>
      <FontAwesome name="heart-o" size={24} color="black" />
    </TitleArea>
    <ImageArea>
      <View style={styles.container}>
        <Image source={photo} style={styles.image} />
      </View>
    </ImageArea>
    <DescriptionArea>
      <LineDescription>
          <Text>{sexHash[sex]}</Text>
          <Text>{ageHash[age]}</Text>
          <Text>{sizeHash[size]}</Text>
      </LineDescription>
      <LineDescription>
          <Text>{city} - {state}</Text>
      </LineDescription>
    </DescriptionArea>
  </Container>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height: 150
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  }
});

export default PetCard;