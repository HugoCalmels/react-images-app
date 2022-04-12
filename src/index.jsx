import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import "./style.css";
const url = 'https://api.unsplash.com/search/photos?page=1&query='

const App = () => {

  const [searchInput, setSearchInput] = useState('')
  const [lastSearchedInput, setLastSearchedInput] = useState('')
  const [page, setPage] = useState(1)
  const [responseArray, setResponseArray] = useState([])
  const [totalPages, setTotalPages] = useState('')
  const [defaultInput, setDefaultInput] = useState('JavaScript')
  
  const getData = async (input, page) => {
    if (input === '') {
      input = 'JavaScript'
    } else {
      setDefaultInput(input)
    }
    let myHeaders = new Headers({
      'Authorization': `Client-ID ${process.env.REACT_APP_ACCES_KEY}`
    });

    const response = await fetch(`${url}${input}&per_page=20&page=${page}`, {
      headers: myHeaders,
      method: 'GET'
    })
    const data = await response.json()

    return data
  }

  useEffect(() => {
    getData(searchInput, page).then((data) => {
      
      if (searchInput === lastSearchedInput) {
 
        let results = []
        for (let i = 0; i < data.results.length; i++) {
          results.push({regular: data.results[i].urls.regular})
          setResponseArray([...responseArray,results])
        }
        setResponseArray(responseArray.concat(results))

      } else {
        setTotalPages(data.total_pages)
         let results = []
      for (let i = 0; i < data.results.length; i++) {
        results.push({regular: data.results[i].urls.regular})
      }
      setResponseArray(results)
      }
    })
  }, [searchInput, page])
  

  const makePagination = () => {
    setPage(page + 1)
    setLastSearchedInput(searchInput)
  }


  const openModalForImage = (e) => {

    let res = document.querySelector(`.hidden-image[data-tag='${e.target.dataset.tag}']`)
    let overlay = document.querySelector('.overlay')
    let container = document.querySelector('.container')
    let header = document.querySelector('.header')
    header.classList.toggle('blur')
    container.classList.toggle('blur')
    overlay.classList.toggle('show')
    setTimeout(() => {
      overlay.classList.toggle('visually')
    }, 20)
    res.classList.toggle('active')
  }

  const closeModal = async () => {
    let res = document.querySelector('.hidden-image.active')
    res.classList.toggle('active')
    let overlay = document.querySelector('.overlay')
    let container = document.querySelector('.container')
    let header = document.querySelector('.header')
    header.classList.toggle('blur')
    container.classList.toggle('blur')

    setTimeout(() => {
      overlay.classList.toggle('visually')
      setTimeout(() => {
        overlay.classList.toggle('show')
      },180)
    }, 200)
  }

  return (
    <div className="app">

      <div className="wrapper">
        <div className="header">
          <h2>Images App</h2>

          <form>
            <input
            id ="input"
              type="text"
              placeholder="search for an image.."
              value={searchInput}
              onChange={(e) => {
                e.preventDefault()
                setSearchInput(e.target.value)
                
              }}
            />
          </form>
        </div>
    
      <div className="container">
        
        {responseArray.length > 0 ? responseArray.map((image, index) => (
        <div className="image-container" key={index}>
            <img className="image" data-tag={index} src={image.regular} onClick={(e) => openModalForImage(e)} />
        </div>
        )) : ""}

          {page < totalPages || defaultInput === 'JavaScript' ?
            <div className="btn-wrapper">
              <div className="show-more-div">
              <button id="btn-show" onClick={makePagination}>Show more</button>
              <span>page : {page}</span>
              </div>
            </div>
            : ""}
            
    </div>
      {responseArray.length > 0 ? responseArray.map((image, index) => (
             <div className="hidden-image" data-tag={index}>
             <img className="modal-image"  src={image.regular} />
             <button className="btn-close-modal" onClick={closeModal}>X</button>
           </div>
            )) : ""}
     
    
      </div>

      
      <div class="overlay" onClick={closeModal}></div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));