import React from 'react'

const Dashboard = (props) => (
    <div>
        <h5>Here are your todos</h5>
        <div>
            {
                props.todos.map(todo => (
                    <h6 key={todo.id}>
                        {todo.text}
                    </h6>
                ))
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