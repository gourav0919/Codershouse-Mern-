import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/authSlice";

export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // As we known that if we refresh our app then firstly it going to mount the component did mount
  // we make the dependency array as empty so that it can call only one time
  useEffect(() => {
    // This is the anonymous immediate call function
    (async () => {
      try {
        // console.log("i am inside useLoading");
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        );
        // if error comes out in the refresh request which is obvious to come in the first time login so this is not a big problem and directly goes to the catch block

        // so we did not have any necessity of checking of success key because if error comes then it directly goes from there

        dispatch(setAuth(data)); // we know that the data is a object but we did the destructuring of object in the setAuth Redux action
        setLoading(false);

        // now we have to dispatch the data to the store or the user which we receive from the refresh request
      } catch (error) {
        console.log(error);
        setLoading(false); // if error comes then also we have to remove the loader
      }
    })();
  }, []);

  return { loading };
}
