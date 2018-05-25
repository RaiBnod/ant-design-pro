import moment from 'moment';
import { Card, Row } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import Authorized from '../../utils/Authorized';
import { registerEventBus, unregisterEventBus } from '../../eventBusRegistration';
import { DITTO_EVENTS } from '../../constants';
import styles from '../DashBoard/Monitor.less';

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
  state = { data: [], totalCount: 25 };

  componentDidMount() {
    registerEventBus(this, DITTO_EVENTS);
  }

  componentWillUnmount() {
    unregisterEventBus();
  }

  // callback fires on the registerEventBus output
  callback = payload => {
    this.setState(({ data }) => {
      const { thingId } = payload.value;
      const previousValue = data[thingId] ? data[thingId] : [];
      previousValue.push({
        value: payload.value.features.temperature.properties.value,
        timestamp: moment(payload.value.features.temperature.properties.timestamp).format('mm:ss'),
      });
      const valuesToBeAdded = previousValue.slice(-this.state.totalCount);
      return { data: { ...data, [thingId]: valuesToBeAdded } };
    });
  };

  render() {
    const scale = {
      value: { min: 0 },
      timestamp: { range: [0, 1] },
    };

    return (
      <Fragment>
        {Object.keys(this.state.data).map(x => (
          <div className={styles.chartCard} key={x}>
            <h1>{x}</h1>
            <Card loading={this.props.loading} bordered={false} bodyStyle={{ padding: 0 }}>
              <Row>
                <div className={styles.chartBar}>
                  <Chart title={x} height={250} data={this.state.data[x]} scale={scale} forceFit>
                    <Axis name="year" />
                    <Axis name="value" />
                    <Tooltip crosshairs={{ type: 'y' }} />
                    <Geom type="area" position="timestamp*value" size={2} />
                    <Geom
                      type="point"
                      position="timestamp*value"
                      size={4}
                      shape="circle"
                      style={{ stroke: '#fff', lineWidth: 1 }}
                    />
                  </Chart>
                </div>
              </Row>
            </Card>
          </div>
        ))}
      </Fragment>
    );
  }
}
