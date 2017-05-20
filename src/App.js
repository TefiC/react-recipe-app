import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Modal, Button, FormControl } from 'react-bootstrap/lib';
import PropTypes from 'prop-types';

var MainComponent = React.createClass({
	
	componentWillMount: function() {
		
		var recipesDictValue =  {
			'Pizza': ['Oregano', 'Cheese'],
			'Donuts': ['Chocolate', 'Butter']
		};
		
		if (reactLocalStorage.getObject('recipesDict') !== undefined) {
			reactLocalStorage.setObject('recipesDict', recipesDictValue);
		}

	},
	
	getInitialState: function() {
		return {
			'recipesDict': reactLocalStorage.getObject('recipesDict'),
			'showModal': false
		};	
	},
	
	toggleModal: function() {
		var newState = !this.state.showModal;
		this.setState({showModal: newState});
	},
	
	render: function() {
		
		var recipesDict = this.state.recipesDict;
		var recipeId = 0
		
		var recipesArray = Object.keys(recipesDict).map(function(recipe) {
			recipeId += 1
			return <RecipeContainer recipeName={recipe} recipeIngredients={recipesDict[recipe]} recipeId={recipeId}/>
		});
		
		return (
			<div>
				<h1> Menu </h1>
				<ul>{recipesArray}</ul>
				<RecipeBodyButton  buttonStyle='warning' buttonTitle='Add recipe' onModalToggle={this.toggleModal} />
				<RecipeAddModal show={this.state.showModal} onHide={this.toggleModal} />
			</div>
		)
		
	}
});

var RecipeContainer = React.createClass({
	
	recipeName: PropTypes.string,
	recipeIngredients: PropTypes.array,
	recipeId: PropTypes.number,
	
	render: function() {
		return (
			<div>
				<RecipeHeader recipeName={this.props.recipeName} recipeId={this.props.recipeId}/>
				<RecipeBody recipeIngredients={this.props.recipeIngredients} recipeId={this.props.recipeId}/>
			</div>
		);
	}
});

var RecipeHeader = React.createClass({
	
	recipeId: PropTypes.string,
	recipeName: PropTypes.string,
	
	handleUserClick: function() {
		
		var id = '#' + this.props.recipeId.toString() + '';
		
		$(id).slideToggle(1000);
	},
	
	render: function() {
		return <div className="recipeHeader" onClick={this.handleUserClick}>{this.props.recipeName}</div>;
	}
});

var RecipeBody = React.createClass({
	
	recipeIngredients: PropTypes.array,
	recipeId: PropTypes.number,
	
	getInitialState: function() {
		return {
			showEditModal: false,
			showDeleteModal: false
		};	
	},
	
	toggleEditModal: function() {
		var newState = !this.state.showEditModal;
		this.setState({showEditModal: newState});
	},
	
	toggleDeleteModal: function() {
		var newState = !this.state.showDeleteModal;
		this.setState({showDeleteModal: newState});
	},
	
	render: function() {
		
		return (
			<div id={this.props.recipeId.toString()}>
				<RecipeBodyList recipeIngredients={this.props.recipeIngredients}/>
				<RecipeBodyButton buttonStyle="primary" buttonTitle="Edit" onModalToggle={this.toggleEditModal}/>
				<RecipeBodyButton buttonStyle="primary" buttonTitle="Delete" onModalToggle={this.toggleDeleteModal}/>
				<RecipeEditModal show={this.state.showEditModal} onHide={this.toggleEditModal} recipeId={this.props.recipeId.toString()} />
				<RecipeDeleteModal show={this.state.showDeleteModal} onHide={this.toggleDeleteModal} recipeId={this.props.recipeId.toString()} />
			</div>
		);
		
	}
});

var RecipeBodyList = React.createClass({
	
	render: function() {
		
		var ingredientsArray = this.props.recipeIngredients;
		
		var parsedIngredientsArray = ingredientsArray.map(function(ingredient) {
			return <RecipeIngredient ingredient={ingredient}/>;
		});
		
		return <div>{parsedIngredientsArray}</div>;
	}
});

var RecipeBodyButton = React.createClass({
	
	onModalToggle: PropTypes.func,
	buttonTitle: PropTypes.string,
	buttonStyle: PropTypes.string,
	
	render: function() {
		
		if (this.props.buttonTitle == "Edit" || this.props.buttonTitle == "Add recipe" || this.props.buttonTitle == "Delete") {
			return <button dsStyle={this.props.buttonStyle} onClick={this.props.onModalToggle}>{this.props.buttonTitle}</button>;
		}
	}
});

var RecipeIngredient = React.createClass({
	
	ingredient: PropTypes.string,
	
	render: function() {
	 return <span className="ingredient">{this.props.ingredient}</span>; 
	}
});


// MODALS 

var RecipeAddModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,

	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Add recipe</h4>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.onHide}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var RecipeEditModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,
	recipeId: PropTypes.number,

	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Edit data</h4>
					<p>Modal id {this.props.recipeId} </p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.onHide}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var RecipeDeleteModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,
	recipeId: PropTypes.number,

	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Modal heading</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Delete data</h4>
					<p>Modal id {this.props.recipeId} </p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.props.onHide}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

module.exports = MainComponent;
