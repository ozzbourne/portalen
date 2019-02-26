import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import AppPicker from './AppPicker';
import App from './App';
import NotFound from './NotFound';
import AppOne from './AppOne'
import AppTwo from './AppTwo'
import base, { firebaseApp } from '../base';
import firebase from 'firebase';
import Login from './Login'
import NotYourAccount from './NotYourAccount'
import { LogoutBtn } from './styledComponents/GlobalStyles'

// Flytta över all hantering av state och lagring av databas hit för att 
// kunna skickas ner till komponenter
class Router extends React.Component {


  state = {
    database: {},
    userEmail: null,
    owner: null,
    // isLoading används för att inte visa <Login /> medan data hämtas från Firebase, är användaren inloggad visas appen direkt när data hämtats.
    isLoading: false,
    appId: null,
  }
  
  componentDidMount(){
    this.setState({isLoading: true})
    //Synkar state mellan appen och Firebase.
    //Varje gång man går in på en ny "app" skapas en ny databas som kopplas med den första inloggningen som används.
    // // // this.ref = base.syncState(`${this.props.match.params.appId}/database`, {
    // // //   context: this,
    // // //   state: "database"
    // // // });
    //Kör Firebase metod för att kolla om det finns en inloggad användare
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.authHandler({user});
      }
      else {
        this.setState({isLoading: false})
      }
    })
    const localStorageRef = localStorage.getItem("appId");
    if(localStorageRef){
        this.setState({appId: localStorageRef});
    }
  }
  
  componentWillUnmount() {
    //Ser till att rensa upp referens till Firebase när man t.ex går tillbaks.
    //Om användaren går fram och tillbaks 100ggr så kommer så kallat "memory leak" att hända.
    base.removeBinding(this.ref);
    this.setState({isLoading: false})
  }
  authHandler = async (authData) => {
    const userApp = await base.fetch(this.state.appId, {context: this});
    
    //Om det inte finns en registrerad användare till den "appId" så skapar vi en när vi loggar in. Bara den uid kan logga in i framtiden
    // console.log(authData);
    if(!userApp.owner){
      //Skapar ny entry i databasen
      await base.post(`${this.state.appId}/owner`, {
        data: authData.user.email
      })
    }
    this.setState({
      userEmail: authData.user.email,
      owner: userApp.owner || authData.user.email,
      isLoading: false
    })
  }
  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
  }
  updateAppId = (appIdParam) => {
    let tempAppId = this.state.appId;
    tempAppId = appIdParam;
    this.setState({appId: tempAppId});
  }
  updateOwner = (ownerParams) => {
    let tempOwner = this.state.owner;
    tempOwner = ownerParams;
    this.setState({owner: tempOwner});
  }
  logout = async () => {
    await firebase.auth().signOut();
    this.setState({
      userEmail: null,
      isLoading: false
    })
  }
  setLoadingState = (arg) => {
    let tempLoading = this.state.loading;
    tempLoading = arg;
    this.setState({loading: tempLoading});
  } 
  render(){
    /* <p>Här inne kan man sätta allt som ska finnas på alla sidor, som en header.</p> */
    /* <p>Beroende på vilken Route nedan kommer olika komponenter laddas in.</p> */
    /* Flytta pagewrapper hit så att hela sidan kan ha max 100vh höjd och bakgrund. */

    // if (!this.state.userEmail && this.state.isLoading === false){
    //   return <Login authenticate={this.authenticate}/>
    // }
    // //Om man inte har behörighet / inte är ägare till just denna "app"
    // if (this.state.userEmail !== this.state.owner){
    //   return (
    //     <div>
    //       <p>Du har inte behörighet!</p>
    //       {/* {logout} */}
    //     </div>
    //   )
    // }
    
    return(
      <>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" render={({history}) => (
              <AppPicker history={history} updateAppId={this.updateAppId} />
            )} />
            {/* <Route exact path="/login" component={Login} /> */}
            {/* <Route exact 
              path="/app/:appId" 
              render={({match}) => (<App match={match} />)}
            /> */}
            <Route exact 
              path="/app/:appId" 
              render={({match}) => (
                // Nested ternary condition. I grunden som en else-if sats. 
                // isLoading är en variabel i state som kommer vara true medan data hämtas från Firebase. Undviker att visa upp fel innehåll om ingen data hämtats.
                (!this.state.userEmail && this.state.isLoading === false) ? <Login authenticate={this.authenticate}/> :
                ((this.state.userEmail !== this.state.owner || this.state.owner !== undefined) && this.state.isLoading === false) ? <NotYourAccount logout={this.logout}/> : 
                this.state.isLoading === false ? 
                <App 
                  match={match} 
                  appId={this.state.appId}
                  logout={this.logout}
                  updateOwner={this.updateOwner}
                  setLoadingState={this.setLoadingState}
                /> : 
                null
              )}
            />
            <Route exact path="/app/:appId/appOne" component={AppOne} />
            <Route exact path="/app/:appId/appTwo" component={AppTwo} />
            <Route component={NotFound}/>
          </Switch>
        </BrowserRouter>
      </>
    )
  }
}


export default Router;