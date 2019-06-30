import React from 'react'

const Login = (props) => (
    <div>
        <h3>Please Login Below</h3>
        <button onClick={props.handleLogin}>
            Login With Google
        </button>
    </div>
)

export default Login