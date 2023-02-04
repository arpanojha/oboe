import { StatusBar } from 'expo-status-bar';
import React,{useRef} from 'react';
import { ScrollView,Image,Animated,Pressable,Button, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import x from "./X.png";
import line from "./line.png";
let nextId=0;
//import {  } from 'react-native';
export default function App() {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const interval = useRef();
  const count = useRef(0);
  const [Piano1,setPiano1] = React.useState();
  const [Piano2,setPiano2] = React.useState();
  const [Piano3,setPiano3] = React.useState();
  const [Piano4,setPiano4] = React.useState();
  const [bar1,setBar1] = React.useState();
  const [bar2,setBar2] = React.useState();
  const [bar3,setBar3] = React.useState();
  const [bar4,setBar4] = React.useState();
  var [prev,setPrev] = React.useState();
  var [curr,setCurr] = React.useState("00");
  var [store,setStore] = React.useState([]);
  var [len,setLen] = React.useState(0);
  var [display,setDisplay] = React.useState([]);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI()
    });

    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
          <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
        </View>
      );
    });
  }
  const Progress = ({done}) => {
    const [style,setStyle] = React.useState({});
    setTimeout(()=> {
      const newStyle = {
        opacity:1,
        width: `${done}%`
      }
      setStyle(newStyle);
    },1000);
    return (
      <div class="progress">
        <div class="progress-done" style={style}>
          {done}%
        </div>
      </div>
    )
  }

  function progress_check(val) {
    let v = val>500?1:val/500;
    if (v<0.5){
      v=0;
    }
    //else if(v<0.7){
    //  v=50;
    //}
    else{
      v=100;
    }
    return (
      
      <View style={styles.progressBar}>
        <Animated.View style={[StyleSheet.absoluteFill], {backgroundColor: "#8BED4F", width: `${v}%`}}/>
      </View>
    )
  }
  function setnextvar(str){
    if(prev===undefined){
      //prev = str;
      //setPrev(str)
      //line and line 
      setPrev(str);
      
      console.log("line+line")
    }else{
      if(prev[0]!=str[0]){
        if (prev[1]!=str[1]){
          //xx
          console.log("x+x")
          setPrev(str);
          return(
            <View style={styles.flexing}><Image style = {styles.line} source={x} />
      <Image style = {styles.line} source={x} /></View>
          );
          //setPrev(str)
        }else{
          //x line
          console.log("x+line");
          setPrev(str);
          return (
            <View style={styles.flexing}><Image style = {styles.line} source={x} />
      <Image style = {styles.line} source={line} /></View>
          )
        }
      }else{
        if(prev[1]!=str[1]){
          //line x
          console.log("line+x")
          setPrev(str);
          return (
            <View style={styles.flexing}><Image style = {styles.line} source={line} />
      <Image style = {styles.line} source={x} /></View>
          )
        }
      }
      setPrev(str);
    }
    
    //setPrev(str);
  }
  function check_render(curr){
    console.log(curr,prev)
    if (curr!=prev){
      return setnextvar(curr);
    }
    else{
      return (<View></View>);
    }
  }
  function update_store(val){
    if(len===0){
      setStore([...store,val]);
      const k = store.length
      setLen(k)
      return (<View style={styles.flexing}><Image style = {styles.line} source={line} />
      <Image style = {styles.line} source={line} /></View>)
    }else{
      if(store[store.length-1]!=val){
      setStore([...store,val]);
      const k = store.length
      setLen(k);
      console.log(store);
      let a = store[store.length-2]
      let b = store[store.length-1]
      if(a[0]!=b[0]){
        if(b[1]!=a[1]){
          setDisplay([...display,{id:nextId++,left:x,right:x}])
        }else{
          setDisplay([...display,{id:nextId++,left:x,right:line}])
        }
      }else{
        if(a[1]!=b[1]){
        setDisplay([...display,{id:nextId++,left:line,right:x}])}
      }
      console.log(display)
    }
      return (<View style={styles.flexing}><Image style = {styles.line} source={line} />
      <Image style = {styles.line} source={x} /></View>)
    }
  }
  return (
    <ScrollView>
    <View style={styles.container}>
      <Text>Project OBOE</Text>
      <Text>{message}</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording} />
      {getRecordingLines()}
      <Pressable onPressIn={() =>{
        setPiano1(Date.now());
      }}
      onPressOut={() => {
        setBar1(Date.now()-Piano1)
        update_store("00")
        
      }}><Text>Instrument 1(00)</Text></Pressable>
      
      {progress_check(bar1)}
  
      <Pressable onPressIn={() =>{
        setPiano2(Date.now());
      }}
      onPressOut={() => {
        setBar2(Date.now()-Piano2)
        
        update_store("01")
      }}><Text>Instrument 2(01)</Text></Pressable>
      {progress_check(bar2)}
      
      <Pressable onPressIn={() =>{
        setPiano3(Date.now());
      }}
      onPressOut={() => {
        setBar3(Date.now()-Piano3)
        
        update_store("10")
      }}><Text>Instrument 3(10)</Text></Pressable>
      {progress_check(bar3)}

      <Pressable onPressIn={() =>{
        setPiano4(Date.now());
      }}
      onPressOut={() => {
        setBar4(Date.now()-Piano4);
        
        update_store("11")
      }}><Text>Instrument 4(11)</Text></Pressable>
      {progress_check(bar4)}
 
      {
        display.map(dis=>(
          <View style={styles.flexing}><Image style = {styles.line} source={dis.left} />
      <Image style = {styles.line} source={dis.right} /></View>
        ))
      }
      
      <StatusBar style="auto" />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16
  },
  button: {
    margin: 16
  },
  progressBar: {
    height: 20,
   flexDirection: "row",
   width: '100%',
   backgroundColor: 'white',
   borderColor: '#000',
   borderWidth: 2,
   borderRadius: 5
  },
  line: {
    width: 70,
    height: 80,
    resizeMode: 'stretch',
  },
  flexing:{
    flexDirection:'row',
  }
});