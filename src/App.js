import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import {} from 'react-bootstrap/lib';


var MainComponent = React.createClass({
	
	getInitialState: function() {
		return {
			'recipesDict': {
				'Pizza': ['Oregano', 'Cheese'],
				'Donuts': ['Chocolate', 'Butter']
			}
		}
	},
	
	
	render: function() {
		
		var recipesDict = this.state.recipesDict;
		var recipeId = 0
		
		var recipesArray = Object.keys(recipesDict).map(function(recipe) {
			recipeId += 1
			return <RecipeContainer recipeName={recipe} recipeIngredients={recipesDict[recipe]} recipeId={recipeId}/>
		});
		
		return <ul>{recipesArray}</ul>
		
	}
});

var RecipeContainer = React.createClass({
	render: function() {
		return (
			<div>
				<RecipeHeader recipeName={this.props.recipeName} recipeId={this.props.recipeId}/>
				<RecipeBody recipeIngredients={this.props.recipeIngredients} recipeId={this.props.recipeId}/>
			</div>
		)
	}
});

var RecipeHeader = React.createClass({
	
	handleUserClick: function() {
		
		var id = '#' + this.props.recipeId.toString() + '';
		
		$(id).slideToggle(1000);
	},
	
	render: function() {
		return <div className="recipeHeader" onClick={this.handleUserClick}>{this.props.recipeName}</div>
	}
});

var RecipeBody = React.createClass({
	render: function() {
		
		return (
			<div id={this.props.recipeId.toString()}>
				<RecipeBodyList recipeIngredients={this.props.recipeIngredients}/>
				<RecipeBodyButton buttonStyle="primary" buttonTitle="Edit"/>
				<RecipeBodyButton buttonStyle="primary" buttonTitle="Delete"/>
			</div>
		)
		
	}
});

var RecipeBodyList = React.createClass({
	render: function() {
	 var ingredientsArray = this.props.recipeIngredients;
		
		var parsedIngredientsArray = ingredientsArray.map(function(ingredient) {
			return <RecipeIngredient ingredient={ingredient}/>
		})
		
		return <div>{parsedIngredientsArray}</div>
	}
});

var RecipeBodyButton = React.createClass({
	render: function() {
		return <button dsStyle={this.props.buttonStyle}>{this.props.buttonTitle}</button> 
	}
});

var RecipeIngredient = React.createClass({
	render: function() {
	 return <span className="ingredient">{this.props.ingredient}</span> 
	}
});

module.exports = MainComponent;
