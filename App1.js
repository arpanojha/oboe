import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import {Audio} from 'expo-av';
import React,{useState} from 'react';
export default function App() {
  const [recording,setRecording] = React.useState();
  const [recordings,setRecordings] = React.useState([]);
  const [message,setMessage] = React.useState("");
  async function startRecording() {
    try{
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted"){
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } =await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);

      }else{
        setMessage("please grant permission")
      }
    } catch(err){
      console.error('Failed to set');
    }
  }
  async function stopRecording(){
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    let updatedRecordings = [...recordings];
    const { sound, status} = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound:sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });
    setRecording(updatedRecordings);
    
  }
  function getRecordingLines(){
    return recordings.map((recordingLine, index) => {
      return(
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index+1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.replayAsync()} title="Play"></Button>
        </View>
      )
    })
  }
  function getDurationFormatted(millis){
    const minutes = millis/1000/60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes-minutesDisplay)*60);
    const secondsDisplay = seconds<10?`0${seconds}`:seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title = {recording ? 'Stop recording':'Start Recording'}
        onPress = {recording ? stopRecording(): startRecording()}>
      </Button>
      {getRecordingLines()}
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill:{
    flrx:1,
    margin:16,
  },
  button:{
    margin:16,
  }
});
