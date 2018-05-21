import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, List, message } from 'antd';

import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './AppStore.less';

@connect(({ listApp, appStore, loading }) => ({
  listApp,
  appStore,
  loading: loading.models.listApp,
}))
export default class AppStore extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'listApp/fetch',
    });
  }

  handleInstall = app => {
    this.props.dispatch({
      type: 'appStore/installApp',
      payload: app.install,
      callback: response => {
        if (response) {
          message.success(app.title.concat(' is installed successfully'));
        } else {
          message.error('Internal Server Error');
        }
      },
    });
  };

  handleUninstall = app => {
    this.props.dispatch({
      type: 'appStore/uninstallApp',
      payload: app.uninstall,
      callback: response => {
        if (response) {
          message.success(app.title.concat(' is uninstalled successfully'));
        } else {
          message.error('Internal Server Error');
        }
      },
    });
  };

  render() {
    const { listApp: { listApp }, loading } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        We can see the Application list, install and uninstall those applications on the requirement
        basis
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img alt="application_list" src="../../../public/images/apps.png" />
      </div>
    );

    return (
      <PageHeaderLayout title="Application List" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={listApp}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={() => this.handleInstall(item)}>Install</a>,
                      <a onClick={() => this.handleUninstall(item)}>Uninstall</a>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a href="#">{item.title}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>No any Apps are available.</List.Item>
              )
            }
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
