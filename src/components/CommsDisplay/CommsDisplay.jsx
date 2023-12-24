import React from 'react'
import Styles from './CommsDisplay.module.css'
import GoogleIcon from '../GoogleIcon/GoogleIcon'
import InputWithIcon from '../InputWithIcon/InputWithIcon'

function CommsDisplay({ sentContent, receivedContent, expanded }) {

    return (
        <div className={`${Styles.wrapper} ${expanded ? Styles.expanded : Styles.collapsed}`}>
            <div className={`${Styles.item}`}>
                <h2><GoogleIcon iconName={'upload'} style={{ transform: "translateY(3px)", padding: "8px", borderRadius: "50%", border: "2px solid #eee", margin: "0 4px" }} /> Send</h2>
                <pre>{JSON.stringify(sentContent, null, 2)}</pre>
            </div>
            <div className={`${Styles.item}`}>
                <h2><GoogleIcon iconName={'download'} style={{ transform: "translateY(3px)", padding: "8px", borderRadius: "50%", border: "2px solid #eee", margin: "0 4px" }} /> Receive</h2>
                <pre>{JSON.stringify(receivedContent, null, 2)}</pre>
            </div>
        </div>
    )
}

export default CommsDisplay
