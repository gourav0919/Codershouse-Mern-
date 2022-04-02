import React, { useState } from 'react'
import styles from './StepOtp.module.css'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { verifyOtp } from '../../../http';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';



const StepOtp = ({ onNext }) => {
    const [otp, setOtp] = useState('');
    const dataFromStore = useSelector((state) => state.auth.otp);

    const dispatch = useDispatch();

    const onNextBtnClick = async () => {
        const { phone, hash } = dataFromStore;

        // This is the basic validation we can add some more validation like making showing to user an alert why the next page is not loaded like fill all of the fields and more 
        if (!otp || !phone || !hash) return;

        // This data is that data which is received as a response from the verify otp request
        // we get phone and hash from the redux store and otp from the input fields for which we have state
        try {
            // console.log("data");
            // After this step it stops working if the otp is incorrect

            // If invalid then the server is going to be shutdown so we will have to do something to stop shutting the server 
            // i write this data because axios sent us the data object key which contains the response come from the server 
            const { data } = await verifyOtp({ otp, phone, hash });

            // Even if invalid otp then did not run this line
            // console.log(data);
            // console.log(data.success);
            // console.log(data.user);

            dispatch(setAuth(data));
            // onNext(); // now due to frontend semiprotected or protected routes we did not need this 

            // now we have to store the user in the redux store 
            // console.log(data);
        } catch (error) {
            console.log(error);
        }


        // now in this data obj we have 2 things first is success true and second is the access token 

        // Before calling onNext we have to do the several works 
    }
    return (
        <>
            <div className="cardWrapper">
                <Card title="Enter the code we just texted you" icon="lock">
                    <TextInput size="15" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <div>
                        <p className={styles.resendBtnText}>Didn’t receive? Tap to resend</p>
                        <div className={styles.actionButtonWrap}>
                            <Button onClick={onNextBtnClick} btnText="Next" />
                        </div>
                    </div>
                </Card >
            </div>
        </>
    )
}

export default StepOtp