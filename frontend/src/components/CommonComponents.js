import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const MessageBubble = React.memo(({
  message,
  isOwn,
  onLongPress,
  onReaction
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.messageBubble,
        isOwn ? styles.ownMessage : styles.otherMessage
      ]}
      onLongPress={onLongPress}
      delayLongPress={500}
    >
      {message.image && (
        <Image source={{ uri: message.image }} style={styles.messageImage} />
      )}
      {message.text && (
        <Text
          style={[
            styles.messageText,
            isOwn ? styles.ownText : styles.otherText
          ]}
        >
          {message.text}
        </Text>
      )}
      <View style={styles.reactionsContainer}>
        {message.reactions?.map((reaction, idx) => (
          <View key={idx} style={styles.reactionBubble}>
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
});

export const UserCard = React.memo(({ user, onPress }) => {
  return (
    <TouchableOpacity style={styles.userCard} onPress={onPress}>
      <Image
        source={{
          uri: user.avatar || 'https://via.placeholder.com/50'
        }}
        style={styles.userAvatar}
      />
      <View style={styles.userCardContent}>
        <Text style={styles.userCardName}>{user.username}</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: user.status === 'online' ? '#31a24c' : '#999' }
            ]}
          />
          <Text style={styles.statusText}>{user.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export const CallNotification = React.memo(({ caller, callType, onAccept, onReject }) => {
  return (
    <View style={styles.callNotification}>
      <Image
        source={{
          uri: caller.avatar || 'https://via.placeholder.com/80'
        }}
        style={styles.callerAvatar}
      />
      <Text style={styles.callerName}>{caller.username}</Text>
      <Text style={styles.callText}>Incoming {callType} call...</Text>

      <View style={styles.callButtonsContainer}>
        <TouchableOpacity
          style={[styles.callButton, styles.rejectButton]}
          onPress={onReject}
        >
          <MaterialCommunityIcons
            name="phone-hangup"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.callButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <MaterialCommunityIcons
            name="phone"
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export const MessageMenu = ({
  message,
  position,
  onEdit,
  onDelete,
  onReply,
  onForward,
  onClose
}) => {
  return (
    <View style={[styles.messageMenu, { top: position?.y }]}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onReply();
          onClose();
        }}
      >
        <MaterialCommunityIcons name="reply" size={20} color="#0084ff" />
        <Text style={styles.menuItemText}>Reply</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onForward();
          onClose();
        }}
      >
        <MaterialCommunityIcons name="share" size={20} color="#0084ff" />
        <Text style={styles.menuItemText}>Forward</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onEdit();
          onClose();
        }}
      >
        <MaterialCommunityIcons name="pencil" size={20} color="#0084ff" />
        <Text style={styles.menuItemText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          onDelete();
          onClose();
        }}
      >
        <MaterialCommunityIcons name="trash-can" size={20} color="#ff3b30" />
        <Text style={[styles.menuItemText, { color: '#ff3b30' }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff'
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea'
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20
  },
  ownText: {
    color: '#fff'
  },
  otherText: {
    color: '#000'
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4
  },
  reactionBubble: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4
  },
  reactionEmoji: {
    fontSize: 14
  },
  userCard: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 12
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  userCardContent: {
    flex: 1
  },
  userCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 12,
    color: '#999'
  },
  callNotification: {
    backgroundColor: '#000',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  callerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16
  },
  callerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8
  },
  callText: {
    fontSize: 15,
    color: '#ccc',
    marginBottom: 24
  },
  callButtonsContainer: {
    flexDirection: 'row',
    gap: 16
  },
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rejectButton: {
    backgroundColor: '#ff3b30'
  },
  acceptButton: {
    backgroundColor: '#31a24c'
  },
  messageMenu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    overflow: 'hidden'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#0084ff',
    fontWeight: '500'
  }
});
