// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { ThemeProvider } from './context/ThemeContext';
// import './styles/custom.css';

// ReactDOM.render(
//   <React.StrictMode>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TerminalContextProvider } from 'react-terminal';
import { SocketProvider } from './Sockets/SocketProvider';
import { Provider } from 'react-redux';
import { store } from './components/Files/File_Store/File_Context';

ReactDOM.render(
  <React.StrictMode>
    <TerminalContextProvider>
    <SocketProvider>
    <Provider store={store}>
    <App/>
   </Provider>
    </SocketProvider>
</TerminalContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

