import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import ChatListLoader from '../components/chat-list-loader';
import ChatListEmpty from '../components/chat-list-empty';
import ChatListItem from '../components/chat-list-item';

import {colors} from '../assets/themes';
import {routes} from '../App';
import {TwilioService} from '../services/twilio-service';
import {getToken} from '../services/api-service';
import {useApp} from '../context/index';

export default function ChatListScreen({navigation, route}) {
  const {username} = route.params;
  const [loading, setLoading] = useState(true);
  const {channels, updateChannels} = useApp();
  const channelPaginator = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(routes.ChatCreat.name)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const setChannelEvents = useCallback(
    client => {
      client.on('messageAdded', message => {
        updateChannels(prevChannels =>
          prevChannels.map(channel =>
            channel.id === message.channel.sid
              ? {...channel, lastMessageTime: message.dateCreated}
              : channel,
          ),
        );
      });
      return client;
    },
    [updateChannels],
  );

  const getSubscribedChannels = useCallback(
    client =>
      client.getSubscribedChannels().then(paginator => {
        channelPaginator.current = paginator;
        const newChannels = TwilioService.getInstance().parseChannels(
          channelPaginator.current.items,
        );
        updateChannels(newChannels);
      }),
    [updateChannels],
  );

  useEffect(() => {
    getToken(username)
      .then(token => {
        console.log(token);
        return TwilioService.getInstance().getChatClient(token);
      })
      .then(() => TwilioService.getInstance().addTokenListener(getToken))
      .then(setChannelEvents)
      .then(getSubscribedChannels)
      .catch(err => {
        console.log(err);
        showMessage({message: err.message, type: 'danger'});
      })
      .finally(() => setLoading(false));

    return () => TwilioService.getInstance().clientShutdown();
  }, [username, setChannelEvents, getSubscribedChannels]);

  const sortedChannels = useMemo(
    () =>
      channels.sort(
        (channelA, channelB) =>
          channelB.lastMessageTime - channelA.lastMessageTime,
      ),
    [channels],
  );

  return (
    <View style={styles.screen}>
      {loading ? (
        <ChatListLoader />
      ) : (
        <FlatList
          data={sortedChannels}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ChatListItem
              channel={item}
              onPress={() =>
                navigation.navigate(routes.ChatRoom.name, {
                  channelId: item.id,
                  identity: username,
                })
              }
            />
          )}
          ListEmptyComponent={<ChatListEmpty />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.snow,
  },
  addButton: {
    height: 24,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.white,
  },
});
