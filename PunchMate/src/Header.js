import React from 'react';
import { Appearance , StatusBar } from 'react-native';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          appearance: Appearance.getColorScheme(),
        };
      }
    
      componentDidMount() {
        this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
          this.setState({ appearance: colorScheme });
          StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');
        });
      }
    
      componentWillUnmount() {
        this.appearanceSubscription.remove();
      }

  render() {
    const { appearance } = this.state;
    return (
      <>
      <StatusBar barStyle={appearance === 'dark' ? 'light-content' : 'dark-content'} hidden={false} backgroundColor={appearance === 'dark' ? '#000' : '#fff'} translucent={false} animated={true} />
      </>
    )
  }
}
