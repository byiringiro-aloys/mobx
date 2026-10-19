
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Pressable,
  ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [form, setForm] = useState({
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
    document: null,
    search: '',
    color: '#0000ff',
    rating: 5,
    segmented: 'Option A',
    range: 50,
  });

  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const update = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const fieldStyle = {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginTop: 5,
    marginBottom: 12,
    borderRadius: 4,
  };

  const label = (text: any) => (
    <Text style={{ fontWeight: 'bold', marginTop: 10 }}>{text}</Text>
  );

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
    });

    if (!result.canceled) {
      update('image', {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName,
      });
    }
  };

  const chooseDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

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
    const output = {
      ...form,
      date: form.date.toISOString(),
      time: form.time.toISOString(),
    };

    console.log('========== SUBMITTED FORM DATA ==========');
    console.log(output);
    console.log(JSON.stringify(output, null, 2));
    console.log('=========================================');
  };

  const radioOption = (value: string) => (
    <Pressable
      key={value}
      onPress={() => update('radio', value)}
      style={{ paddingVertical: 5 }}
    >
      <Text>{form.radio === value ? '(●)' : '( )'} {value}</Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
        Form Elements Demo
      </Text>

      {label('1. Text input')}
      <TextInput
        style={fieldStyle}
        value={form.text}
        onChangeText={v => update('text', v)}
        placeholder="Enter text"
      />

      {label('2. Password input')}
      <TextInput
        style={fieldStyle}
        value={form.password}
        onChangeText={v => update('password', v)}
        placeholder="Enter password"
        secureTextEntry
      />

      {label('3. Email input')}
      <TextInput
        style={fieldStyle}
        value={form.email}
        onChangeText={v => update('email', v)}
        placeholder="Enter email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {label('4. Number input')}
      <TextInput
        style={fieldStyle}
        value={form.number}
        onChangeText={v => update('number', v)}
        placeholder="Enter number"
        keyboardType="numeric"
      />

      {label('5. Phone input')}
      <TextInput
        style={fieldStyle}
        value={form.phone}
        onChangeText={v => update('phone', v)}
        placeholder="Enter phone"
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
      <Pressable
        onPress={() => update('checkbox', !form.checkbox)}
        style={{ paddingVertical: 8 }}
      >
        <Text>{form.checkbox ? '☑' : '☐'} Accept terms and conditions</Text>
      </Pressable>

      {label('8. Radio buttons')}
      {['Male', 'Female', 'Other'].map(radioOption)}

      {label('9. Switch')}
      <Switch
        value={form.switch}
        onValueChange={v => update('switch', v)}
      />

      {label('10. Dropdown / select')}
      <View style={{ borderWidth: 1, borderColor: '#999', marginVertical: 5 }}>
        <Picker
          selectedValue={form.dropdown}
          onValueChange={v => update('dropdown', v)}
        >
          <Picker.Item label="Rwanda" value="Rwanda" />
          <Picker.Item label="Uganda" value="Uganda" />
          <Picker.Item label="Kenya" value="Kenya" />
          <Picker.Item label="Tanzania" value="Tanzania" />
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
      <Button title="Choose image" onPress={chooseImage} />
      <Text>{form.image?.name || form.image?.uri || 'No image selected'}</Text>

      {label('15. Document / file picker')}
      <Button title="Choose document" onPress={chooseDocument} />
      <Text>{form.document?.name || 'No document selected'}</Text>

      {label('16. Search / autocomplete input')}
      <TextInput
        style={fieldStyle}
        value={form.search}
        onChangeText={v => update('search', v)}
        placeholder="Search..."
      />

      {label('17. Color picker (hex input)')}
      <TextInput
        style={fieldStyle}
        value={form.color}
        onChangeText={v => update('color', v)}
        placeholder="#000000"
        autoCapitalize="none"
      />

      {label(`18. Rating input: ${form.rating} / 5`)}
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <Pressable key={n} onPress={() => update('rating', n)}>
            <Text style={{ fontSize: 24 }}>
              {n <= form.rating ? '★' : '☆'}
            </Text>
          </Pressable>
        ))}
      </View>

      {label('19. Segmented control')}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['Option A', 'Option B', 'Option C'].map(option => (
          <Button
            key={option}
            title={option}
            onPress={() => update('segmented', option)}
            color={form.segmented === option ? 'blue' : 'gray'}
          />
        ))}
      </View>
      <Text>Selected: {form.segmented}</Text>

      {label(`20. Range value: ${form.range}`)}
      <Slider
        minimumValue={0}
        maximumValue={100}
        step={100}
        value={form.range}
        onValueChange={v => update('range', v)}
      />

      <View style={{ marginTop: 25 }}>
        <Button title="Submit Form" onPress={submit} />
      </View>
    </ScrollView>
  );
}
