import React from 'react'

const Dashboard = (props) => (
    <div>
        <h5>Here are your todos</h5>
        <div>
            {
                /* We'll add our Todos here */
            }
        </div>
        <form onSubmit={props.handleSubmit}>
            <input 
            value={props.text} 
            onChange={props.handleChange}
            />
            <button>Add Todo</button>
        </form>
    </div>
)

export default Dashboard