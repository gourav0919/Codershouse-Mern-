import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
// This is the navbar
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/shared/Loader/Loader";

// making react redux some global variables for only development purposes
// const isAuth = true;
// const user = {
//   activated: false,
// };

function App() {
  // the size of the file is increasing so now we are going to use the custom hooks of react made it and use it
  // call refresh endpoint or known as the auto login
  const { loading } = useLoadingWithRefresh();
  // const loading = true; // This is for only loader testing

  return loading ? (
    <Loader message="Loading , please wait...." />
  ) : (
    <BrowserRouter>
      <Navigation />
      <Routes>
        {/* Unprotected Routes or Open Routes that any user can access */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />

        {/* Semi Protected Routes Begin from here */}
        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />

        {/* Protected Routes are begin from here */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          // now this roomId is going to add in the useParams() object so we can easily be able to do object destructuring
          // This is afterwards colon is known as the dynamic parameter
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

// if in the GuestRoute if the user is authenticated then it is redirected to /rooms which is the protected route
// this saves us from the unprotected user access.
// In this route we redirected user directly to the rooms if the user is authenticated and then in the rooms section we check it for the user activation if the user is not activated then we redirect it to activation first.
const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return !isAuth ? children : <Navigate to="/rooms" />;
};

// SemiProtected Route
const SemiProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  // here we check if user is not authenticated then send it to home or / route
  // if user is authenticated but the user is not activated then show him the activate route
  // else if user is authenticated and user is activated then redirect it to rooms route
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    children
  ) : (
    <Navigate to="/rooms" />
  );
};

// SemiProtected Route
const ProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.auth);
  // here we check if user is not authenticated then send it to home or / route
  // if user is authenticated but the user is not activated then show him the activate route
  // else if user is authenticated and user is activated then redirect it to the children route for which it wants to access.
  return !isAuth ? (
    <Navigate to="/" />
  ) : isAuth && !user.activated ? (
    <Navigate to="/activate" />
  ) : (
    children
  );
};

// for handling any of the route we just have to make a unidentified route area which we can use if any of the above component can not satisfy in this way we can easily remove that error that is coming when i go to a route that did not exist and then when i logout from that route so no one state run that's why it is never coming back to the home or / url

export default App;

// Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:5500/api/refresh. (Reason: CORS request did not succeed). Status code:
// This error comes in mozilla firefox sometimes
