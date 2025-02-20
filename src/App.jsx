import React, { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ParticlesBg from "particles-bg";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "21f4c30fffbd409ba8148c31f2663f66",
});

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data) => {
    if (!data?.outputs) return;
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    if (!image) return;
    
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = async () => {
    setImageUrl(input);

    try {
      const response = await app.models.predict("face-detection", input);
      if (response) {
        const res = await fetch("http://localhost:3000/image", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id }),
        });
        const count = await res.json();
        setUser((prevUser) => ({ ...prevUser, entries: count }));
      }
      displayFaceBox(calculateFaceLocation(response));
    } catch (error) {
      console.error("Error detecting face:", error);
    }
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setUser({
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      });
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </>
      ) : route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
};

export default App;




