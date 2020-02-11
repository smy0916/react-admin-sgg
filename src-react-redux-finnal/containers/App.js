// import React from 'react'
// import { connect } from 'react-redux'
import  { connect } from '../lib/react-redux'
import Counter from '../components/Counter'
import { increment, decrement, incrementAsync } from '../redux/actionCreators'

// function mapStateToProps(state){
// 	return ({count: state})
// }
function mapDispatchToProps(dispatch){
  return ({
		increment: number => dispatch(increment(number)),
		decrement: number => dispatch(decrement(number)),
		incrementAsync: number => dispatch(incrementAsync(number))
	})
}

export default connect(
	state => ({count: state}),
	// mapDispatchToProps
	{increment, decrement, incrementAsync}
)(Counter)