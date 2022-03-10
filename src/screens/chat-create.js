import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {colors} from '../assets/themes';
import {images} from '../assets/images';
import {TwilioService} from '../services/twilio-service';
import {useApp} from '../context/index';

export default function ChatCreateScreen() {
  const [channelName, setChannelName] = useState('');
  const [loading, setLoading] = useState(false);
  const {channels, updateChannels} = useApp();

  const onAddChannel = channel => {
    const newChannel = TwilioService.getInstance().parseChannel(channel);
    updateChannels(channels.concat(newChannel));
  };

  const onCreateOrJoin = async () => {
    try {
      await TwilioService.getInstance();
    } catch (error) {
      console.log(
        '🚀 ~ file: chat-create.js ~ line 31 ~ onCreateOrJoin ~ error',
        error,
      );
    }

    setLoading(true);
    TwilioService.getInstance()
      .getChatClient()
      .then(client => {
        return client
          .getChannelByUniqueName(channelName)
          .then(channel =>
            channel.channelState.status !== 'joined' ? channel.join() : channel,
          )
          .then(onAddChannel)
          .catch(() =>
            client
              .createChannel({
                uniqueName: channelName,
                friendlyName: channelName,
              })
              .then(channel => {
                onAddChannel(channel);
                channel.join();
              }),
          );
      })
      .then(() => showMessage({message: 'You have joined.'}))
      .catch(err => {
        console.log(err);
        showMessage({message: err.message, type: 'danger'});
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.screen}>
      <Image style={styles.logo} source={images.message} />
      <TextInput
        value={channelName}
        onChangeText={setChannelName}
        style={styles.input}
        placeholder="Channel Name"
        placeholderTextColor={colors.ghost}
      />
      <TouchableOpacity style={styles.button} onPress={onCreateOrJoin}>
        <Text style={styles.buttonText}>Create Or Join</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whisper,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  input: {
    width: 280,
    height: 50,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.eclipse,
    marginTop: 32,
    marginBottom: 16,
  },
  button: {
    width: 280,
    height: 50,
    backgroundColor: colors.malibu,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: colors.white,
  },
});
