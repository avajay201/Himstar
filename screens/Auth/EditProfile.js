import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppLogo from './../../assets/images/logo.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';


const EditProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPhoneChanged, setIsPhoneChanged] = useState(false);
    const [coverImage, setCoverImage] = useState(null); // Replace with image picker logic
    const [profileImage, setProfileImage] = useState(null); // Replace with image picker logic
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSaveProfile = () => {
        if (!firstName || !lastName || !dob || !gender || !zipcode || !phoneNumber) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        Alert.alert('Success', 'Your profile has been updated successfully.');
    };

    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
        setIsPhoneChanged(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setDob(formattedDate);
        }
    };

    const handleVerifyPhone = () => {
        Alert.alert('Verify', 'Phone verification process initiated.');
    };

    const handleImageEdit = (type) => {
        Alert.alert('Edit Image', `Edit ${type} image functionality.`);
        // Implement logic for picking or editing the image
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.coverImageContainer}>
                <Image
                    source={coverImage ? { uri: coverImage } : AppLogo}
                    style={styles.coverImage}
                />
                <TouchableOpacity
                    style={[styles.editIcon, styles.coverEditIcon]}
                    onPress={() => handleImageEdit('cover')}
                >
                    <Icon name="edit" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={profileImage ? { uri: profileImage } : AppLogo}
                    style={styles.profileImage}
                />
                <TouchableOpacity
                    style={[styles.editIcon, styles.profileEditIcon]}
                    onPress={() => handleImageEdit('profile')}
                >
                    <Icon name="edit" size={10} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text style={styles.inputText}>{dob || 'Select Date'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dob ? new Date(dob) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                    >
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Other" value="Other" />
                    </Picker>
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Zipcode</Text>
                <TextInput
                    style={styles.input}
                    value={zipcode}
                    onChangeText={setZipcode}
                    placeholder="Enter zipcode"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneRow}>
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={handlePhoneChange}
                        placeholder="Enter phone number"
                        keyboardType="numeric"
                    />
                    {isPhoneChanged && (
                        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyPhone}>
                            <Text style={styles.verifyText}>Verify</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    backButton: {
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#B94EA0',
        marginBottom: 20,
        textAlign: 'center',
    },
    coverImageContainer: {
        position: 'relative',
        backgroundColor: 'black',
        marginBottom: 20,
        borderRadius: 10,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginTop: -50,
        borderWidth: 3,
        borderColor: '#fff',
        alignSelf: 'center',
    },
    editIcon: {
        position: 'absolute',
        backgroundColor: '#B94EA0',
        padding: 10,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    coverEditIcon: {
        right: 100,
        bottom: 10,
    },
    profileEditIcon: {
        right: 150,
        bottom: 0,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifyButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    verifyText: {
        color: '#fff',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#B94EA0',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfile;
