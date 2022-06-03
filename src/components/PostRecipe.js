import React, { useState } from 'react'
import { useHistory } from "react-router-dom";

const inputStyles = {
    padding: "10px",
    boxShadow: "0px 0px 0px",
    outline: "10px",
    borderRadius: "15px",
    width: "70%",
    margin: "20px 0",
};


function PostRecipe({ handlePost, category, handlePostCategories }) {

    const history = useHistory();

    // for category tags
    const [categoryData, setCategoryData] = useState([])
    // for ingredients
    const [addInputs, setAddInputs] = useState([""]);
    // for instructions
    const [addSteps, setAddSteps] = useState([""]);
    // for other info
    const [formData, setFormData] = useState({
        name: "",
        image_url: ""
    });
    // for creating new categories
    const [newCategory, setNewCategory] = useState({name: ""})



    // add input fields for ingredients 
    function handleInputs() {
        setAddInputs([...addInputs, ""]);
    }

    // remove input fields for ingredients
    function handleRemoveInputs(index) {
        const list = [...addInputs];
        list.splice(index, 1);
        setAddInputs(list);
    }

    // get input data for ingredients
    function handleInputData(e, index) {
        const {name, value} = e.target;
        const list = [...addInputs];
        list[index] = value;
        console.log(list);
        setAddInputs(list);
    }

    //add input fields for instructions
    function handleSteps() {
        setAddSteps([...addSteps, ""]);
    }

    // remove input fields for instructions
    function handleRemoveSteps(index) {
        const list = [...addSteps];
        list.splice(index, 1);
        setAddSteps(list);
    }

    // get input data for instructions
    function handleStepData(e, index) {
        const {name, value} = e.target;
        const list = [...addSteps];
        list[index] = value;
        console.log(list);
        setAddSteps(list);
    }

    // get input data for name, image_url etc.
    function handleChange(e) {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }

    function handleCategory(e) {
        const {name, value} = e.target;
        console.log(e.target.id)
        console.log(name, value);
        const newId = parseInt(value, 10);
        const cIndex = category.findIndex(item => item.id === newId);
        let tmpObj = {id: newId, name: category[cIndex].name};
        setCategoryData([...categoryData, tmpObj]);
    }

    function handleRemoveCategory(index) {
        const list = [...categoryData];
        list.splice(index, 1);
        setCategoryData(list);
    }


    // POST request to server
    function handleSubmit(e) {
        e.preventDefault();
        fetch("http://localhost:9292/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: formData.name,
                ingredients: addInputs,
                instructions: addSteps,
                image_url: formData.image_url,
                tags: categoryData
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            handlePost(data);
            history.push(`/recipes/${data.id}`);
        });
    }

    function handleCreateCategories(e) {
        const { name, value } = e.target;
        setNewCategory({...newCategory, [name]: value})
    }

    function fetchNewCategory(e) {
        e.preventDefault();
        fetch("http://localhost:9292/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json'
            },
            body: JSON.stringify(newCategory)
        })
        .then(res => res.json())
        .then(data => handlePostCategories(data));
        setNewCategory({name: ""});
    }


  return (
      <>
        <form onSubmit={fetchNewCategory}>
                <p>want a new category?</p>
                <input style={inputStyles} type="text" name="name" value={newCategory.name} onChange={handleCreateCategories} />
                <input type="submit" value="add" />
        </form>
      
        
        <form onSubmit={handleSubmit}>
         <label>Recipe Name: </label>
         <input  style={inputStyles} onChange={handleChange} type="text" name="name" value={formData.name} />
                <br></br>

                <label>Categories: </label>
                <select onChange={handleCategory} name="categories" >
                    <option  defaultValue>add a category?</option>
                        {category.map(c => {
                            return <option key={c.id} value={c.id}>{c.name}</option>
                        })}
                </select>
                {categoryData.name === undefined ? categoryData.map((c, index) => {
                    return (
                            <div key={index}>
                            <input style={inputStyles} type="text" name="categories" value={c.name} onChange={handleCategory} />
                            {/* {categoryData.length -1 === index && (<button  onClick={handleCategoryNum} type="button"> + </button>)} */}
                            {categoryData.length > 1 && (<button onClick={() => handleRemoveCategory(index)} type="button"> X </button>)}
                            </div>
                            )
                }) : null}

      


                <br></br>  
        <label>Image URL: </label>
        <input style={inputStyles} onChange={handleChange} type="text" name="image_url" value={formData.image_url} />
                 <br></br>
        <label>Ingredients: </label>
        <div>
                {addInputs.map((ta, index) => {
                                return (
                                    <div key={index}>
                                        <input style={inputStyles} onChange={(e)=> handleInputData(e,index)} type="text" name="ingredients" value={ta.addInputs}  /> 
                                        {addInputs.length -1 === index &&  (<button  onClick={handleInputs} type="button"> + </button>)}
                                        {addInputs.length > 1 && (<button onClick={() => handleRemoveInputs(index)} type="button"> X </button>)}
                                    </div>)})} 
        </div>

        <label>Instructions: </label>
        <div>
                {addSteps.map((step, index) => {
                                return (
                                    <div key={index}>
                                        <textarea style={inputStyles} onChange={(e)=> handleStepData(e,index)} type="text" name="ingredients" value={step.addSteps}  /> 
                                        {addSteps.length -1 === index &&  (<button  onClick={handleSteps} type="button"> + </button>)}
                                        {addSteps.length > 1 && (<button onClick={() => handleRemoveSteps(index)} type="button"> X </button>)}
                                    </div>)})} 
        </div>

        <input className="formButton submitButton"  type="submit" value="add a recipe" />
    </form>  
      </>
    
  )
}

export default PostRecipe