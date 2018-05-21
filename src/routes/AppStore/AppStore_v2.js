import React, { Fragment, PureComponent } from 'react';
import { Button, Popconfirm, message } from 'antd';
import { connect } from 'dva/index';
import Secured from '../../components/Authorized/Secured';

const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});

@Secured(havePermissionAsync)
@connect(({ appStore, loading }) => ({
  appStore,
  loading: loading.models.install_app,
}))
export default class AppStore extends PureComponent {
  handleInstall = () => {
    this.props.dispatch({
      type: 'appStore/installApp',
      payload: {
        groupId: 'io.nubespark',
        artifactId: 'nube-jdbc-engine',
        version: '1.0-SNAPSHOT',
      },
    });
    message.success('Successfully installed!');
  };

  handleUninstall = () => {
    this.props.dispatch({
      type: 'appStore/uninstallApp',
      payload: {
        artifactId: 'nube-jdbc-engine',
      },
    });
    message.success('Successfully uninstalled!');
  };

  render() {
    return (
      <Fragment>
        <Popconfirm
          placement="bottomLeft"
          title="Are you sure install this system?"
          onConfirm={this.handleInstall}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary">Install</Button>
        </Popconfirm>
        <br />
        <br />
        <Popconfirm
          placement="bottomLeft"
          title="Are you sure uninstall this system?"
          onConfirm={this.handleUninstall}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger">Uninstall</Button>
        </Popconfirm>
      </Fragment>
    );
  }
}
