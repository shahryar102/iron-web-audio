import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
import axios from "axios";
import { restElement } from "@babel/types";
import { Switch, Link, Route } from "react-router-dom";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Recorder from "react-mp3-recorder";
import "./App.css";
import "./buttons.css";
console.log("hello?");
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGallery: false,
      audio: null,
      selectedFile: null,
      camera: false,
      gallery: [],
      buttonOn: false
    };
  }

  componentDidMount() {
    axios.get("https://ironrest.herokuapp.com/shahriyar").then(data => {
      console.log(data);
      console.log(data.data);
      // console.log(data.data[0].url);
      this.setState({ gallery: data.data });
    });
  }

  shouldIshowGallery = () => {
    this.setState({
      showGallery: !this.state.showGallery,
      buttonOn: !this.state.buttonOn
    });
  };

  showGallery = () => {
    console.log(this.state.gallery);

    if (this.state.showGallery) {
      console.log(this.state.gallery);
      return this.state.gallery.map((eachItem, i) => {
        console.log(eachItem.url);
        return (
          <div className="gallery" key={i}>
            <h2>Captured from ironrest #{i + 1}</h2>
            <img src={eachItem.url} width="800px" height="800px" />
            <button onClick={() => this.delete(i)}>Delete</button>
          </div>
        );
      });
    } else {
      return <></>;
    }
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

  //sendDataHandler = data => {};

  postApi = x => {
    console.log("this is posting function");
    axios
      .post("https://ironrest.herokuapp.com/shahriyar", { url: x })
      .then(data => {
        console.log(data);
      });
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
      let newGallery = [...this.state.gallery];
      newGallery.push({
        _id: resultEvent.info.public_id,
        url: resultEvent.info.url
      });
      this.setState({ gallery: newGallery });
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
        <main className="app-main">
          <div className="controls">
            <button className="buttons" onClick={this.toggleMicrophone}>
              {this.state.audio
                ? "Stop microphone"
                : "Turn on Graphic Microphone"}
            </button>
          </div>

          <div>
            <button
              className={this.state.buttonOn ? "buttonOn" : "buttonOff"}
              onClick={this.shouldIshowGallery}
            >
              {this.state.showGallery ? "Hide Gallery" : "Show Gallery"}
            </button>
          </div>
          <button className="buttons" onClick={this.clearApi}>
            Clear iron-rest API
          </button> <span>.      .</span>
          <a href="https://ironrest.herokuapp.com/shahriyar">
            <button className="buttons">Link to iron-rest API</button>
          </a>

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
          <span>.      .</span>

          <a href="https://shahryar102.github.io/Audio-recorder/index.html">
            <button className="buttons">Record Audio</button>
          </a>
        </main>
        <div className="content">
          {this.state.camera ? (
            <Camera
              onTakePhoto={dataUri => {
                this.onTakePhoto(dataUri);
              }}
            />
          ) : null}
          {this.state.audio && (
            <AudioAnalyser
              audio={this.state.audio}
              send={this.sendDataHandler}
            />
          )}
          {this.showGallery()}
        </div>
      </div>
    );
  }
}

export default App;
