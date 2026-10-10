import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import { HOME_ADMIN_ATTENDANCE_LIST_URL, HOME_ADMIN_URL, HOME_EMP_HISTORY_URL, HOME_EMP_URL, LOGIN_URL, RESET_PASS_URL, USER_LEVEL_ADMIN, USER_LEVEL_EMP, USER_LEVEL_OWNER } from './config/Parameter';
import ResetPass from './pages/resetPass/ResetPass';
import HomeEmp from './pages/home/HomeEmp';
import HomeAdmin from './pages/home/HomeAdmin';
import HomeAdminListAttendance from './pages/home/HomeAdminListAttendance';
import HomeEmpHistoryAttendance from './pages/home/HomeEmpHistoryAttendance';

const PrivateAdminRoute = () => {
  const userId = localStorage.getItem('userId');
  const userLevel = Number(localStorage.getItem('userLevel'));
  if (userId && userLevel) {
    if (userLevel === USER_LEVEL_EMP) {
      return <Navigate to={HOME_EMP_URL} replace />;
    }
    if (userLevel === USER_LEVEL_OWNER || userLevel === USER_LEVEL_ADMIN) {
        return <Outlet />
    }
  }

  return <Navigate to="/" replace />
}

const PrivateEmpRoute = () => {
  const userId = localStorage.getItem('userId');
  const userLevel = Number(localStorage.getItem('userLevel'));
  if (userId && userLevel) {
    if (userLevel === USER_LEVEL_EMP) {
      return <Outlet />
    } 
    if (userLevel === USER_LEVEL_OWNER || userLevel === USER_LEVEL_ADMIN) {
      return <Navigate to={HOME_ADMIN_URL} replace />;
    }
  }

  return <Navigate to="/" replace />
}

const AnonymousRoute = () => {
  const userId = localStorage.getItem('userId');
  const userLevel = Number(localStorage.getItem('userLevel'));
  if (userId && userLevel) {
    if (userLevel === USER_LEVEL_EMP) {
      return <Navigate to={HOME_EMP_URL} replace />;
    }
    if (userLevel === USER_LEVEL_OWNER || userLevel === USER_LEVEL_ADMIN) {
      return <Navigate to={HOME_ADMIN_URL} replace />;
    }
  }

  if (userId && !userLevel) {
    return <Navigate to={RESET_PASS_URL} replace />;
  }
  
  return <Outlet />
}

const AnonymousResetPassRoute = () => {
  const userId = localStorage.getItem('userId');
  const userLevel = Number(localStorage.getItem('userLevel'));
  if (userId && userLevel) {
    if (userLevel === USER_LEVEL_EMP) {
      return <Navigate to={HOME_EMP_URL} replace />;
    }
    if (userLevel === USER_LEVEL_OWNER || userLevel === USER_LEVEL_ADMIN) {
      return <Navigate to={HOME_ADMIN_URL} replace />;
    }
  } 
  
  if (userId && !userLevel) {
    return <Outlet />
  }

  return <Navigate to="/" replace />
}

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route element={<AnonymousRoute />}>
            <Route path="/" exact element={<Login />} />
            <Route path={LOGIN_URL} exact element={<Login />} />
          </Route>
          <Route element={<AnonymousResetPassRoute />}>
            <Route path={RESET_PASS_URL} exact element={<ResetPass />} />
          </Route>
          <Route element={<PrivateAdminRoute />} >
            <Route path={HOME_ADMIN_URL} element={<HomeAdmin />} />
            <Route path={HOME_ADMIN_ATTENDANCE_LIST_URL} element={<HomeAdminListAttendance />} />
          </Route>
          <Route element={<PrivateEmpRoute />} >
            <Route path={HOME_EMP_URL} element={<HomeEmp />} />
            <Route path={HOME_EMP_HISTORY_URL} element={<HomeEmpHistoryAttendance />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App
