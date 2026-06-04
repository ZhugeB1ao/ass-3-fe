import { Provider } from 'react-redux';
import StudentListScreen from './screens/StudentListScreen';
import store from './store/store';

export default function App() {
  return (
    <Provider store={store}>
      <StudentListScreen />
    </Provider>
  );
}
