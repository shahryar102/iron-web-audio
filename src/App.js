import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
import axios from "axios";
import { restElement } from "@babel/types";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
      selectedFile: null
    };
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
      .post("https://ironrest.herokuapp.com/shahriyar", x)
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
          {/* <div>
            <input type="file" onChange={this.fileSelectHandler} /> <br></br>
            <button onClick={this.fileUploadHandler}>Upload</button>
          </div> */}

          <div id="photo-from-container">
            <button onClick={() => widget.open()}>Upload Photo</button>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
