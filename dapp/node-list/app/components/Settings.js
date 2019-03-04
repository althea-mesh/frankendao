import React from 'react';
import PropTypes from 'prop-types';
import { Button, DropDown, Text, TextInput } from '@aragon/ui';
import { translate } from 'react-i18next';
import styled from 'styled-components';

const locales = ['EN', 'ES'];
const Spacer = styled.div`
  margin: 15px 0;
`;

const InputGroup = styled.div`
  display: table;
  border-collapse: collapse;
  ${Text} {
    display: table-cell;
    background: #eee;
    border: 1px solid #e6e6e6;
    color: #666;
    padding: 9px;
    margin: 0;
    border-radius: 3px;
    vertical-align: middle;
  } 
  ${TextInput} {
    display: table-cell;
    padding: 10px;
    border-right: none;
    margin-right: -1px;
    margin-bottom: -1px;
  } 
`;

class Settings extends React.Component {
  state = {
    language: 0,
    threshold: 0.3
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setLocale = i => {
    let locale = locales[i];
    this.props.i18n.changeLanguage(locale.toLowerCase());
    this.setState({ locale: i });
  }

  render () {
    const { t } = this.props;
    const { locale, threshold } = this.state;

    return (
      <div style={{ marginTop: 30 }}>
        <Text size="large">{t('language')}</Text>
        <Spacer />
        <Text.Block>This will be the default language for display purposes.</Text.Block>
        <Spacer />

        <DropDown
          items={locales}
          active={locale}
          onChange={this.setType}
        />
        <Spacer />
        <Spacer />
        <Button mode="strong">Submit Changes</Button>
        <Spacer />
        <Text size="large">Low Balance Threshold</Text>
        <Spacer />
        <Text.Block>When a nodes balance is equal to or below this level, it will be considered a low balance.</Text.Block>
        <Spacer />
        <InputGroup>
          <TextInput
            type="text"
            name="threshold"
            onChange={this.onChange}
            value={threshold}
          />
          <Text>ETH</Text>
        </InputGroup>
      </div>
    );
  }
}

Settings.propTypes = {
  i18n: PropTypes.object,
  t: PropTypes.func
};

export default translate()(Settings);
