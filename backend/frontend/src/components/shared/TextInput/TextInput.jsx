import React from 'react'
import styles from './TextInput.module.css'

const TextInput = (props) => {
    return (
        // The fullwidth sets the width as the container
        <input className={styles.inputBox} style={{ width: props.fullwidth === "true" ? "100%" : "auto" }} type="text" {...props} />

        // here width inherit is not a good choice it gives the width of parent element to the input which we did not want
        // <input className={styles.inputBox} style={{ width: props.fullwidth === "true" ? "100%" : "inherit" }} type="text" {...props} />
    )
}

export default TextInput