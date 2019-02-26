import React from 'react'
import { SmallPageWrapper } from './styledComponents/SmallPageStyles'

// TODO: proptypes

class AppPicker extends React.Component {
  state = {
    appId: "",
  }
  componentDidMount() {
    //Testa först om det finns data i local storage, hämta isåfall.
    const localStorageRef = localStorage.getItem("appId");
    if(localStorageRef){
        this.setState({appId: localStorageRef});
    }
  }
  goToStore = (event) => {
    event.preventDefault();
    const appId = this.state.appId;
    this.props.updateAppId(appId);
    this.props.history.push(`app/${appId}`);
    localStorage.setItem("appId", this.state.appId);
  }
  handleIt = (e) => {
    this.setState({appId: e.target.value});
  }
  render() {
    return (
      <SmallPageWrapper>
        <form className="database-selector" onSubmit={this.goToStore}>
          <h2>Vänligen mata in namnet på ditt konto</h2>
          <input 
            type="text" 
            required 
            placeholder="Namn på ditt konto"
            onChange={this.handleIt}
            value={this.state.appId}
            />
          <button type="submit">Öppna applikation</button>
        </form>
      </SmallPageWrapper>
    )
  }
}

export default AppPicker;