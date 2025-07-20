const movieList = document.getElementById("movie-list")
const watchList = document.querySelector(".watch-list")
const searchBar = document.getElementById("search-bar")
const searchBtn = document.getElementById("search-btn")
const pageLink = document.querySelector(".page-link")

const savedMovies = []
const storedArray = JSON.parse(localStorage.getItem("movies"))

if(storedArray)
{
    renderWatchList(storedArray)
    localStorage.setItem("movies", JSON.stringify(storedArray))
}

if(searchBtn || searchBar)
    {
        searchBtn.addEventListener('click', getData)
        searchBar.addEventListener('keydown', (e) => {
            if(e.key === 'Enter')
            {
                getData()
            }
        })
    }

document.addEventListener('click', (e) => {
        if(e.target.dataset.add)
        {
            fetch(`https://www.omdbapi.com/?apikey=f54021a&i=${e.target.dataset.id}&plot=short`)
                .then(response => response.json())
                .then(data => {
                    if(storedArray)
                    {
                        storedArray.push(data)
                        localStorage.setItem("movies", JSON.stringify(storedArray))
                    }
                    else
                    {
                        savedMovies.push(data)
                        localStorage.setItem("movies", JSON.stringify(savedMovies))
                    }
                })
            e.target.parentNode.textContent = " Added to Your Watchlist"
        }
        else if(e.target.dataset.remove)
        {
            const selectedMovie = storedArray.filter(item => item.imdbID === e.target.dataset.id)
            const selectedIndex = storedArray.indexOf(selectedMovie[0])
            storedArray.splice(selectedIndex, 1)
            renderWatchList(storedArray)
            localStorage.setItem("movies", JSON.stringify(storedArray))        
        }
})

async function getData() {
    const res = await fetch(`https://www.omdbapi.com/?apikey=f54021a&s=${searchBar.value}&type=movie`)
    const data = await res.json()
    console.log(data)
    searchBar.value = ""
    movieList.innerHTML = ""
    data.Search.forEach(movie => {
        fetch(`https://www.omdbapi.com/?apikey=f54021a&i=${movie.imdbID}&plot=short`)
            .then(response => response.json())
            .then(data => {
                movieList.innerHTML += `
                <div class="movie-card">
                    <div class="movie-img-container">
                        <img src=${data.Poster}>
                    </div>
                    <div class="movie-info">
                        <h2>${data.Title}<span class="rating-text"><img id="star-img" src="./assets/star.png">${data.imdbRating}</span></h2>
                        <p>${data.Runtime}<span class="genre-text">${data.Genre}</span><span class="checked"><img class="plus-minus-img" src="./assets/plus.png" data-add="add" data-id=${data.imdbID}>Watchlist</span></p>
                        <p id="plot">${data.Plot}</p>
                    </div>
                </div>`
            })
    })
}

function renderWatchList(arr) {
    if(watchList)
    {
        watchList.innerHTML = ""
        arr.map(element => {
                watchList.innerHTML += `
                    <div class="movie-card">
                        <div class="movie-img-container">
                            <img src=${element.Poster}>
                        </div>
                        <div class="movie-info">
                            <h2>${element.Title}<span class="rating-text"><img id="star-img" src="./assets/star.png">${element.imdbRating}</span></h2>
                            <p>${element.Runtime}<span class="genre-text">${element.Genre}</span><span><img class="plus-minus-img" src="./assets/minus.png" data-remove="remove" data-id=${element.imdbID}>Remove</span></p>
                            <p id="plot">${element.Plot}</p>
                        </div>
                    </div>`
            })
    }
}