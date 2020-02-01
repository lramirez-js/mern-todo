import React, { Component } from 'react'
import Particles from 'react-particles-js'

export default class App extends Component {

    constructor() {
        super()
        this.state = {
            _id: '',
            title: '',
            description: '',
            tasks: [],
            touched: {
                title: false,
                description: false
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteTask = this.deleteTask.bind(this)
    }

    printTasks() {
        return(
            this.state.tasks.map(task => {
                return (
                    <div className="col s12 m4" key={task._id}>
                        <ul className="collapsible" >
                            <li className="active">
                                <div className="collapsible-header ">
                                    {task.title}
                                    <i className="material-icons right"
                                        onClick={() => this.deleteTask(task._id) }>close</i>
                                    <i className="material-icons right"
                                        onClick={() => this.editTask(task._id)}>mode_edit</i>
                                </div>
                                <div className="collapsible-body ">
                                    <span>{task.description}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
            })
        )
    }

    validate(title, description) {
        const errors = {
            title: '',
            description: ''
        }

        if(this.state.touched.title && title.length < 3)
            errors.title = 'Title should be >= 3 chars'
        else if(this.state.touched.title && title.length > 10)
            errors.title = 'Title should be <= 10 chars'

        if(this.state.touched.description && description.length < 3)
            errors.description = 'Description should be >= 3 chars'
        else if(this.state.touched.description && description.length > 1000)
            errors.description = 'Description should be <= 1000 chars'

        return errors
    }

    resetState() {
        this.setState({
            _id: '',
            title: '',
            description: '',
            tasks: [],
            touched: {
                title: false,
                description: false
            }
        })
    }

    handleSubmit(e){
        e.preventDefault()

        this.setState({
            ...this.state,
            touched: {
                title: true,
                description: true
            }
        }, () => {

            const errors = this.validate(this.state.title, this.state.description)

            if(errors.title || errors.description) {
                console.log('There are validation errors in the form.')
                return
            }

            if(this.state._id) {
                // There is an id, edit task
                fetch(`./api/tasks/${this.state._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        M.toast({html: 'Task edited.'})
                        // Reset the state
                        this.resetState()
                        this.getTasks()
                    })
                    .catch(err => alert(err))
            } else {
                // There is no id, save new task
                fetch('./api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        debugger
                        M.toast({html: 'New task saved.'})
                        // Reset the state
                        this.resetState()
                        this.getTasks()
                    })
                    .catch(err => alert(err))
            }
        })
            
    }

    getTasks() {
        fetch('./api/tasks')
            .then(res => res.json())
            .then(data => {
                this.setState({tasks: data.reverse()})
            } )
            .catch(err => alert(err))
    }

    componentDidMount() {
        this.getTasks()
    }

    editTask(id) {
        fetch(`./api/tasks/${id}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    _id: id,
                    title: data.title,
                    description: data.description
                })
                window.scrollTo(0, 0)
            })
            .catch(err => alert(err))
    }

    deleteTask(id){
        if(confirm('Are you sure?')) {
            fetch(`./api/tasks/${id}`, {
                method: 'DELETE',
                body: JSON.stringify(this.state),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    M.toast({html: 'Task deleted.'})
                    // Reset the state
                    this.resetState()
                    this.getTasks()
                })
                .catch(err => alert(err))
        }
    }

    handleChange(e) {
        const { value, name } = e.target
        this.setState({
            ...this.state,
            [name]: value,
            touched: {
                ...this.state.touched,
                [name]: true
            }
        })
    }

    render() {
        const errors = this.validate(this.state.title, this.state.description)
        return(
            <div className="hero-wrap ">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <h1>ToDo</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m6 offset-m3">
                            <div className="card ">
                                <div className="card-content">
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input type="text" id="title" name="title" 
                                                    value={this.state.title} 
                                                    onChange={this.handleChange} 
                                                    placeholder="Title of the task" />
                                                <div className="errors">{errors.title}</div>
                                            </div>
                                            <div className="input-field col s12">
                                                <textarea id="description" name="description" 
                                                    value={this.state.description} 
                                                    onChange={this.handleChange} 
                                                    placeholder="Description of the task" 
                                                    className="materialize-textarea">
                                                </textarea>
                                                <div className="errors">{errors.description}</div>
                                            </div>
                                            <button type="submit" 
                                                className={`btn col s12 darken-4 waves-effect ${(this.state._id) ? 'orange' : 'red'}`} >
                                                {(this.state._id) ? 'Edit task' : 'Save task'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid container-tasks">
                    <div className="row">
                        { this.printTasks() }
                    </div>
                </div>
                <Particles 
                    className="particles-js"                        
                    params={{
                        "particles": {
                            "number": {
                                "value": 80
                            },
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        }
                    }} />

            </div>
        )
    }
}