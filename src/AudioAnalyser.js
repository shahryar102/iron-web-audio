import React, { Component } from "react";
import AudioVisualiser from "./AudioVisualiser";
import axios from 'axios';


class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    
      audioData: new Uint8Array(0),
      dataStreem: []
    };
    this.tick = this.tick.bind(this);
  }
  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }
  tick() {
    let newDataStreem = [...this.state.dataStreem];
    newDataStreem.push(this.dataArray)
    this.setState({
      dataStreem: newDataStreem
    })
    this.analyser.getByteTimeDomainData(this.dataArray);
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
    console.log(this.state.dataStreem)
  }
  componentWillUnmount() {
    axios.post("https://ironrest.herokuapp.com/shahriyar", {audio: this.state.dataStreem.slice(0,10)})
      .then(response => {
        console.log(response.data)
      })
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }
  
  render() {
    return <AudioVisualiser audioData={this.state.audioData} />;
    
  }
}

export default AudioAnalyser;
