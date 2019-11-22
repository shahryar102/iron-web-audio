import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
import axios from "axios";
import { restElement } from "@babel/types";
import { Switch, Link, Route } from "react-router-dom";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Recorder from "react-mp3-recorder";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      selectedFile: null,
      camera:false
    };
  }

  componentDidMount(){
    axios.get('https://ironrest.herokuapp.com/shahriyar').then(data=>{
      //set to state and loop through to show images 
      console.log(data)
    })
  }

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
    axios.post("https://ironrest.herokuapp.com/shahriyar", {url:x}).then(data => {});
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
cameraOn=()=>{
  this.setState({camera:true})
}

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
              {this.state.audio ? "Stop microphone" : "Get microphone input"}
            </button>
          </div>
          {this.state.audio && (
            <AudioAnalyser
              audio={this.state.audio}
              send={this.sendDataHandler}
            />
          )}
          <button onClick={this.clearApi} style={{ padding: "5px" }}>
            Clear Niko's API
          </button>
          <br></br>
          <br></br>

          <div id="photo-from-container">
            <button onClick={() => widget.open()}>Upload File to Cloudinary</button>
          </div>
          <br></br>
          {/* <Recorder
        onRecordingComplete={this._onRecordingComplete}
        onRecordingError={this._onRecordingError}
      /> */}
      <br></br>

          
            <button onClick = {this.cameraOn} >Turn on Camera</button>
            
          {this.state.camera ? <Camera
  onTakePhoto={dataUri => {
    this.onTakePhoto(dataUri);
  }} 
/> : '' }
        </main>
      </div>
    );
  }
}

export default App;
