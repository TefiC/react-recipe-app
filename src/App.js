import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Modal, Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap/lib';
import PropTypes from 'prop-types';

var MainComponent = React.createClass({
	
	componentWillMount: function() {

		var recipesDictValue =  {
			'Pizza': ['Oregano', 'Cheese'],
			'Donuts': ['Chocolate', 'Butter']
		}
		
		if (Object.keys(reactLocalStorage.getObject('recipesDict')).length == 0) {
			reactLocalStorage.setObject('recipesDict', recipesDictValue);
		}
		
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': false})
		
	},
	
	getInitialState: function() {
		return {
			'recipesDict': {},
			'showModal': false
		};	
	},
	
	toggleAddModal: function(state) {
		
		this.updateLocalStorage(state);
		
		var newState = !this.state.showModal;
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': newState});
	},
	
	updateLocalStorage: function(state) {
		var recipesDict = reactLocalStorage.getObject('recipesDict');
		recipesDict[state.recipeName] = state.recipeIngredients;
		reactLocalStorage.setObject('recipesDict', recipesDict);
	},
	
	deleteRecipe: function(recipeName) {
		
		var recipesDict = reactLocalStorage.getObject('recipesDict');
		delete recipesDict[recipeName]
		
		reactLocalStorage.setObject('recipesDict', recipesDict);
		
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': this.state.showModal});
	},
	
	render: function() {
		
		var recipesDict = this.state.recipesDict;
		
		console.log('--------------------------- STARTING AGAIN')
		console.log('---->Inside MainComponent render');
		console.log(recipesDict);
		
		var recipeId = 0
		var updateLocalStorage = this.updateLocalStorage;
		var deleteRecipe = this.deleteRecipe;
		
		var recipesArray = Object.keys(recipesDict).map(function(recipe) {
			recipeId += 1
			return <RecipeContainer onDeleteRecipe={deleteRecipe} onUpdateLocalStorage={updateLocalStorage} recipeName={recipe} recipeIngredients={recipesDict[recipe]} recipeId={recipeId}/>
		});
		
		return (
			<div className="appMainDiv">
				<h1 className="appTitle"> My Recipes </h1>
				<ul>{recipesArray}</ul>
				<RecipeBodyButton  buttonStyle='success' buttonTitle='Add recipe' onModalToggle={this.toggleAddModal} />
				<span className="addButtonContainer">
					<RecipeAddModal show={this.state.showModal} onHide={this.toggleAddModal} />
				</span>
			</div>
		);
	}
});

var RecipeContainer = React.createClass({
	
	recipeName: PropTypes.string,
	recipeIngredients: PropTypes.array,
	recipeId: PropTypes.number,
	onDeleteRecipe: PropTypes.func,
	
	getInitialState: function() {
		return {
			'recipeName': this.props.recipeName,
			'recipeIngredients': this.props.recipeIngredients
		}	
	},
	
	updateContainer: function(state) {
		/*
		 * state is a dictionary
		 */
		console.log('!!! --- State received')
		console.log(state)
		this.props.onUpdateLocalStorage(state);
		this.setState(state);	
	},
	
	render: function() {
		
		console.log('----> RecipeContainer')
		console.log(this.props.recipeName);
		
		return (
			<div>
				<RecipeHeader recipeName={this.props.recipeName} recipeId={this.props.recipeId}/>
				<RecipeBody recipeName={this.props.recipeName} recipeIngredients={this.props.recipeIngredients} recipeId={this.props.recipeId} onUpdateContainer={this.updateContainer} onDeleteRecipe={this.props.onDeleteRecipe}/>
			</div>
		);
	}
});

var RecipeHeader = React.createClass({
	
	recipeId: PropTypes.string,
	recipeName: PropTypes.string,
	onUpdateContainer: PropTypes.func,
	
	/*
	 * SlideToggle the corresponding window with the same id as the header
	 */
	handleUserClick: function() {
		var id = '#' + this.props.recipeId.toString() + '';
		$(id).slideToggle(1000);
	},
	
	render: function() {
		return (
			<div className="recipeHeader" onClick={this.handleUserClick}>
				<p className="headerTextContainer">{this.props.recipeName}</p>
			</div>
		)
	}
});

var RecipeBody = React.createClass({
	
	recipeName: PropTypes.string,
	recipeIngredients: PropTypes.array,
	recipeId: PropTypes.number,
	onDeleteRecipe: PropTypes.func,
	
	getInitialState: function() {
		return {
			showEditModal: false,
			showDeleteModal: false
		};	
	},
	
	toggleEditModal: function(state) {
		
		var newState = !this.state.showEditModal;
		this.updateContainer(state);
		this.setState({showEditModal: newState});
	},
	
	updateContainer: function(state) {
		this.props.onUpdateContainer(state);
	},
	
	toggleDeleteModal: function() {
		var newState = !this.state.showDeleteModal;
		this.setState({showDeleteModal: newState});
	},
	
	getRecipeProperties: function() {
		return {
			'name': this.props.recipeName,
			'ingredients': this.props.recipeIngredients
		}
	},
	
	render: function() {
		
		console.log('----> Recipe body')
		console.log(this.getRecipeProperties());
		
		return (
			<div className="recipeWindow" id={this.props.recipeId.toString()}>
				<RecipeBodyList recipeIngredients={this.props.recipeIngredients}/>
				<RecipeBodyButton buttonStyle="info" buttonTitle="Edit" onModalToggle={this.toggleEditModal}/>
				<RecipeBodyButton buttonStyle="danger" buttonTitle="Delete" onModalToggle={this.toggleDeleteModal}/>
				<RecipeEditModal show={this.state.showEditModal} onHide={this.toggleEditModal} recipeId={this.props.recipeId.toString()} recipeProperties={this.getRecipeProperties()}/>
				<RecipeDeleteModal show={this.state.showDeleteModal} onHide={this.toggleDeleteModal} recipeId={this.props.recipeId.toString()} onDeleteRecipe={this.props.onDeleteRecipe} recipeName={this.props.recipeName}/>
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
		
		return <div className="ingredientsContainer">{parsedIngredientsArray}</div>;
	}
});

var RecipeBodyButton = React.createClass({
	
	onModalToggle: PropTypes.func,
	buttonTitle: PropTypes.string,
	buttonStyle: PropTypes.string,
	
	render: function() {
		
		if (this.props.buttonTitle == "Edit" || this.props.buttonTitle == "Add recipe" || this.props.buttonTitle == "Delete") {
			return <Button className="button" bsStyle={this.props.buttonStyle} onClick={this.props.onModalToggle}>{this.props.buttonTitle}</Button>;
		}
	}
});

var RecipeIngredient = React.createClass({
	
	ingredient: PropTypes.string,
	
	render: function() {
		return <span className="ingredient"><p className="ingredientText">{this.props.ingredient}</p></span>; 
	}
});

// -------------------------------------------------
// MODALS 
// -------------------------------------------------

var RecipeAddModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,
	onUpdateLocalStorage: PropTypes.func,
	
	getInitialState: function() {
		return {
			'recipeName': '',
			'recipeIngredients': ''
		};
	},
	
	handleChange: function() {
		
		this.setState({'recipeName': this.inputName.value, 'recipeIngredients': this.inputIngredients.value});
	},
	
	handleSubmit: function() {
		
		var ingredientsArray = this.formatIngredients(this.state.recipeIngredients);
		
		var state = {
			"recipeName": this.state.recipeName,
			"recipeIngredients": ingredientsArray
		}
		
		this.props.onHide(state);
	},
	
	formatIngredients: function(ingredientsString) {
		var array = ingredientsString.split(',');
		return array;
	},
	
	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Add recipe</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<ControlLabel>
							New Recipe:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputName = input}
								type="text"
								value={this.state.name}
								placeholder= "Enter New Recipe"
								onChange={this.handleChange} />
						</FormGroup>
						<ControlLabel>
							Ingredients for this recipe:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputIngredients = input}
								componentClass="textarea"
								value={this.state.ingredients}
								placeholder= "Enter Ingredients"
								onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.handleSubmit}>Add</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var RecipeEditModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,
	recipeId: PropTypes.number,
	state: PropTypes.object,
	recipeProperties: PropTypes.object,
	
	getInitialState: function() {
		return {
			'recipeName': this.props.recipeProperties.name,
			'recipeIngredients': this.props.recipeProperties.ingredients
		};
	},
	
	handleChange: function() {
		this.setState({'recipeName': this.inputName.value, 'recipeIngredients': this.inputIngredients.value});	
	},
	
	handleSubmit: function(e) {
		
		e.persist();
		
		if (this.state.recipeName != '' && this.state.recipeIngredients != '') {
			
			var ingredientsArray = this.formatIngredients(this.state.recipeIngredients);
			
			var state = {
				'recipeName': this.state.recipeName,
				'recipeIngredients': ingredientsArray
			}
			
			this.props.onHide(state);
		} else {
			alert("You can't set an empty recipe");
		}
		
	},
	
	handleClose: function(e) {
		
		e.persist();
		
		this.props.onHide(this.getInitialState());	
	},
	
	formatIngredients: function(ingredientsString) {
		var array = ingredientsString.split(',');
		return array;
	},
	
	render: function() {
		
		console.log(' ---->Inside modal')
		console.log(' -->Name')
		console.log(this.props.recipeProperties.name)
		console.log('--> Ingredients')
		console.log(this.props.recipeProperties.ingredients)
		
		return (
			<Modal show={this.props.show} onHide={this.handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit recipe</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<ControlLabel>
							Edit recipe name:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputName = input}
								type="text"
								value={this.state.recipeName}
								placeholder= "Edit recipe name"
								onChange={this.handleChange} />
						</FormGroup>
						<ControlLabel>
							Edit ingredients for this recipe:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputIngredients = input}
								componentClass="textarea"
								value={this.state.recipeIngredients}
								placeholder= "Edit Ingredients"
								onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.handleSubmit}>Change</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

var RecipeDeleteModal = React.createClass({
	
	show: PropTypes.bool,
	onHide: PropTypes.func,
	recipeId: PropTypes.number,
	recipeName: PropTypes.string,
	onDeleteRecipe: PropTypes.func,
	
	handleDelete: function(e) {
		console.log('DELETING ----------------------------')
		this.props.onDeleteRecipe(this.props.recipeName);
		this.props.onHide();
	},

	render: function() {
		return (
			<Modal show={this.props.show} onHide={this.props.onHide}>
				<Modal.Header closeButton>
					<Modal.Title>Delete Recipe</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h4>Are you sure you want to delete this recipe?</h4>
					<p>If not, check the x above. If yes, click on Delete </p>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="danger" onClick={this.handleDelete}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

module.exports = MainComponent;
