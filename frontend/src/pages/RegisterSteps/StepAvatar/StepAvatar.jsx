import React, { useState, useEffect } from 'react'
import styles from './StepAvatar.module.css';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatarKeyRedux } from '../../../store/activateSlice';
import { activateUser } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({ onNext }) => {
    const { fullName, avatar } = useSelector((state) => state.activate);

    const dispatch = useDispatch();


    const [image, setImage] = useState('/images/avatar-default.png');

    // making a state for sendingActivationData
    const [sendingActivationData, setSendingActivationData] = useState(false);

    // creating a state for mounting for removing the warning which is neccessary 
    const [mounted, setMounted] = useState(true);


    const onNextBtnClick = async () => {

        // Basic Validation 
        if (!fullName || !avatar) return;

        // console.log("Now you have to perform the server query for adding theh name and avatar of the user in the database.");  // done
        // now we have to redirect directly to the rooms page so for doing this we have to set in the redux store the user is activated so it automaticlly redirect it to room page 

        // here we have to call the activate user route and set in the database the user as the activated true and the auth slice of the redux store which containt the activate field set it to true also.

        // now here we are starting our request so we have to start the loader here 
        setSendingActivationData(true);

        try {
            // data is the key which contains the response coming from axios requests 
            const { data } = await activateUser({ name: fullName, avatar });

            // This below code only runs if we receive success true which means that user is successfully activated 
            const { success, user } = data;

            if (success) {
                // now setting the user as activated in the redux store 
                // if the component is mounted then only set the redux store else not 
                if (mounted) {
                    dispatch(setAuth({ user })); // This is the asynchronous work so a warning can be displayed on relating to asynchronous works which you can remove by creating an useEffect cleaner function and then calling this dispatch if and only this component is mounted not any other
                    // so for doing this we are going to create a state for the unmounted component and then set true it on cleanup
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            // here after setting the response to the redux store now we can easily exit the loader or showing the original which is shown by the routes itself or if we get the error then also setting it to false 
            setSendingActivationData(false);
        }
    }

    // now the warning goes 
    useEffect(() => {
        return () => {
            setMounted(false);
        }
    }, []);


    // This will give us an event which have some properties we have to go to the target which have an array of object in the files field
    const captureImage = (e) => {
        // This is a array so we can use array index to get the first item from the list of inputs if come 
        const file = e.target.files[0];

        // if we got the file then 
        if (file) {
            // using browsers apis and converting it to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                // so now in this way we convert our string to the base 64 string format 
                setImage(reader.result);
                // console.log(reader.result);
                //  now we have to store it in the redux store 
                dispatch(setAvatarKeyRedux(reader.result));
            };
        }
    }

    // now we have to do the conditional rendering 
    if (sendingActivationData) {
        return (<Loader message="Activation in progress... " />);
    }

    return (
        <>
            <div className="cardWrapper">
                {/* Now making the name as dynamic */}
                <Card title={`Okay, ${fullName}!`} icon="avatar_emoji">

                    <p className={styles.subHeading}>How’s this photo? </p>

                    <div className={styles.imageView}>
                        <img className={styles.image} src={image} alt="Avatar" />
                    </div>

                    <div>
                        <label htmlFor="avatarImageSelection" className={styles.imageFromDevice}>Choose a different photo</label>
                        <input onChange={captureImage} type="file" name="avatarImage" id="avatarImageSelection" className={styles.avatarImageSelection} />
                    </div>

                    <div className={styles.actionButtonWrap}>
                        <Button onClick={onNextBtnClick} btnText="Next" />
                    </div>

                </Card >
            </div>
        </>
    )
}

export default StepAvatar