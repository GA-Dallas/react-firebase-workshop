import React from 'react';
import styles from './Main.module.css';

function Main({text, todos, handleChange, handleSubmit }) {
    return (
        <main className={styles.Main}>
            <div>Here are your Todos</div>
            <ul>
                {
                    todos.map((todo, idx) => <li key={idx}>{todo.text}</li>)
                }
            </ul>
            <form onSubmit={handleSubmit}>
                <input value={text} onChange={handleChange} name="text"/>
                <button>Add Todo</button>
            </form>
        </main>
    );
}

export default Main;