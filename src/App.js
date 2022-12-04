import React from 'react';
const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query='; // A
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

// const getAsyncStories = () =>  {
//   return new Promise(resolve => setTimeout(() => resolve({data: {stories: initialStories}}), 2000))
//     // return new Promise((resolve, reject) => setTimeout(reject, 2000))

// };

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
const App = () => {
  console.log(`app component rendering`)

const [searchTerm, setSearchTerm] = useSemiPeristentState('value', 'React');
 const [stories, dispatchStories ]= React.useReducer(storiesReducer, {data:[], isLoading: false, isError: false})
React.useEffect(() => {
  console.log('running use effect to setStories')

  if (!searchTerm) return;
  dispatchStories({type: 'STORIES_FETCH_INIT'});
  fetch(`${API_ENDPOINT}${searchTerm}`).then(result => result.json()).then(result => {
    dispatchStories({
      type: 'STORIES_FETCH_SUCCESS',
      payload: result.hits
    })

  }).catch(() => dispatchStories({type: 'STORIES_FETCH_FAILURE'}));
  
}, [searchTerm])

const handleRemoveStory = item => {  
  dispatchStories({type: 'REMOVE_STORY', payload: item})
}

const handleSearch = event => {
  // we have access to the Search components local react event
  setSearchTerm(event.target.value)
}
  
    return (<div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search"onInputChange={handleSearch} value={searchTerm}>
        <strong>Search:</strong>
        <Text />
      </InputWithLabel>

      <hr />
      
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (<p>Loading ...</p>) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory}
        />
      )}

      {/* <List list={stories2}/> */}
    </div>
  );
  };

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

const Text = () => {
  return (
    'textString'
  )
}

export default App;
