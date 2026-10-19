
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Pressable,
  ScrollView,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';

import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type FormData = {
  text: string;
  password: string;
  email: string;
  number: string;
  phone: string;
  textarea: string;
  checkbox: boolean;
  radio: string;
  switch: boolean;
  dropdown: string;
  slider: number;
  date: Date;
  time: Date;
  image: { uri: string; name?: string | null } | null;
  cameraPhoto: { uri: string; name?: string | null } | null;
  document: {
    name: string;
    uri: string;
    size?: number;
    mimeType?: string;
  } | null;
  search: string;
  color: string;
  rating: number;
  segmented: string;
  range: number;
};

export default function Index() {
  const [form, setForm] = useState<FormData>({
    text: '',
    password: '',
    email: '',
    number: '',
    phone: '',
    textarea: '',
    checkbox: false,
    radio: 'Male',
    switch: false,
    dropdown: 'Rwanda',
    slider: 5,
    date: new Date(),
    time: new Date(),
    image: null,
    cameraPhoto: null,
    document: null,
    search: '',
    color: '#0000FF',
    rating: 5,
    segmented: 'Option A',
    range: 50,
  });

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const update = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const fieldStyle = {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginTop: 5,
    marginBottom: 12,
    borderRadius: 4,
  };

  const label = (text: string) => (
    <Text style={styles.label}>{text}</Text>
  );

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      update('image', {
        uri: asset.uri,
        name: asset.fileName,
      });
    }
  };

  const capturePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow camera access to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      update('cameraPhoto', {
        uri: asset.uri,
        name: asset.fileName,
      });
    }
  };

  const chooseDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (!result.canceled) {
      const file = result.assets[0];

      update('document', {
        name: file.name,
        uri: file.uri,
        size: file.size,
        mimeType: file.mimeType,
      });
    }
  };

  const submit = () => {
    const errors: string[] = [];

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push('Email address is invalid.');
    }

    if (form.number && !/^\d+$/.test(form.number)) {
      errors.push('Number must contain digits only.');
    }

    if (form.color && !/^#[0-9a-fA-F]{6}$/.test(form.color)) {
      errors.push('Color must use hexadecimal format, e.g. #0000FF.');
    }

    if (errors.length > 0) {
      Alert.alert('Check your form', errors.join('\n'));
      return;
    }

    const output = {
      ...form,
      date: form.date.toISOString(),
      time: form.time.toISOString(),
    };

    console.log('========== SUBMITTED FORM DATA ==========');
    console.log(output);
    console.log(JSON.stringify(output, null, 2));
    console.log('=========================================');

    Alert.alert('Submitted', 'Form data has been logged to the console.');
  };

  const radioOption = (value: string) => (
    <Pressable
      key={value}
      onPress={() => update('radio', value)}
      style={styles.radioRow}
    >
      <View
        style={[
          styles.radioOuter,
          form.radio === value && styles.radioOuterSelected,
        ]}
      >
        {form.radio === value && <View style={styles.radioInner} />}
      </View>
      <Text>{value}</Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Form Elements Demo</Text>

      {label('1. Text input')}
      <TextInput
        style={fieldStyle}
        value={form.text}
        onChangeText={v =>
          update('text', v.replace(/[^a-zA-Z0-9 ]/g, ''))
        }
        placeholder="Enter text"
      />

      {label('2. Password input')}
      <TextInput
        style={fieldStyle}
        value={form.password}
        onChangeText={v => update('password', v)}
        placeholder="Enter password"
        secureTextEntry
        autoCapitalize="none"
      />

      {label('3. Email input')}
      <TextInput
        style={fieldStyle}
        value={form.email}
        onChangeText={v =>
          update('email', v.replace(/[^a-zA-Z0-9@._+-]/g, ''))
        }
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {label('4. Number input')}
      <TextInput
        style={fieldStyle}
        value={form.number}
        onChangeText={v => update('number', v.replace(/[^0-9]/g, ''))}
        placeholder="Enter whole number"
        keyboardType="number-pad"
      />

      {label('5. Phone input')}
      <TextInput
        style={fieldStyle}
        value={form.phone}
        onChangeText={v =>
          update('phone', v.replace(/[^0-9+() -]/g, ''))
        }
        placeholder="+250..."
        keyboardType="phone-pad"
      />

      {label('6. Multiline text area')}
      <TextInput
        style={[fieldStyle, { height: 90, textAlignVertical: 'top' }]}
        value={form.textarea}
        onChangeText={v => update('textarea', v)}
        placeholder="Write a message"
        multiline
      />

      {label('7. Checkbox')}
      <View style={styles.controlRow}>
        <Checkbox
          value={form.checkbox}
          onValueChange={v => update('checkbox', v)}
        />
        <Text>Accept terms and conditions</Text>
      </View>

      {label('8. Radio buttons')}
      {['Male', 'Female', 'Other'].map(radioOption)}

      {label('9. Switch')}
      <Switch
        value={form.switch}
        onValueChange={v => update('switch', v)}
      />

      {label('10. Dropdown / select')}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.dropdown}
          onValueChange={v => update('dropdown', v)}
        >
          <Picker.Item label="Rwanda" value="Rwanda" />
          <Picker.Item label="Uganda" value="Uganda" />
          <Picker.Item label="Kenya" value="Kenya" />
          <Picker.Item label="Tanzania" value="Tanzania" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {label(`11. Slider: ${form.slider}`)}
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={form.slider}
        onValueChange={v => update('slider', v)}
      />

      {label('12. Date picker')}
      <Text>{form.date.toLocaleDateString()}</Text>
      <Button title="Choose date" onPress={() => setShowDate(true)} />

      {showDate && (
        <DateTimePicker
          value={form.date}
          mode="date"
          onChange={(event, date) => {
            setShowDate(false);
            if (event.type === 'set' && date) update('date', date);
          }}
        />
      )}

      {label('13. Time picker')}
      <Text>{form.time.toLocaleTimeString()}</Text>
      <Button title="Choose time" onPress={() => setShowTime(true)} />

      {showTime && (
        <DateTimePicker
          value={form.time}
          mode="time"
          onChange={(event, time) => {
            setShowTime(false);
            if (event.type === 'set' && time) update('time', time);
          }}
        />
      )}

      {label('14. Image picker')}
      <Button title="Choose image from gallery" onPress={chooseImage} />
      <Text>{form.image?.name || form.image?.uri || 'No image selected'}</Text>

      {form.image?.uri && (
        <Image source={{ uri: form.image.uri }} style={styles.preview} />
      )}

      {label('15. Document / file picker')}
      <Button title="Choose document" onPress={chooseDocument} />
      <Text>{form.document?.name || 'No document selected'}</Text>

      {label('16. Search input')}
      <TextInput
        style={fieldStyle}
        value={form.search}
        onChangeText={v => update('search', v)}
        placeholder="Search..."
      />

      {label('17. Color input')}
      <TextInput
        style={fieldStyle}
        value={form.color}
        onChangeText={v => update('color', v)}
        placeholder="#0000FF"
        autoCapitalize="characters"
        maxLength={7}
      />

      {label(`18. Rating: ${form.rating} / 5`)}
      <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map(n => (
          <Pressable key={n} onPress={() => update('rating', n)}>
            <Text style={styles.star}>
              {n <= form.rating ? '★' : '☆'}
            </Text>
          </Pressable>
        ))}
      </View>

      {label('19. Segmented control')}
      <View style={styles.segmentContainer}>
        {['Option A', 'Option B', 'Option C'].map((option, index) => (
          <Pressable
            key={option}
            onPress={() => update('segmented', option)}
            style={[
              styles.segment,
              index < 2 && styles.segmentBorder,
              form.segmented === option && styles.segmentSelected,
            ]}
          >
            <Text
              style={{
                color: form.segmented === option ? '#FFFFFF' : '#222222',
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {label(`20. Range value: ${form.range}`)}
      <Slider
        minimumValue={0}
        maximumValue={100}
        step={5}
        value={form.range}
        onValueChange={v => update('range', v)}
      />

      {form.cameraPhoto?.uri && (
        <Image
          source={{ uri: form.cameraPhoto.uri }}
          style={styles.preview}
        />
      )}

      <View style={{ marginTop: 25 }}>
        <Button title="Submit Form" onPress={submit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 5,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#777',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  pickerContainer: {
    marginVertical: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  star: {
    fontSize: 28,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentBorder: {
    borderRightWidth: 1,
    borderRightColor: '#999',
  },
  segmentSelected: {
    backgroundColor: '#007AFF',
  },
  preview: {
    width: 180,
    height: 180,
    marginTop: 10,
    resizeMode: 'contain',
  },
});
