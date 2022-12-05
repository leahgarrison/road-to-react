import React from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
  const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];


// const stories2 = [
//   {
//     title: 'React2',
//     url: 'https://reactjs.org/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   },
//   {
//     title: 'Redux2',
//     url: 'https://redux.js.org/',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];
const useSemiPeristentState = (key, initialState) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialState || '')

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];

}
function storiesReducer(state, action) {
  switch(action.type) {
    case 'STORIES_FETCH_INIT': 
      return {...state, isLoading: true, isError: false}
    case 'STORIES_FETCH_SUCCESS':
      return {...state, isLoading:false, isError:false, data: action.payload}
    case 'STORIES_FETCH_FAILURE':
        return {...state, isLoading:false, isError: true}
      case 'REMOVE_STORY':
      return {...state, data: state.data.filter(story => action.payload.objectID !== story.objectID)};
    default:
      throw new Error();
  }
}
// const App = () => {
//   console.log(`app component rendering`)

//   const [searchTerm, setSearchTerm] = useSemiPeristentState('value', 'React');
//   const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
//   const [stories, dispatchStories ]= React.useReducer(storiesReducer, {data:[], isLoading: false, isError: false})
 

//  const handleFetchStories = React.useCallback(async () => {

//     dispatchStories({ type: 'STORIES_FETCH_INIT' });

//     try {
//        const response = await axios.get(url);
//         dispatchStories({
//           type: 'STORIES_FETCH_SUCCESS',
//           payload: response.data.hits,
//         });
//     } catch(e) {
//       dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
//     }
  

//   }, [url]); // E

// React.useEffect(() => {
//     console.log('running use effect to setStories')
//   handleFetchStories();

// }, [handleFetchStories])
   
 

//   const handleRemoveStory = item => {  
//     dispatchStories({type: 'REMOVE_STORY', payload: item})
//   }

//   const handleSearchInput = event => {
//     // we have access to the Search components local react event
//     setSearchTerm(event.target.value)
//   }

//   function handleSearchSubmit(event) {
//     setUrl(`${API_ENDPOINT}${searchTerm}`);
//     event.preventDefault();
//   }
  
//     return (<div>
//       <h1>My Hacker Stories</h1>

//      <SearchForm   
//         searchTerm={searchTerm}
//         onSearchInput={handleSearchInput}
//         onSearchSubmit={handleSearchSubmit}/>
//       <hr />
      
//       {stories.isError && <p>Something went wrong ...</p>}
//       {stories.isLoading ? (<p>Loading ...</p>) : (
//         <List list={stories.data} onRemoveItem={handleRemoveStory}
//         />
//       )}

//       {/* <List list={stories2}/> */}
//     </div>
//   );
// };

class ClassInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        searchTerm: 'React',
    }
  }

  onInputChange(event) {
    console.log('updating searchTerm state')
    this.setState({searchTerm: event.target.value})
  }


  // componentDidUpdate(prevProps) {
  //   console.log(`search term was: ${prevProps.searchTerm} vs new search term: ${this.state.searchTerm}`)
  // }
  render() {
    return (
      <div>
        <input value={this.searchTerm} onChange={(event) => this.onInputChange(event) }></input>
      </div>
    )
  }
}
function App() {
  return (
    <ClassInput />
  )
}
const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);
function List(props) {
  console.log('list component rendering')
  const {list, onRemoveItem} = props;

  return list.map(function(item) {
    const {objectID} = item;
    return (
      <ListItem key={objectID} item={item} onRemoveItem={onRemoveItem}/>
    );
  });
}



function ListItem({item, onRemoveItem}) {
  const {url, title, num_comments, points} = item;
  console.log(`list item rendering with title: ${title}`)
  return (
   <div>
        <span>
          <a href={url}>{title}</a>
        </span>
        <span> Number of comments: {num_comments}</span>
        <span>Points {points}</span>
        <span><button type='button' onClick={() => onRemoveItem(item)}>Dismiss</button></span>
      </div>
  )

}

const InputWithLabel = ({id, children, value, onInputChange, type = "text"}) => {
  console.log(`Searchrendering with searchTerm: ${value}`);
  return (<>
   <label htmlFor={id}>{children} </label>
    &nbsp;
    <input onChange={onInputChange} id={id} type={type}  value={value}/>
    <p>Search Term: <strong>{value}</strong> </p>
  </>)}

export default App;

