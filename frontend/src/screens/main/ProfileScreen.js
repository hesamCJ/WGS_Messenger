import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../context/authStore';

const ProfileScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = async () => {
    try {
      await updateUserProfile({
        firstName,
        lastName,
        bio
      });
      setEditing(false);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
        style: 'destructive'
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: user?.avatar || 'https://via.placeholder.com/100'
            }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{user?.username}</Text>
        </View>

        {!editing ? (
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Bio</Text>
              <Text style={styles.value}>{user?.bio || 'No bio'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{user?.status}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user?.phone || 'Not set'}</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditing(true)}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tell something about you"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="bell"
              size={24}
              color="#0084ff"
            />
            <Text style={styles.settingText}>Notifications</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color="#0084ff"
            />
            <Text style={styles.settingText}>Privacy & Security</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color="#0084ff"
            />
            <Text style={styles.settingText}>Appearance</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons
              name="help-circle"
              size={24}
              color="#0084ff"
            />
            <Text style={styles.settingText}>Help & Support</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#ccc"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color="#ff3b30"
            />
            <Text style={[styles.settingText, styles.dangerText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4
  },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 12
  },
  infoItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4
  },
  value: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500'
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0084ff',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8
  },
  editSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  inputGroup: {
    marginBottom: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#f8f8f8'
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600'
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0084ff',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginLeft: 12
  },
  dangerItem: {
    borderBottomWidth: 0
  },
  dangerText: {
    color: '#ff3b30'
  }
});

export default ProfileScreen;
