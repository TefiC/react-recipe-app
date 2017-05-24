import React, { Component } from 'react';
import logo from './logo.svg';
import $ from 'jquery';
import MediaQuery from 'react-responsive';
import 'bootstrap/dist/css/bootstrap.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import { Modal, Button, FormControl, FormGroup, ControlLabel } from 'react-bootstrap/lib';
import PropTypes from 'prop-types';
import './App.css';

var MainComponent = React.createClass({
	
	getInitialState: function() {
		return {
			'recipesDict': {},
			'showModal': false,
			'showNavbar': false
		};	
	},
	
	componentWillMount: function() {

		var recipesDictValue =  {
			'Pizza': {'ingredients': ['Oregano', 'Cheese'], 'instructions':'Mix all ingredients in a bowl...'},
			'Donuts': {'ingredients':['Chocolate', 'Butter'], 'instructions':'Melt the chocolate and mix...'}
		}
		
		if (Object.keys(reactLocalStorage.getObject('recipesDict')).length == 0) {
			reactLocalStorage.setObject('recipesDict', recipesDictValue);
		}
		
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': false, 'showNavbar': false})
		
	},
	
	toggleAddModal: function(state) {
		
		
		if (state.recipeName != undefined) {
			this.updateLocalStorage(state);
		} 
	
		var newState = !this.state.showModal;
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': newState, 'showNavbar': this.state.showNavbar});
	},
	
	toggleNavbar: function() {
		var newState = !this.state.showNavbar;	
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': this.state.showModal, 'showNavbar': newState});
		
	},
	
	updateLocalStorage: function(state) {
		
		if (state.recipeName != undefined) {
			var recipesDict = reactLocalStorage.getObject('recipesDict');
			recipesDict[state.recipeName] = {'ingredients': state.recipeIngredients, 'instructions':state.recipeInstructions};
			reactLocalStorage.setObject('recipesDict', recipesDict);
		}
	},
	
	deleteRecipe: function(recipeName) {
		
		var recipesDict = reactLocalStorage.getObject('recipesDict');
		delete recipesDict[recipeName]
		
		reactLocalStorage.setObject('recipesDict', recipesDict);
		
		this.setState({'recipesDict': reactLocalStorage.getObject('recipesDict'), 'showModal': false, 'showNavbar': false});
	},
	
	render: function() {
		
		var recipesDict = this.state.recipesDict;
		
		
		var recipeId = 0
		var updateLocalStorage = this.updateLocalStorage;
		var deleteRecipe = this.deleteRecipe;
		
		var recipesArray = Object.keys(recipesDict).map(function(recipe) {
			recipeId += 1

			return 	(
				<RecipeContainer onDeleteRecipe={deleteRecipe} onUpdateLocalStorage={updateLocalStorage} recipeName={recipe} recipeIngredients={recipesDict[recipe].ingredients} recipeInstructions={recipesDict[recipe].instructions} recipeId={recipeId}/>
			)
		});
		
		return (
			<div>
				<AppHeader onBurgerIconClick={this.toggleNavbar}/>
				<SearchBar show={this.state.showNavbar}/>
				<AppJumbotron />
				<div className="appMainDiv">
				
					<RecipesAddButtonTitle onToggleModal={this.toggleAddModal}/>
					
					<RecipesListContainer recipesArray={recipesArray}/>
					
					<hr className="mainHorizontalRule"/>
					
					<SocialMediaBar />
					
					<RecipeAddModal show={this.state.showModal} onHide={this.toggleAddModal} />
					
				</div>
				
				<div className="footerMainContainer"></div>
				
			</div>
		);
	}
});

// -------------------------------------------------
// GENERAL
// -------------------------------------------------

var AppImage = React.createClass({
	
	src: PropTypes.string,
	
	render: function() {
		return <img className={this.props.class} src={this.props.src} style={{width: this.props.width}}/>
	}	
});

// -------------------------------------------------
// APP HEADER 
// -------------------------------------------------

var AppHeader = React.createClass({
	
	onBurgerIconClick: PropTypes.func,
	
	render: function() {
		return (
			<header className="appHeader">
				<AppHeaderTitle />
				<AppHeaderBurgerIcon onBurgerIconClick={this.props.onBurgerIconClick}/>
			</header>
		)
	}	
});

var AppHeaderTitle = React.createClass({
	render: function() {
		return (
			<div className="headerTitleContainer">
				<img className="titleTextImg" src="./appName.png"/>
			</div>
		)
	}	
});

var AppHeaderBurgerIcon = React.createClass({
	
	onBurgerIconClick: PropTypes.func,
	
	render: function() {
		return (
			<div className="burgerLogoContainer" onClick={this.props.onBurgerIconClick}>
				<AppImage class="burgerIcon" src="./burger-menu-icon.png" />
			</div>
		)
	}	
});

// -------------------------------------------------
// SEARCH BAR
// -------------------------------------------------

var SearchBar = React.createClass({
	
	show: PropTypes.bool,
	
	getInitialState: function() {
		return {
			'show': false
		}
	},
	
	componentWillReceiveProps: function(props) {
		if (props.show == true) {
			this.setState({'show': 'flex'});
		} else {
			this.setState({'show': 'None'});
		}
	},
	
	render: function() {
		
		return (
			<div className="searchBarContainer" style={{display: this.state.show}}>
				<Button bsStyle="link">About</Button>
				<Button bsStyle="link">Find</Button>
				<Button bsStyle="link">Contact</Button>
			</div>
			
		)
	}	
});

// -------------------------------------------------
// JUMBOTRON
// -------------------------------------------------

var AppJumbotron = React.createClass({
	
	render: function() {
		return (
			<div>
			
				{/*LARGE SCREEN*/}
				<MediaQuery query='(min-width: 910px)'>
					<div className="jumbotronContainer">
						<h3 className="jumbotronText">Your Best Friend <br /> In The Kitchen!</h3>
						<AppImage class="jumbotronImage secondaryImage" src='./steak-min.jpg'/>
						<AppImage class="jumbotronImage mainImage" src="./dessert-min.jpg"/>
						<AppImage class="jumbotronImage secondaryImage" src="./shrimp-min.jpg"/>
					</div>
				</MediaQuery>
				
				{/*MEDIUM SCREEN*/}
				<MediaQuery query='(min-width: 520px) and (max-width: 910px)'>
					<div className="jumbotronContainer">
						<h3 className="jumbotronText">Your Best Friend <br /> In The Kitchen!</h3>
						<AppImage class="jumbotronImage secondaryImage" src='./steak-min.jpg' width='50%' />
						<AppImage class="jumbotronImage secondaryImage" src="./shrimp-min.jpg" width='50%' />
					</div>
				</MediaQuery>
				
				{/*SMALL SCREEN*/}
				<MediaQuery query='(max-width: 520px)'>
					<div className="jumbotronContainer">
						<h3 className="jumbotronText">Your Best Friend <br /> In The Kitchen!</h3>
						<AppImage class="jumbotronImage mainImage" src="./shrimp-min.jpg" width='100%'/>
					</div>
				</MediaQuery>
				
			</div>
		)
	}	
});




// -------------------------------------------------
// BODY
// -------------------------------------------------
var RecipesAddButtonTitle = React.createClass({
	render: function() {
		return (
			<div className="addButtonTitleContainer">
			
				{/*Large SCREEN*/}
				<MediaQuery query='(min-width: 450px)' className="addButtonTitleContainer">
					<h1 className="appTitle"> Your Recipes </h1>
					<div className="addButtonContainer">
						<RecipeBodyButton  buttonStyle='success' buttonTitle='Add recipe' onModalToggle={this.props.onToggleModal} />
					</div>
				</MediaQuery>
				
				{/*Small SCREEN*/}
				<MediaQuery query='(max-width: 450px)' className="addButtonTitleContainer">
					<h1 className="appTitle" style={{'width': '100%'}}> Your Recipes </h1>
					<div className="addButtonContainer" style={{'width': '100%'}}>
						<RecipeBodyButton  buttonStyle='success' buttonTitle='Add recipe' onModalToggle={this.props.onToggleModal} />
					</div>
				</MediaQuery>
				
				<hr/>
					
			</div>
		)
	}	
});

var RecipesListContainer = React.createClass({
	
	recipesArray: PropTypes.array,
	
	render: function() {
		return <ul className="ingredientsListContainer">{this.props.recipesArray}</ul>
	},

});


// -------------------------------------------------
// INDIVIDUAL RECIPES
// -------------------------------------------------

var RecipeContainer = React.createClass({
	
	recipeName: PropTypes.string,
	recipeIngredients: PropTypes.array,
	recipeInstructions: PropTypes.string,
	recipeId: PropTypes.number,
	onDeleteRecipe: PropTypes.func,
	recipeWidth: PropTypes.string,
	
	getInitialState: function() {
		return {
			'recipeName': this.props.recipeName,
			'recipeIngredients': this.props.recipeIngredients,
			'recipeInstructions': this.props.recipeInstructions
		}	
	},
	
	componentWillReceiveProps: function(props) {
	
		var data = {
			'recipeName': props.recipeName,
			'recipeIngredients': props.recipeIngredients,
			'recipeInstructions': props.recipeInstructions
		}
		
		this.setState(data)
	},
	
	updateContainer: function(state) {
		/*
		 * state is a dictionary
		 */
		console.log('CONTAINER STATE')
		console.log(state)
		
		this.props.onUpdateLocalStorage(state);
		this.setState(state);	
	},

	render: function() {
		
		return (
			<div className="recipeContainer">
				<RecipeHeader recipeName={this.state.recipeName} recipeId={this.props.recipeId}/>
				<RecipeBody recipeName={this.state.recipeName} recipeIngredients={this.state.recipeIngredients}  recipeInstructions={this.state.recipeInstructions} recipeId={this.props.recipeId} onUpdateContainer={this.updateContainer} onDeleteRecipe={this.props.onDeleteRecipe}/>
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
	handleUserClick: function(e) {
		var id = '#window' + this.props.recipeId.toString() + '';
		$(id).slideToggle(700);
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
	recipeInstructions: PropTypes.string,
	recipeId: PropTypes.number,
	onDeleteRecipe: PropTypes.func,
	onUpdateContainer: PropTypes.func,
	
	getInitialState: function() {
		return {
			showEditModal: false,
			showDeleteModal: false
		};	
	},
	
	toggleEditModal: function(statePassed) {
		
		/*
		 * statePassed is an object. Empty if the user clicked on the x button, 
		 * or containing recipeName and recipeIngredients if the user clicked on the change button
		 */
		 
		 console.log('EDIT')
		 console.log(statePassed)
		
		if ( statePassed != {} ) {
			this.updateContainer(statePassed);
		}
		
		var newState = !this.state.showEditModal;
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
			'ingredients': this.props.recipeIngredients,
			'instructions': this.props.recipeInstructions
		}
	},
	
	render: function() {
		
		return (
			<div className="recipeWindow" id={"window" + this.props.recipeId.toString()}>
				<h2 className="ingredientsTitle">..Ingredients..</h2>
				<hr/>
				<RecipeBodyList recipeIngredients={this.props.recipeIngredients} recipeInstructions={this.props.recipeInstructions}/>
				<RecipeBodyButton buttonStyle="info" buttonTitle="Edit" onModalToggle={this.toggleEditModal}/>
				<RecipeBodyButton buttonStyle="danger" buttonTitle="Delete" onModalToggle={this.toggleDeleteModal}/>
				<RecipeEditModal show={this.state.showEditModal} onHide={this.toggleEditModal} recipeId={this.props.recipeId.toString()} recipeProperties={this.getRecipeProperties()}/>
				<RecipeDeleteModal show={this.state.showDeleteModal} onHide={this.toggleDeleteModal} recipeId={this.props.recipeId.toString()} onDeleteRecipe={this.props.onDeleteRecipe} recipeName={this.props.recipeName}/>
			</div>
		);
		
	}
});

var RecipeBodyList = React.createClass({
	
	recipeIngredients: PropTypes.array,
	recipeInstructions: PropTypes.string,
	
	render: function() {
		
		var ingredientsArray = this.props.recipeIngredients;
		
		var parsedIngredientsArray = ingredientsArray.map(function(ingredient) {
			return <RecipeIngredient ingredient={ingredient}/>;
		});
		
		return (
			<div className="ingredientsContainer">
				{parsedIngredientsArray}
				
				
				<p className="ingredientsTitle">..Instructions..</p>
				<hr/>
				<div className="instructionsContainer">
					<p className="instructionsText">{this.props.recipeInstructions}</p>
				</div>
			</div>
		)
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
// SOCIAL MEDIA BAR
// -------------------------------------------------

var SocialMediaBar = React.createClass({
	render: function() {
		return (
			<div className="socialBarContainer">
			
				<h2 className="ingredientsTitle">Follow us on: </h2>
			
				<MediaQuery query='(max-width: 390px)' className="barSecondContainer">
					<SocialMediaIcon width='70%' href="#" src="./twitter.png" />
					<SocialMediaIcon width='70%' href="#" src="./instagram.png" />
					<SocialMediaIcon width='70%' href="#" src="./facebook.png" />
					<SocialMediaIcon width='70%' href="#" src="./linkedin.png" />
				</MediaQuery>
				
				<MediaQuery query='(min-width: 390px) and (max-width: 720px)' className="barSecondContainer">
					<SocialMediaIcon width='30%' href="#" src="./twitter.png" />
					<SocialMediaIcon width='30%' href="#" src="./instagram.png" />
					<SocialMediaIcon width='30%' href="#" src="./facebook.png" />
					<SocialMediaIcon width='30%' href="#" src="./linkedin.png" />
				</MediaQuery>
				
				<MediaQuery query='(min-width: 720px)' className="barSecondContainer">
					<SocialMediaIcon width='19%' href="#" src="./twitter.png" />
					<SocialMediaIcon width='19%' href="#" src="./instagram.png" />
					<SocialMediaIcon width='19%' href="#" src="./facebook.png" />
					<SocialMediaIcon width='19%' href="#" src="./linkedin.png" />
				</MediaQuery>
			
			</div>
		)
	}	
});

var SocialMediaIcon = React.createClass({
	
	width: PropTypes.string,
	src: PropTypes.string,
	href: PropTypes.string,
	
	render: function() {
		return (
			<div className="socialIconContainer" style={{'width': this.props.width}}>
				<a className="socialIconLink" href={this.props.href}>
					<img className="socialIconImgContainer" src={this.props.src} />
				</a>
			</div>
		)
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
			'recipeIngredients': '',
			'recipeInstructions': ''
		};
	},
	
	handleChange: function() {
		
		this.setState({'recipeName': this.inputName.value, 'recipeIngredients': this.inputIngredients.value, 'recipeInstructions': this.inputInstructions.value});
	},
	
	handleSubmit: function() {
		
		var ingredientsArray = this.formatIngredients(this.state.recipeIngredients);
		
		var state = {
			"recipeName": this.state.recipeName,
			"recipeIngredients": ingredientsArray,
			"recipeInstructions": this.state.recipeInstructions
		}
		
		this.props.onHide(state);
		
		this.setState({'recipeName': '', 'recipeIngredients':'', 'recipeInstructions':''})
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
								value={this.state.recipeName}
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
								value={this.state.recipeIngredients}
								placeholder= "Enter Ingredients e.g Flour 3 cups, Butter 250mg"
								onChange={this.handleChange} />
						</FormGroup>
						<ControlLabel>
							Instructions for this recipe:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputInstructions = input}
								componentClass="textarea"
								value={this.state.recipeInstructions}
								placeholder= "Enter Instructions"
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
			'recipeName': '',
			'recipeIngredients': '',
			'recipesInstructions': ''
		};
	},
	
	componentWillReceiveProps: function(props) {
		this.setState({'recipeName': props.recipeProperties.name, 'recipeIngredients': props.recipeProperties.ingredients, 'recipeInstructions':props.recipeProperties.instructions})
	},
	
	handleChange: function() {
		this.setState({'recipeName': this.inputName.value, 'recipeIngredients': this.inputIngredients.value, 'recipeInstructions':this.inputInstructions.value});	
	},
	
	deletePreviousVersion: function(previousName) {
		var recipesDict = reactLocalStorage.getObject('recipesDict');
		delete recipesDict[previousName]
		reactLocalStorage.setObject('recipesDict', recipesDict);
	},
	
	handleSubmit: function(e) {
		
		e.persist();
		
		if (this.state.recipeName != '' && this.state.recipeIngredients != '' && this.state.recipeInstructions != '') {
			
			this.deletePreviousVersion(this.props.recipeProperties.name);
			
			var ingredientsArray = this.formatIngredients(this.state.recipeIngredients);
			
			var state = {
				'recipeName': this.state.recipeName,
				'recipeIngredients': ingredientsArray,
				'recipeInstructions': this.state.recipeInstructions
			}
			
			this.props.onHide(state);
		} else {
			alert("You can't set an empty recipe");
		}
		
	},
	
	handleClose: function(e) {
	
		this.props.onHide({});	
	},
	
	formatIngredients: function(ingredientsString) {
		var array = ingredientsString.split(',');
		return array;
	},
	
	render: function() {
		
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
								placeholder= "Enter Ingredients e.g Flour 3 cups, Butter 250mg"
								onChange={this.handleChange} />
						</FormGroup>
						<ControlLabel>
							Edit Instructions for this recipe:
						</ControlLabel>
						<FormGroup>
							<FormControl 
								inputRef={(input) => this.inputInstructions = input}
								componentClass="textarea"
								value={this.state.recipeInstructions}
								placeholder= "Edit instructions"
								onChange={this.handleChange} />
						</FormGroup>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="warning" onClick={this.handleSubmit}>Change</Button>
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
					<hr/>
					<p>If not, check the x above. If yes, click on Delete </p>
				</Modal.Body>
				<Modal.Footer>
					<Button bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
				</Modal.Footer>
			</Modal>
		);
	}
});

module.exports = MainComponent;
