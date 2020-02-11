import React from 'react'
import PropTypes from 'prop-types'
// import './App.css'
export default class Counter extends React.Component {
	
	static propTypes = {
		count: PropTypes.number.isRequired,
		increment: PropTypes.func.isRequired,
		decrement: PropTypes.func.isRequired,
		incrementAsync: PropTypes.func.isRequired
	}

	constructor(props){
		super(props)
		this.numerRef = React.createRef()
	}

	increment = () => {
		const number = Number(this.numerRef.current.value)
		this.props.increment(number)
	}
	decrement = () => {
		const number = Number(this.numerRef.current.value)
		this.props.decrement(number)
	}
	incrementIfOdd = () => {
		if (this.props.count % 2 === 1) {
			const number = Number(this.numerRef.current.value)
		  this.props.increment(number)
		}
	}
	incrementAsync = () => {
		const number = Number(this.numerRef.current.value)
		this.props.incrementAsync(number)
	}

	render () {
		const count = this.props.count
		return (
			<div>
        <p>click { count } times</p>

				<div>
					<select ref={this.numerRef}>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="2">3</option>
					</select>
					<button onClick={this.increment}>increment</button>	
					<button onClick={this.decrement}>decrement</button>	
					<button onClick={this.incrementIfOdd}>incrementIfOdd</button>	
					<button onClick={this.incrementAsync}>incrementAsync</button>	
				</div>
			</div>
		)
	}
}