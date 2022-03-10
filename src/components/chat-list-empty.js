import React from 'react';
import {Text, StyleSheet} from 'react-native';

import {colors} from '../assets/themes';

export default function ChatListEmpty() {
  return <Text style={styles.titleText}>No Chats Created</Text>;
}

const styles = StyleSheet.create({
  titleText: {
    marginTop: '50%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.amaranth,
  },
});
