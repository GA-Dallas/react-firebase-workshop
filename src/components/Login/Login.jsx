import React from 'react';
import styles from './Login.module.css';

function Login(props) {
    return (
        <div className={styles.Login}>
            <button>Login With Google</button>
        </div>
    );
}

export default Login;