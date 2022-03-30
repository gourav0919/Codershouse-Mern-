import React, { useState } from 'react'
import styles from './StepName.module.css'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';
import { useDispatch, useSelector } from 'react-redux';
import { setFullNameKeyRedux } from '../../../store/activateSlice';

const StepName = ({ onNext }) => {
    // getting fullName from the redux store
    const { fullName } = useSelector((state) => state.activate);

    // setting fullName in the state of the input name field 
    const [name, setName] = useState(fullName);

    // creating dispathcer
    const dispatch = useDispatch();

    const onNextBtnClick = () => {
        if (!name) {
            return
        }
        // Storing name field in the redux store in the activate slice 
        dispatch(setFullNameKeyRedux(name));
        // here we simply call the onNext function which we receive as a prop from the Activation page 
        onNext();
    }

    return (
        <>
            <div className="cardWrapper">
                <Card title="What’s your full name?" icon="smiley">

                    {/* On the Occurence of onchange event we are changing our state to the new value enter by the user. */}
                    <TextInput placeholder="Your Name" size="25" value={name} onChange={(e) => setName(e.target.value)} />

                    <div>
                        <p className={styles.termsText}>People use real names at codershouse :) </p>
                        <div className={styles.actionButtonWrap}>
                            <Button onClick={onNextBtnClick} btnText="Next" />
                        </div>
                    </div>

                </Card >
            </div>
        </>
    )
}

export default StepName