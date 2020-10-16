$(document).ready(function () {


    //=============================================================================
    //---------------JS required for swiper element---------------
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
    //=============================================================================



    // ==================| SETTING UP LOCAL STORAGE |===============================
    if (localStorage.getItem('activeRecipe') === null) {
        localStorage.setItem('activeRecipe', '[]')
    }
    if (localStorage.getItem('listOfMeals') === null) {
        localStorage.setItem('listOfMeals', '[]')
    }
    if (localStorage.getItem('myCookBook') === null) {
        localStorage.setItem('myCookBook','[]')
    }
    // ============================================================================





    // ==============================================================================
    // ----------------- CREATE A FUNCTION TO DISPLAY SELECTED RECIPE----------------

    // Declare function that takes an argument called recipeObj

    function recipeObj(){
        let mealInput = ''
        
           
        if (localStorage.getItem('activeRecipe') !==null){

            var recipeData= JSON.parse(localStorage.getItem("activeRecipe"));

            var recipeImage = $("<div class = 'recipeImage'>");
            recipeImage = $("<img>").attr("src", recipeData[1].thumbnail)//.css({"width":"300px","height":"300px"});

            // console.log(recipeImage);

            $(".recipePic").append(recipeImage);
            
            
            var recipeName = $("<h1>").text(recipeData[0]);

            $("#recipeName").append(recipeName);

            
            var ingredients = recipeData[1].ingredients;
            // console.log(ingredients);
            for (var i=0; i<ingredients.length; i++){
                console.log(i);
                var li = $("<li>").text(ingredients[i]);
                $(".ingredients").append(li);
            }
            
            var instruction = recipeData[1].instruction;
            var pInstruction = $("<p>").text(instruction);
            $(".instructionContainer").append(pInstruction);

            mealInput = recipeData[0];

        }

        
        $.ajax({
            url: `https://api.giphy.com/v1/gifs/search?api_key=us0J0cVGS2H9LjmcpHGBcqjD2X25FYTg&q=${mealInput}&offset=0&rating=g&lang=en`,
            method: 'GET'
        }).then(function (gifyResponse) {
            // Handle data
            console.log(gifyResponse);

            // create an array for all the objects in the gifyResponse.data array
            let gifyArray = gifyResponse.data;
            // log to check if I target what I expected
            // console.log(gifyArray);

            // _________________________________________________________| UK SLIDER FUNCTION CALL |____________
            // Calling the function to actually create the slider
            // createSlider(gifyArray)

            // // Updating slider with gify response ¯\_(ツ)_/¯....
            // Array to store 10 unique random numbers from 0-50
            let limit = createUniqueNumbers(50, 10);
            $('.swiper-slide').each(function (index) {
                // Updating the gify slider with a gify from the api call with the index of the uniqly generated random number
                $(this).css("background-image", "url(" + gifyResponse.data[limit[index]].images.original.url + ")");

                // console.log(gifyResponse.data[index].images.original.url);
            })

        })
    
    
    
    }

    recipeObj();


    // Inside the function create the elements required to put the container together 
    // Example div.(main-container), img.(img-thumbnail), ul.(contain-ingrentes) p.(instructions)
    // After you create the elements set the required values 
    // I will set the data up...
    //  in way that if there is more than one item It will be an array so you can use 
    //  recipeObj.(array-name).forEach(item => { create element and append to parent element})


    // dataStructure for the selected recipe will be an array with two values the name will be array[0]
    // the object containg the recipe info will be array[1] so target the values of array[1] in object like form 
    // example store data like let recipeData = array[1] 
    // let mealTitle = recipeData.name
    // recipeData.name
    // recipeData.thumbnail
    // recipeData.instruction
    // recipeData.ingredients --- returns an array you will have to loop through each one and update.






    //=============================================================================
    // ---------------------HANDLES API CALL FROM USER INPUT-----------------------
    // Function to get responses from the api based on user input
    const getRecipe = mealInput => {
        // Get a list of recipes
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput}`,
            method: 'GET'
        }).then(function (response) {

            // Handle data
            console.log(response);

            if (response.meals !== null) {

                $('#meal-item').addClass('uk-form-success')

                let localArray = [];
                response.meals.forEach(meal => {
                    // setting some arrays up to handle data structure to be used later
                    let mealName = [meal.strMeal];
                    let ingredientsArray = [];

                    // Creating an object to contain data i want to use later
                    let recipeObject = {
                        name: meal.strMeal,
                        thumbnail: meal.strMealThumb,
                        instruction: meal.strInstructions,
                    };


                    // loops through all the data properties that contain ingredients and measurements
                    for (var i = 1; i <= 20; i++) {
                        // creating vars to use a check to see if they contain info or not
                        let testForIngredients = 'strIngredient' + i;
                        let testForAmount = 'strMeasure' + i
                        // var to stor value if its not empty
                        let ingredient = '';

                        // checking if the object properties that contain ingredients have any value.
                        if (meal.hasOwnProperty(testForIngredients) && meal[testForIngredients] !== '' && meal[testForIngredients] !== null) {
                            // If they do add them to a var and push that to an array that conatins all the ingredients from other properties
                            ingredient = `${meal[testForIngredients]} ${meal[testForAmount]}`
                            ingredientsArray.push(ingredient);
                        }
                    }

                    // after checking all object properties for ingredients push to recipe object
                    recipeObject.ingredients = ingredientsArray
                    // adding recipies object to mealName array 
                    mealName.push(recipeObject);
                    // pushing all the info for each seperate meal returned into an array that will be used for other events
                    localArray.push(mealName);

                })



                //=======================================| DONE |=========================================================
                // -- SET THE LOCAL STORAGE TO THE ARRAY CREATED THAT WAY WHEN YOU CLICK ON AN ITEM YOU CAN TARGET
                //--  THAT ITEM IN THE ARRAY AND DISPLAY THE RECIPE INFO TO THE DOM-------------------------------|DONE
                let old_listOfMeals = JSON.parse(localStorage.getItem('listOfMeals')) // MAYBE not useful here but in the function to loop through list items on the dom
                let new_listOfMeals = JSON.stringify(localArray);
                localStorage.setItem('listOfMeals', new_listOfMeals);

                console.log(localArray);


                //===================| CALL FUNCTION HERE TO DISPLAY ALL ITEMS RECIVED FROM AJAX CALL  | ====================
                //------------------put function to display the all the possible meals here.-----------------------
                // a function that will loop through all the items in localArray and display a list to the user
                // =======================================| PSEUDO CODE BELOW |==============================================

                localArray.forEach(item => {
                    let recipeHtmlLink = $('<a>').attr('href', 'recipe.html')
                    let parentDivEl = $('<div>').addClass('uk-flex-middle uk-grid recipe-div');
                    let childDivNameEl = $('<div>').addClass('uk-width-2-3@m');
                    let childDivImageEl = $('<div>').addClass('uk-width-1-3@m uk-flex-first');
                    let thumbnailImageEl = $('<img>').css({ 'width': '70px', 'height': '70px' });
                    let mealNamParagraghEl = $('<p>').addClass('uk-text-lead')

                    let mealName = item[0];
                    let mealThumbnail = item[1].thumbnail;

                    console.log(mealName, mealThumbnail);
                    mealNamParagraghEl.text(mealName);
                    thumbnailImageEl.attr('src', mealThumbnail);
                    childDivImageEl.append(thumbnailImageEl);
                    childDivNameEl.append(mealNamParagraghEl);
                    parentDivEl.append(childDivNameEl, childDivImageEl);
                    recipeHtmlLink.append(parentDivEl);

                    $('#meal-list').append(recipeHtmlLink, $('<hr>'));



                })


            } else if ($('#meal-item').hasClass('uk-form-success')) {
                $('#meal-item').removeClass('uk-form-success');
                $('#meal-item').addClass('uk-form-danger');
            }


        })
            .then(function () {
                // Get a gify

                $.ajax({
                    url: `https://api.giphy.com/v1/gifs/search?api_key=us0J0cVGS2H9LjmcpHGBcqjD2X25FYTg&q=${mealInput}&offset=0&rating=g&lang=en`,
                    method: 'GET'
                }).then(function (gifyResponse) {
                    // Handle data
                    console.log(gifyResponse);

                    // create an array for all the objects in the gifyResponse.data array
                    let gifyArray = gifyResponse.data;
                    // log to check if I target what I expected
                    // console.log(gifyArray);

                    // _________________________________________________________| UK SLIDER FUNCTION CALL |____________
                    // Calling the function to actually create the slider
                    // createSlider(gifyArray)

                    // // Updating slider with gify response ¯\_(ツ)_/¯....
                    // Array to store 10 unique random numbers from 0-50
                    let limit = createUniqueNumbers(50, 10);
                    $('.swiper-slide').each(function (index) {
                        // Updating the gify slider with a gify from the api call with the index of the uniqly generated random number
                        $(this).css("background-image", "url(" + gifyResponse.data[limit[index]].images.original.url + ")");

                        // console.log(gifyResponse.data[index].images.original.url);
                    })

                })
            })
    }

    // =============================================================================








    //==========================| CREAT UK SLIDER |=====================================================
    // -------------- FUNCTION TO UPDATE DOM WITH A SLIDER OF GIFY IMG'S -------------

    // This function takes an array as an argument
    // const createSlider = array => {
    //     // Setting up 
    //     let unorderdListItem = $('<ul>');
    //     $('#gify-slider').empty();
    //     unorderdListItem.addClass('uk-slider-items uk-child-width-1-3@s uk-child-width-1-4@')

    //     // loops through each array item and create an Img element with the stored url I want to use 
    //     array.forEach(item => {
    //         // Creating jquery img element
    //         let imgEL = $('<img>');
    //         // Create a list item to append to ul on the dom.
    //         let listItemEl = $('<li>').css({'width': '200px', 'margin': '2.5px'});
    //         // create a var to store this array items orginal url 
    //         let imageUrl = item.images.fixed_width.url
    //         // check its value to make sure its what I want 
    //         // console.log(imageUrl);
    //         // Once I know what what url is set the attr value with stored var and set other styles after 
    //         imgEL.attr('src', imageUrl).attr('alt', 'funny gif about the food').css({'width': '200px', 'height': '200px'});
    //         // appends img to the listItem created 
    //         listItemEl.append(imgEL);
    //         // Appends the listItem containing the img created all to the ul in the html document.
    //         unorderdListItem.append(listItemEl);
    //     })
    //     $('#gify-slider').append(unorderdListItem);
    // }
    //===============================================================================



    //===================| Function to return an array of numbers that are all unique |==========
    // This function takes a max number for the limit of a random number a random number from (0-maxNumber)
    // and the amount of numbers you want to return for exammple I want to return 10 unique numbers from 0-10 it will
    // generate an array of numbers from 0-10 in a random order never returning the same number twice.
    // only works if amount is === or lager than the max number.
    const createUniqueNumbers = (maxNum, amount) => {
        // Checking if the too make sure there will not be an ifinit loop
        if (maxNum >= amount) {

            // function for creating a random number from an arg that is the limit.
            const getRandomNumber = limit => {
                let num = Math.floor(Math.random() * limit)
                return num;
            }

            // Array to store randomly generated numbers.
            let numberList = [];
            console.log(numberList, ' =====');

            // For loop to make sure you create numbers until you meat the amount called for.
            for (var i = 0; i < amount; i++) {
                console.log(i);
                // Var for storing a random number
                let randomNum = getRandomNumber(maxNum);
                // Check for seeing if the number already exists.
                let checkNumberList = true;

                // If the i is greater than 0 meaning only loop throgh the numberlist array if it has a value.
                if (i > 0) {
                    // Loop through number list array to do ...
                    numberList.forEach(num => {
                        // check if the numebr is already in the arrray 
                        if (randomNum === num) {
                            // If the check passes cancel out the increment for i and set the check to false.
                            checkNumberList = false;
                            i--;
                        }
                    })
                }
                // If the number generated was unique and not already in the array add the new number.
                if (checkNumberList === true) {
                    numberList.push(randomNum);
                }
                // else loop through agian again trying to generate a unique number.
            }
            return numberList
            // returning an error to let them know the problem
        } else {
            return 'Error you broke my code! :(   jk I checked for that ;)'
        }


    }

    const blinkGreen = () => {
        $('nav button').addClass('blink-green');
        setTimeout(function(){ 
            $('nav button').removeClass('blink-green')
         }, 200);
    }




    //----------------EXAMPLE OF THE EVENT HANDLER FUNCTION FOR GETTING A RECIPE--------------
    // select input  and get value from it 
    $('#searchBtn').on('click', function(event) {
        event.preventDefault();
        let inputValue = $('#meal-item').val();

        console.log(inputValue);
        getRecipe(inputValue);

        $('.swiper-container').css('visibility', 'visible');
        $('#meal-container').css('display', 'block');
        $('#meal-list').empty();


    })

    $('#meal-container').on('click', 'div.recipe-div', function () {
        let mealText = $(this).text();
    
        console.log(mealText);
        console.log('-----');
    
        let recipeArray = JSON.parse(localStorage.getItem('listOfMeals'));
        let recipeToStore = JSON.parse(localStorage.getItem('activeRecipe'))
    
        recipeArray.forEach(recipe => {
            if (mealText === recipe[0]) {
    
                console.log(recipe[1]);
    
    
                recipeToStore = recipe;
    
            }
        })
        localStorage.setItem('activeRecipe', JSON.stringify(recipeToStore));
    
    })
    
    
    // Event listener on a saveRecipe button to save Curently displayed recipe to the 
    // localStorage object that conatins the saved recipes
    $('#saveRecipe').on('click', function() {
        let activeRecipe = JSON.parse(localStorage.getItem('activeRecipe'));
        let old_myCookBook = JSON.parse(localStorage.getItem('myCookBook'));
    
        let testRecipe = true;
        old_myCookBook.forEach(item => {
            if (item[0] === activeRecipe[0]) {
                testRecipe = false;
            }
        });
    
        if (testRecipe === true) {
            old_myCookBook.push(activeRecipe)
            blinkGreen();
        }
    
        let new_myCookBook = JSON.stringify(old_myCookBook);
        localStorage.setItem('myCookBook', new_myCookBook);
        
    })
    


})


