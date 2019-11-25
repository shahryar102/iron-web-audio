import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
import axios from "axios";
import { restElement } from "@babel/types";
import { Switch, Link, Route } from "react-router-dom";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Recorder from "react-mp3-recorder";
//import './App.css';
import "./buttons.css";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      selectedFile: null,
      camera: false,
      gallery: []
    };
  }

  componentDidMount() {
    axios.get("https://ironrest.herokuapp.com/shahriyar").then(data => {
      //set to state and loop through to show images
      console.log(data);
      console.log(data.data[0].url);
      this.setState({ gallery: data.data });
    });
  }

  // addToGallery = imageData.map((each, i) => {
  //   let newGallery = [...this.state.gallery];
  //   newGallery.push(each.url);
  //   console.log("new gallery:" + newGallery);
  //   this.setState({ gallery: newGallery });
  // });

  showGallery = () => {
    console.log(this.state.gallery);
    this.state.gallery.map((eachItem, i) => {
      console.log(eachItem.url);
      return (
        <li key={i}>
          <h2>Just pictured! {eachItem._id}</h2>
          <img src={eachItem.url} width="100px" />
          <button onClick={() => this.delete(i)}>Delete</button>
        </li>
      );
    });
  };
  delete = index => {
    let newGallery = [...this.state.gallery];
    newGallery.splice(index, 1);
    this.setState({ gallery: newGallery });
  };

  onTakePhoto(dataUri) {
    // Do stuff with the dataUri photo...
    console.log("takePhoto");
  }

  async getMicrophone() {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    this.setState({ audio });
  }

  stopMicrophone() {
    this.state.audio.getTracks().forEach(track => track.stop());
    this.setState({ audio: null });
  }

  toggleMicrophone = () => {
    if (this.state.audio) {
      // console.log(this.state.audio)
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  };

  sendDataHandler = data => {};

  postApi = x => {
    console.log("this is posting function");
    axios
      .post("https://ironrest.herokuapp.com/shahriyar", { url: x })
      .then(data => {});
  };
  clearApi = () => {
    console.log("this is the clear function");
    axios
      .delete("https://ironrest.herokuapp.com/deleteCollection/shahriyar")
      .then(data => {});
  };

  fileSelectHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  checkUploadResult = resultEvent => {
    if (resultEvent.event === "success") {
      console.log(resultEvent, resultEvent.info.url);

      this.postApi(resultEvent.info.url);
    }
  };

  showWidget = widget => {
    widget.open();
  };
  cameraOn = () => {
    this.state.camera
      ? this.setState({ camera: false })
      : this.setState({ camera: true });
  };

  render() {
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgtmzbsms",
        uploadPreset: "shahriyar"
      },
      (error, result) => {
        this.checkUploadResult(result);
      }
    );
    return (
      <div className="App">
        <main>
          <div className="controls">
            <button onClick={this.toggleMicrophone}>
              {this.state.audio
                ? "Stop microphone"
                : "Turn on Graphic Microphone"}
            </button>
          </div>
          {this.state.audio && (
            <AudioAnalyser
              audio={this.state.audio}
              send={this.sendDataHandler}
            />
          )}
          <div>
            <button className="buttons" onClick={this.showGallery}>
              Show Gallery
            </button>
          </div>
          <button className="buttons" onClick={this.clearApi}>
            Clear iron-rest API
          </button>

          <div id="photo-from-container">
            <button className="buttons" onClick={() => widget.open()}>
              Upload File to Cloudinary
            </button>
          </div>

          {/* <Recorder
        onRecordingComplete={this._onRecordingComplete}
        onRecordingError={this._onRecordingError}
      /> */}

          <button className="buttons" onClick={this.cameraOn}>
            {this.state.camera
              ? "Turn off React Camera"
              : "Turn on React Camera"}
          </button>

          {this.state.camera ? (
            <Camera
              onTakePhoto={dataUri => {
                this.onTakePhoto(dataUri);
              }}
            />
          ) : null}
        </main>
      </div>
    );
  }
}

export default App;
