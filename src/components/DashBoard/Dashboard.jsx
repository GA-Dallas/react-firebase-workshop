import React from 'react'

const Dashboard = (props) => (
    <div>
        <h5>Here are your todos</h5>
        <button onClick={props.handleLogout}>Logout</button>
        <div>
            {
                props.todos.map(todo => (
                    <h6 key={todo.id}>
                        <span 
                        onClick={() => props.handleRemove(todo.id)}>
                        X</span> {todo.text}
                    </h6>
                ))
            }
        </div>
        <form onSubmit={props.handleSubmit}>
            <input
            name="text" 
            value={props.text} 
            onChange={props.handleChange}
            />
            <button>Add Todo</button>
        </form>
    </div>
)

export default Dashboard