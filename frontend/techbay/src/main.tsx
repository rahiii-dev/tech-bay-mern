import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store.ts';
import { GoogleOAuthProvider } from "@react-oauth/google"


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="840632733896-ocn5n8p3q57galuqclko6r6t6s74nkgj.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>

    </Provider>
  </BrowserRouter>
  // </React.StrictMode>,
)
