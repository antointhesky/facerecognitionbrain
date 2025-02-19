import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImagineLinkForm from "./components/ImagineLinkForm/ImagineLinkForm";
import Rank from "./components/Rank/Rank";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Logo />
      <Rank/>
      <ImagineLinkForm />
      {/*<FaceRecognition /> */}
    </div>
  );
}

export default App;
