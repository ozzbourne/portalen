import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import base, { firebaseApp } from '../base';
import firebase from 'firebase';
import Login from './Login'
import { AppWrapp, PageWrapp, Apps } from './styledComponents/StartPageStyles'
import { TechSpecText, LogoutBtn } from './styledComponents/GlobalStyles'

// TODO: proptypes, fixa så inte "login" visas medan data hämtas


class App extends Component {
  state = {
    database: {},
    // // // userEmail: null,
    // // // owner: null,
    // // // // isLoading används för att inte visa <Login /> medan data hämtas från Firebase, är användaren inloggad visas appen direkt när data hämtats.
    // // // isLoading: false
    isLoading: true,
  }
  
  componentDidMount(){
    this.setState({isLoading: true})
    //Synkar state mellan appen och Firebase.
    //Varje gång man går in på en ny "app" skapas en ny databas som kopplas med den första inloggningen som används.
    this.ref = base.syncState(`${this.props.match.params.appId}/database`, {
      context: this,
      state: "database"
    });
    //Kör Firebase metod för att kolla om det finns en inloggad användare
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.authHandler({user});
      }
      else {
        this.setState({isLoading: false})
      }
    })
  }
  //Ser till att uppdatera äger till "appen" som man befinner sig på just nu. Utan detta kan man visa upp andras "appar" genom att bara ändra URL. Dock ej redigera, men ändå...
  //Med isLoading ser jag till att inte visa upp appen förrän data har hämtats och kontrollerat ägare mot användare.
  authHandler = async (authData) => {
    const userApp = await base.fetch(this.props.match.params.appId, {context: this});
    // this.props.updateOwner(userApp.owner);
    alert(authData.user.email);
    this.setState({isLoading: false})
  }
  
  // // // componentWillUnmount() {
  // // //   //Ser till att rensa upp referens till Firebase när man t.ex går tillbaks.
  // // //   //Om användaren går fram och tillbaks 100ggr så kommer så kallat "memory leak" att hända.
  // // //   base.removeBinding(this.ref);
  // // //   this.setState({isLoading: false})
  // // // }
  // // // authHandler = async (authData) => {
  // // //   const userApp = await base.fetch(this.props.match.params.appId, {context: this});
  // // //   //Om det inte finns en registrerad användare till den "appId" så skapar vi en när vi loggar in. Bara den uid kan logga in i framtiden
  // // //   // console.log(authData);
  // // //   if(!userApp.owner){
  // // //     //Skapar ny entry i databasen
  // // //     await base.post(`${this.props.match.params.appId}/owner`, {
  // // //       data: authData.user.email
  // // //     })
  // // //   }
  // // //   this.setState({
  // // //     userEmail: authData.user.email,
  // // //     owner: userApp.owner || authData.user.email,
  // // //     isLoading: false
  // // //   })
  // // // }
  // // // authenticate = (provider) => {
  // // //   const authProvider = new firebase.auth[`${provider}AuthProvider`]();
  // // //   firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
  // // // }
  handleChange = (e) => {
    const database = { 
      ...this.state.database,
      //Med detta kan jag skapa ny entry i state beroende på namnet på input-rutorna.
      [e.currentTarget.name]: e.currentTarget.value
     };
     this.setState({database});
  }

  //Skicak denna metod till Router.js hämta med props till denna fil
  // logout = async () => {
  //   await firebase.auth().signOut();
  //   this.setState({
  //     userEmail: null,
  //     isLoading: false
  //   })
  // }
  render() {
    if(this.state.isLoading) {
      return null;
    }

    //Kolla om man är inloggad, kör olika return beroende på vilken
    // // // if (!this.state.userEmail && this.state.isLoading === false){
    // // //   return <Login authenticate={this.authenticate}/>
    // // // }
    // // // //Om man inte har behörighet / inte är ägare till just denna "app"
    // // // if (this.state.userEmail !== this.state.owner){
    // // //   return (
    // // //     <div>
    // // //       <p>Du har inte behörighet!</p>
    // // //       {logout}
    // // //     </div>
    // // //   )
    // // // }
    return (
      <PageWrapp>
        <AppWrapp>
          <input name="skosegnose" onChange={this.handleChange} placeholder="edit skose" value={this.state.database.skosegnose}/>
          <LogoutBtn onClick={() => this.props.logout()}>LogOut</LogoutBtn>
          <TechSpecText>
            <p>Tech 1</p>
            <p>Tech 2</p>
            <p>Tech 3</p>
          </TechSpecText>
          <Apps>
            <Link to={`/app/${this.props.appId}/appOne`}>Knapp 1</Link>
            <Link to={`/app/${this.props.appId}/appTwo`}>Knapp 1</Link>
            
          </Apps>
          {this.props.appId}
        </AppWrapp>
      </PageWrapp>
    );
  }
}

export default App;
