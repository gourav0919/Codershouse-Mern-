import React from 'react'
import Button from '../../components/shared/Button/Button'
import Card from '../../components/shared/Card/Card'
import styles from './Home.module.css'
import { useNavigate } from 'react-router';

const Home = () => {
    const navigate = useNavigate();

    const registerUser = () => {
        console.log("Register User or Login User Process Started.");

        // now redirect user to the home page.
        navigate("/authenticate");
    }

    return (
        <div className="cardWrapper">
            <Card title="Welcome to Codershouse!" icon="logo">
                <p className={`${styles.description}`}>We’re working hard to get Codershouse ready for everyone! While we wrap up the finishing youches, we’re adding people gradually to make sure nothing breaks :)</p>

                <div className={`${styles.getUsernameWrapper}`}>
                    <Button onClick={registerUser} btnText="Let's Go" />
                </div>

                <div className={`${styles.linksWrapper}`}>
                    <span className={`${styles.inviteText}`}>Hava an invite Text?</span>
                </div>
            </Card >
        </div >
    )
}

export default Home;



// Because we did not use the sign In Link 
// const signInCSS = {
//     fontWeight: 'bold',
//     textDecoration: 'none',
//     marginLeft: '10px',
//     color: '#0077ff',
// };

{/* <Link to="/login" style={signInCSS}>Sign in</Link> */ }
{/* <Link to="/login" className={`${styles.signIn}`}>Sign in</Link> */ }