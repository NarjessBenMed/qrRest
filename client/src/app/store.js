import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import adminReducer from '../features/adminSlice';
import ownerReducer from '../features/ownerSlice';
import menuReducer from '../features/menuSlice';
import tableReducer from '../features/tableSlice';
import orderReducer from '../features/orderSlice';
import staffReducer from '../features/staffSlice';
export default configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    owner: ownerReducer,
    menu: menuReducer,
    table: tableReducer,
    order: orderReducer,
    staff: staffReducer,
  },
});
