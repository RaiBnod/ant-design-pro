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

      let key;

      if (payload.value.features && payload.path === '/') {
        const newData = {};
        Object.keys(payload.value.features).forEach(x => {
          let valuesToBeAdded;
          key = x;

          if (
            key &&
            !isNaN(payload.value.features[key].properties.value) &&
            payload.value.features[key].properties.timestamp &&
            moment(payload.value.features[key].properties.timestamp).format('mm:ss') !==
              'Invalid date'
          ) {
            const previousValue = data[thingId + key] ? data[thingId + key] : [];

            previousValue.push({
              value: parseInt(payload.value.features[key].properties.value, 10),
              timestamp: moment(payload.value.features[key].properties.timestamp).format('mm:ss'),
              unit: payload.value.features[key].properties.unit,
            });

            valuesToBeAdded = previousValue.slice(-this.state.totalCount);
            newData[thingId + key] = valuesToBeAdded;
          }
        });
        return { data: { ...data, ...newData } };
      }
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
            <h1>
              {x} <b>[mm:ss vs {this.state.data[x][0].unit}]</b>
            </h1>
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
