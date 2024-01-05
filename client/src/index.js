import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import globalReducer from "state";
import { api } from "state/api";

// Below refers to the CONFIGURATIONS used to make API call
const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
