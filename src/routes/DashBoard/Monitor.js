import moment from 'moment';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import Authorized from '../../utils/Authorized';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NumberInfo from '../../components/NumberInfo/index';
import MiniArea from '../../components/Charts/MiniArea/index';
import { registerEventBus, unregisterEventBus } from '../../eventBusRegistration';
import { DITTO_EVENTS } from '../../constants';

const { Secured } = Authorized;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
export default class Monitor extends PureComponent {
  state = { values: [], totalCount: 100 };

  componentDidMount() {
    registerEventBus(this, DITTO_EVENTS);
  }

  componentWillUnmount() {
    unregisterEventBus();
  }

  // callback fires on the registerEventBus output
  callback = payload => {
    this.setState(({ values }) => {
      const { thingId } = payload.value;
      const previousValue = values[thingId] ? values[thingId] : [];
      previousValue.push({
        y: payload.value.features.temperature.properties.value,
        x: moment(payload.value.features.temperature.properties.timestamp).format('HH:mm:ss'),
      });
      const valuesToBeAdded = previousValue.slice(-this.state.totalCount);
      return { values: { ...values, [thingId]: valuesToBeAdded } };
    });
  };

  render() {
    return (
      <PageHeaderLayout
        title="Monitor"
        content="We can see the sensors graphical representation over here..."
      >
        <Card bordered={false}>
          <Fragment>
            {Object.keys(this.state.values).map(x => (
              <div key={x}>
                <NumberInfo total={x} />
                <div style={{ marginTop: 32, marginBottom: 32 }}>
                  <MiniArea
                    animate={false}
                    line
                    borderWidth={2}
                    height={84}
                    scale={{
                      y: {
                        tickCount: this.state.totalCount,
                      },
                    }}
                    yAxis={{
                      tickLine: false,
                      label: false,
                      title: false,
                      line: false,
                    }}
                    data={this.state.values[x]}
                  />
                </div>
              </div>
            ))}
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
