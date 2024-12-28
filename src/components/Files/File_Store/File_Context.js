import { createStore } from 'redux';

const data = { files: {},file_content:'',file_path:"" ,file_ext:''};


function reducer(state = data, action) {
  switch (action.type) {
    case 'load_files':
      return { ...state, files:action.payload };
    case 'update_path':
        return { ...state, file_path:action.payload };
    case 'update_content':
        return { ...state, file_content:action.payload.data,file_ext:action.payload.ext };
    default:
      return state;
  }
}

export const store = createStore(reducer);