import React from 'react'
import { Link } from 'react-router-dom';
// The Css file use the default export so we can gave the name according to us.
import styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { logoutUser } from '../../../http';
import { setFullNameKeyRedux, setAvatarKeyRedux } from '../../../store/activateSlice'

const Navigation = () => {

    // Inline CSS for the link or anchor tag 
    const brandStyle = {
        textDecoration: 'none',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '700',
        fontSize: '22px',
    }

    const logoText = {
        marginLeft: '10px',
    }

    const logoImage = {
        height: '30px',
    }
    const dispatch = useDispatch();
    const logoutBtnClick = async () => {
        // make the server Request here for logout the user and redirect it to home page 
        // As i think if you want to logout the user so we have to simply remove the redux store values and then it will automaticlly redirect it to the home page which we set in the app.js 
        try {
            // after making the server request for the logout 
            const { data } = await logoutUser();

            // we know that we receive empty data or data.user as null when we call this logout endpoint on server 
            dispatch(setAuth(data));

            // now we also have to clear the activate slice also 
            dispatch(setFullNameKeyRedux(''));
            dispatch(setAvatarKeyRedux(''));
        }
        catch (err) {
            console.log(err);
        }
    }

    // Taking the isAuth field from the redux store auth slice 
    const { isAuth, user } = useSelector((state) => state.auth);

    // we did not need this because we use the concept of short circuit 
    // making the logout button function which will respond according the isAuth key of the react redux auth slice store 
    // const logoutButtonShow = () => {
    //     // if the authentication is true then it means we have to show the logout button 
    //     if (authentication) {
    //         return { display: 'block', };
    //     }

    //     // it means the authentication is false we did not have to show the logout button
    //     return {
    //         display: 'none',
    //     };
    // }

    return (
        // using Templates literals to provide strings
        <nav className={`${styles.navbar} container`}>
            {/* But the problem is this here that we can not be able to give module style to the child jsx elements so for this we have to write inline css*/}
            <Link style={brandStyle} to="/">
                <img style={logoImage} src="/images/logo.png" alt="logo" />
                <span style={logoText}>Codershouse</span>
            </Link>

            <div className={styles.navRight}>
                {/* This removes the null warning of the user */}
                {user && user.activated && <h3 className={styles.userNameTextNavigation}>{user.name}</h3>}
                {user && user.activated && <Link to="/" className={styles.userAvatarNavigationWrapper}>
                    <img src={user.avatar} className={styles.userAvatarNavigation} alt="user avatar" />
                </Link>}

                {/* you can add a tooltip in the logout button so that user can easily understand and also can add a modal on clicking logout */}
                {isAuth && <button onClick={logoutBtnClick} className={styles.logoutBtn}>
                    <img className={styles.logoutSymbol} src="/images/logout-symbol.png" alt="logout-symbol" />
                </button>}

                {/* // even of making the function we can use the concept of short circuit  */}
                {/* {isAuth && <button onClick={logoutBtnClick} className={styles.logoutBtn}>Logout</button>} */}
                {/* <button onClick={logoutBtnClick} style={logoutButtonShow()}>Logout</button> */}
            </div>


        </nav>
    )
}

export default Navigation