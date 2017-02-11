/**
 * @flow
 */

import React from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity,
  Button,
  InteractionManager,
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import SampleText from './SampleText';

function doExpensiveOperation() {
  let str = '';
  for (i = 0; i < Math.pow(2, 22); i++) {
    i = str + i;
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
});

class ExpensiveScene extends React.Component {

  render() {
    // setting timeout so this happens in the middle of the
    // transition, if we do this at the start, it will not even
    // begin doing the transition. both are very bad.
    doExpensiveOperation()

    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text>Expensive!</Text>
      </View>
    )
  }
}

class DeferredExpensiveScene extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isReady: false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({isReady: true});
    });
  }

  renderPlaceholder() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    )
  }

  render() {
    if (!this.state.isReady) {
      return this.renderPlaceholder();
    }

    doExpensiveOperation();

    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <Text>Deferred expensive!</Text>
      </View>
    )
  }

}

const MyNavScreen = ({ navigation, banner }) => (
  <ScrollView>
    <SampleText>{banner}</SampleText>
    <Button
      onPress={() => navigation.navigate('Expensive')}
      title="Render Expensive Scene"
    />
    <Button
      onPress={() => navigation.navigate('DeferredExpensive')}
      title="Render Deferred Expensive Scene"
    />
    <Button
      onPress={() => navigation.goBack(null)}
      title="Go back"
    />
  </ScrollView>
);

const MyHomeScreen = ({ navigation }) => (
  <MyNavScreen
    banner="Home Screen"
    navigation={navigation}
  />
);

MyHomeScreen.navigationOptions = {
  title: 'Welcome',
};

const SimpleStack = StackNavigator({
  Home: {
    screen: MyHomeScreen,
  },
  Expensive: {
    screen: ExpensiveScene,
  },
  DeferredExpensive: {
    screen: DeferredExpensiveScene
  }
});

export default SimpleStack;
