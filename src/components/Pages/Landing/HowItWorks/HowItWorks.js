import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TabStyles from './Tab Selectors/TabStyles';
import TabDevices from './Tab Selectors/TabDevices';
import TabRooms from './Tab Selectors/TabRooms';
import TabContentStyles from './Tab Contents/TabContentStyles';
import TabContentDevices from './Tab Contents/TabContentDevices';
import TabContentRooms from './Tab Contents/TabContentRooms';

import './howitworks.scss';

class HowItWorks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
    };
  }

  render() {
    return (
      <div>
        <section className="options-section" id="opciones">
          <h1 className="options-title">¿CÓMO FUNCIONA?</h1>
          <Tabs
            className="tabs-container"
            selectedIndex={this.state.tabIndex}
            onSelect={(tabIndex) => this.setState({ tabIndex })}
          >
            <TabList className="tab-list-container">
              <Tab
                className={
                  'tab-item-container ' +
                  (this.state.tabIndex === 0 ? 'active' : null)
                }
              >
                <TabRooms />
              </Tab>
              <Tab
                className={
                  'tab-item-container ' +
                  (this.state.tabIndex === 1 ? 'active' : null)
                }
              >
                <TabStyles />
              </Tab>
              <Tab
                className={
                  'tab-item-container ' +
                  (this.state.tabIndex === 2 ? 'active' : null)
                }
              >
                <TabDevices />
              </Tab>
            </TabList>
            <TabPanel>
              <TabContentRooms />
            </TabPanel>
            <TabPanel>
              <TabContentStyles />
            </TabPanel>
            <TabPanel>
              <TabContentDevices />
            </TabPanel>
          </Tabs>
        </section>
      </div>
    );
  }
}

export default HowItWorks;
