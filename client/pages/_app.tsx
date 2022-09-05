import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/index.scss';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
