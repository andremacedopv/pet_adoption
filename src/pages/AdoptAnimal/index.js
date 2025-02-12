import {useState, useEffect} from "react";
import { database, storage } from "../../services/firebase"
import { collection, addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import {Container, Image, Title, FieldTitle, Field, InfoArea, InfoSection, Info, InfoRow, ButtonArea} from './styles';
import Button from './../../components/Button'
import { ActivityIndicator, ScrollView, Alert} from 'react-native';
import img from "../../assets/placeholder.jpg"
import { useUserContext } from "../../contexts/useUserContext";

const AdoptAnimalPage = ({route, navigation}) => {

  let id = route.params.id
  const {userData} = useUserContext();
  const [pet, setPet] = useState({})
  const [petId, setPetId] = useState({})
  const [uri, setUri] = useState("")
  const [owner, setOwner] = useState({})
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const petsRef = doc(database, "pets", id);
    const docSnap = getDoc(petsRef)
    .then((docSnap) => {
      let newPet = docSnap.data()
      setPetId(docSnap.id)
      setPet(newPet);
      console.log(newPet)
      if(newPet.imagePath){
        const storage = getStorage();
          getDownloadURL(ref(storage,`${newPet.imagePath}`))
            .then((url) => {
              const src = {
                uri: url,
              }
              setUri(src)
            })
            .catch((e) => {
              console.log(e)
            })
        }
        else {
          setUri(img);
        }
      setLoading(false)
      return docSnap
    }).then((docSnap) => {
      const userRef = collection(database, "users")
      const q = query(userRef, where("uid", "==", docSnap.data().creator_uid))
      return q
    }).then((q) => {
      const querySnapshot = getDocs(q);
      return querySnapshot;
    }).then((querySnapshot) => {
      var document = querySnapshot.docs[0].data()
      setOwner(document)
    })
    
  }, [id]);

  async function handleAdoptAnimal() {
    await addDoc(collection(database, "adoptionRequest"), {
      ownerUid: owner.uid,
      ownerName: owner.name,
      userUid: userData.id,
      userName: userData.name,
      petId: petId,
      petName: pet.name,
      approved: ''
    })

    const message = {
      to: owner.deviceID,
      sound: 'default',
      title: 'Seu pet tem um pretendednte',
      body: `O ${pet.name} recebeu um pretendente para adoção.`,
      data: { someData: 'goes here' },
    };
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
    alert('Seu pedido de adoção foi enviado ao dono desse animal')
    navigation.navigate('Página Inicial')
  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return(
    <ScrollView>
      <Container>
        <Image source={uri}/>

        <InfoArea>
          <Title>{pet.name}</Title>
          
          <InfoSection>
            <InfoRow>
              <Info>
                <FieldTitle>SEXO</FieldTitle>
                <Field>{pet.sex}</Field>  
              </Info>
              <Info>
                <FieldTitle>PORTE</FieldTitle>
                <Field>{pet.size}</Field>  
              </Info>
              <Info>
                <FieldTitle>IDADE</FieldTitle>
                <Field>{pet.age}</Field>  
              </Info>
            </InfoRow>
            <Info>
              <FieldTitle>LOCALIZAÇÃO</FieldTitle>
              <Field>{pet.state}</Field>  
            </Info>
          </InfoSection>

          <InfoSection>
            <InfoRow>
              <Info>
                <FieldTitle>CASTRADO</FieldTitle>
                <Field>{pet.health.castrated ? "Sim" : "Não"}</Field>  
              </Info>
              <Info>
                <FieldTitle>FERMIFUGADO</FieldTitle>
                <Field>{pet.health.verms ? "Sim" : "Não"}</Field>  
              </Info>
            </InfoRow>
            <InfoRow>
              <Info>
                <FieldTitle>VACINADO</FieldTitle>
                <Field>{pet.health.vaccinated ? "Sim" : "Não"}</Field>  
              </Info>
              <Info>
                <FieldTitle>DOENÇAS</FieldTitle>
                <Field>{pet.health.illness ? pet.health.illness : "Nenhuma"}</Field>  
              </Info>
            </InfoRow>
          </InfoSection>

          <InfoSection>
            <Info>
              <FieldTitle>TEMPERAMENTO</FieldTitle>
              <Field>
                {pet.temper.calm && "Calmo "}
                {pet.temper.guard && "Guarda "}
                {pet.temper.timid && "Tímido "}
                {pet.temper.loving && "Amoroso "}
                {pet.temper.playful && "Brincalhão "}
                {pet.temper.lazy && "Preguiçoso"}
              </Field>  
            </Info>
          </InfoSection>

          <InfoSection>
            <Info>
              <FieldTitle>EXIGÊNCIAS DO DOADOR</FieldTitle>
              <Field>
                {pet.adoptionOptions.adoptionTerms && "Termo de adoção "}
                {pet.adoptionOptions.housePhotos && "Fotos da Casa "}
                {pet.adoptionOptions.visit && "Visita prévia ao animal "}
                {pet.adoptionOptions.postAdoption && "Acompanhamento pós adoção de "}
                {pet.adoptionOptions.postAdoptionOptions.oneMonth && "1 mês"}
                {pet.adoptionOptions.postAdoptionOptions.threeMonths && "3 meses"}
                {pet.adoptionOptions.postAdoptionOptions.sixMonths && "6 meses"}
              </Field>  
            </Info>
          </InfoSection>

          <InfoSection>
            <Info>
              <FieldTitle>MAIS SOBRE {pet.name.toUpperCase()}</FieldTitle>
              <Field>{pet.aboutAnimal}</Field>  
            </Info>
          </InfoSection>

        </InfoArea>

        <ButtonArea>
          <Button onPress={handleAdoptAnimal}>PRETENDO ADOTAR</Button>
        </ButtonArea>

      </Container>
    </ScrollView>
  )

}

export default AdoptAnimalPage;