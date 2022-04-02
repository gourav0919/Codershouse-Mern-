import React, { useState } from 'react';
import styles from './StepPhoneEmail.module.css';
import Phone from './Phone/Phone';
import Email from './Email/Email';


const phoneEmailMap = {
    phone: Phone,
    email: Email,
}

const StepPhoneEmail = ({ onNext }) => {
    const [informationType, setInformationType] = useState('phone');
    const InformationTypePage = phoneEmailMap[informationType];


    return (
        <>
            <div className="cardWrapper">
                <div>
                <div className={styles.changeInformationButtons}>
                    {/* This buttons is used for change in the information style */}
                    <button className={`${styles.tabButtons} ${informationType === 'phone' ? styles.active : ''}`} onClick={() => setInformationType('phone')}>
                        <img src="/images/phone_information.png" alt="phone" />
                    </button>
                    <button className={`${styles.tabButtons} ${informationType === 'email' ? styles.active : ''}`} onClick={() => setInformationType('email')}>
                        <img src="/images/email_information.png" alt="email" />
                    </button>
                </div>
                {/* onNext is the function which can be used to go to the next page of the authentication process */}
                <InformationTypePage onNext={onNext} />
                </div>
            </div>
        </>
    )
}

export default StepPhoneEmail;






// This function is used for the change in the information type page
    // const changeInformationType = () => {
    //     if (informationType === "phone") {
    //         setInformationType('email');
    //     }
    //     else {
    //         setInformationType('phone');
    //     }
    // }