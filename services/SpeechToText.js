import { useState, useEffect, useCallback } from "react";
import Voice, {

} from "@react-native-voice/voice";

//THIS FILE DOES NOT WORK WITH EXPO
export const useVoiceRecognition = () => {
  const [voiceState, setVoiceState] = useState({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetVoiceState = useCallback(() => {
    setVoiceState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
      isRecording: false,
    });
  }, [setVoiceState]);

  const startRecognizing = useCallback(async () => {
    resetVoiceState();
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  }, [resetVoiceState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetVoiceState();
  }, [resetVoiceState]);

  useEffect(() => {
    Voice.onSpeechStart = (e) => {
      setVoiceState((prevState) => ({
        ...prevState,
        started: "√",
        isRecording: true,
      }));
    };
    Voice.onSpeechRecognized = () => {
      setVoiceState((prevState) => ({ ...prevState, recognized: "√" }));
    };
    Voice.onSpeechEnd = (e) => {
      setVoiceState((prevState) => ({ ...prevState, end: "√", isRecording: false }));
    };
    Voice.onSpeechError = (e) => {
      setVoiceState((prevState) => ({
        ...prevState,
        error: JSON.stringify(e.error),
        isRecording: false,
      }));
    };
    Voice.onSpeechResults = (e) => {
      if (e.value) {
        setVoiceState((prevState) => ({ ...prevState, results: e.value }));
      }
    };
    Voice.onSpeechPartialResults = (e) => {
      if (e.value) {
        setVoiceState((prevState) => ({ ...prevState, partialResults: e.value }));
      }
    };
    Voice.onSpeechVolumeChanged = (e) => {
      setVoiceState((prevState) => ({ ...prevState, pitch: e.value }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    voiceState,
    setVoiceState,
    resetVoiceState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };
};