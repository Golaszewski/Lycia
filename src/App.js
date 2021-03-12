/*global chrome*/

import React, { Component } from 'react';
import logo from './logo.svg';
import backbutton from './back.png'
import forwardbutton from './forward.png'
import './App.css';
import { render } from 'react-dom';
//import { jsPDF } from "jspdf"
//import { usePdf } from 'react-pdf-js';

import { Note } from './Note';

//import pdfjsLib from 'pdfjs-dist';
//import {pdfjs} from 'pdfjs-dist';
const Cite = require('citation-js')


//var pdfjsLib = window['pdfjs-dist/build/pdf']
var pdfjsLib = require("pdfjs-dist")
//const pdfjs = require("pdfjs-dist");
pdfjsLib.GlobalWorkerOptions.workerSrc = "chrome-extension://kelmmpoinikplamgchdcookmeeaehkbl/static/js/pdf.worker.js";
console.log(pdfjsLib.GlobalWorkerOptions)

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


async function getLocalStorageValue(key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value);
      })
    }
    catch (ex) {
      reject(ex);
    }
  });
}


class ScreenshotButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    chrome.runtime.sendMessage({ message: 'inject' })
  }

  render() {
    return (
      <button onClick={this.handleClick}> Take a screenshot</button>
    )
  }
}

var bibliography = []

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.submit(this.state.value)
    event.preventDefault();
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value={this.props.title} />
      </form>
    );
  }
}

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    /* var element={
      data:this.state.value,
      id: getRandomInt(0, 1000000000),
      link:'',
      type:'note'
    } */
    this.props.submit(this.state.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value={this.props.label} />
      </form>
    );
  }
}


var store = []

class NoteList extends React.Component {
  constructor(props) {
    super(props);
  };

  /* handleAddCategory(event) {
    store.dispatch(addCategory(event.target.value));
  } */


  /*   componentDidMount() {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type == "note") {
          //console.log(message)
          this.setState({
            value: message.store
          });
          
          console.log(this.state.value)
          store.push(message.store[message.store.length() - 1])
          console.log("read store")
          console.log(store)
  
          console.log(pdfjsLib)
          var storelength = this.state.value.length - 1
          let loadingTask = pdfjsLib.getDocument(this.state.value[storelength].link);
          loadingTask.promise.then((doc) => {
            console.log('done')
            console.log(doc.numPages)
            var doclength = doc.numPages
            var k
            var i
            for (i = 1; i < doclength & k !== 1; i++) {
  
              doc.getPage(i).then(function (page) {
                page.getTextContent().then(function (textContent) {
                  //console.log(textContent)
                  var linelength = textContent.items.length
                  var j
  
  
                  for (j = 0; j < linelength & k !== 1; j++) {
                    var line = textContent.items[j].str
  
                    if (line.search(/DOI:|doi:|doi\./) !== -1) {
                      //console.log(line)
                      var DOIpattern = '10[.][0-9]{4,}/';
                      var reg = new RegExp(DOIpattern)
                      var found = line.search(reg)
                      if (found == -1) {
                        line = textContent.items[j + 1].str
                        found = line.search(reg)
                      }
                      var doi = line.substring(found).split(" ")[0]
                      //console.log(doi)
                      let example = new Cite(doi)
                      let output = example.format('bibliography', {
                        format: 'html',
                        template: 'apa'
                      })
  
                      output = '<li>' + output + '</li>'
                      bibliography.push(output)
                      k = 1
                    }
                  }
                })
              })
            }
          });
        }
      });
    } */


  render() {
    console.log("notelist")
    console.log(this.props.handler)
    //console.log("reading notelist")
    //console.log(this.props.notelist)
    return (



      this.props.notelist.map((item) =>
        <li><Note text={item.data} link={item.link} id={item.id} handler={this.props.handler} /></li>


        /* this.state.value.map((item) =>
          <Note text={item.data} link={item.link} id={item.id} /> */
      )
    )
  }
}

//NotesList = connect(mapStateToProps)(NotesList)



const ItemTypes = {
  NOTE: 'note'
}






/* const initialState = {
  categories:{}
}

function NoteReduce(state = initialState, action) {
  switch (action.type) {
    case ADD_NEW_CATEGORY:
      const categoryname=action.category
      return Object.assign({}, state, {
        state:{categories: Object.assign({},categories,
          {
            [categoryname]:{
              contains:[]
            }
          })
      }})

    case ADD_LINK:
      const element=action.element
      const category=action.category
      const list=state.categories[category].contains
      const newlist=[...list,element]
      
      return Object.assign({}, state, {
        state: {
          categories: {
            [category]:{
              contains: newlist
            }
          }
        }
      })
        state.categories[category].contains[element])
    }
  }

  const statestore = createStore(NoteReduce)

  export function addCategory(category) {
    return {
      type: ADD_NEW_CATEGORY,
      category
    }
  }

  export function addLink(element,category) {
    return {
      type: ADD_LINK,
      element,
      category
    }
  }


  export const mapStateToProps = state => ({
    state
  }) */


class SetStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    chrome.storage.local.set({ alldata: this.props.categories })
    console.log(chrome.storage.local.get(['alldata'], function (result) {
      console.log(result)
    }))
  }

  render() {
    return (
      <button onClick={this.handleClick}> Store Data </button>
    )
  }
}

class GetStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null
    };
    this.getStore = this.getStore.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getStore(result) {
    this.props.GetStorage(result)
  }

  handleClick() {
    chrome.storage.local.get('alldata', (result) =>
      this.getStore(result.alldata)
      //console.log(result)
    )
  }

  render() {
    return (
      <button onClick={this.handleClick}> Get Data </button>
    )
  }
}


class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: 'Global',
      contains: { 'Global': { elements: [], categories: [], summary: '', img: null } },
      history: [],
      historyindex: 0
    };

    this.DefineNewCategory = this.DefineNewCategory.bind(this);
    this.AddElToCategory = this.AddElToCategory.bind(this);
    this.AddCategoryToCategory = this.AddCategoryToCategory.bind(this);
    this.CategoryHandler = this.CategoryHandler.bind(this);
    this.SetNull = this.SetNull.bind(this)
    this.clickBack = this.clickBack.bind(this)
    this.clickForward = this.clickForward.bind(this)
    this.AddSummary = this.AddSummary.bind(this)
    this.AddTextNote = this.AddTextNote.bind(this)
    this.GetStorageData = this.GetStorageData.bind(this)
    this.ClearData=this.ClearData.bind(this)
  }



  componentDidMount() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message)
      if (message.type == "note") {
        this.setState({
          elements: message.store
        });
        this.AddElToCategory(message.content)
      }
    }
    )
    let currentComponent=this
    var currdata
    getLocalStorageValue(['currdata']).then(function(result){
      currdata=result.currdata
      currentComponent.setState({contains:currdata})
      console.log("logging state in fetch")
      console.log(currentComponent.state)
    })
    
    /* chrome.storage.local.get(['currdata'], function (result) {
      console.log("result")
      console.log(result)
      currdata = result.currdata
      console.log("currdata")
      console.log(currdata)
      this.setState({
        contains: currdata,
        category: "Global"
      })
      console.log("checking state")
      console.log(this.state)
    }
    ) */

    
    //this.setState({contains:currdata})
    console.log("hi")
    console.log(this.state)
    console.log(currdata)

    console.log("after reload")
    console.log(this.state)
  }


  

//const result = await getLocalStorageValue("my-key");


GetStorageData(categories) {
  console.log("fired get")
  this.setState({ contains: categories })
  console.log(this.state.contains)
}

ClearData() {
  this.setState( {
    category: 'Global',
    contains: { 'Global': { elements: [], categories: [], summary: '', img: null } },
    history: [],
    historyindex: 0
  })
  chrome.storage.local.set({ currdata: this.state.contains })
}

AddSummary(data) {
  var contains = this.state.contains
  var category = this.state.category
  contains[category]["summary"] = data
  this.setState({ contains: contains })
  chrome.storage.local.set({ currdata: this.state.contains })
}


AddTextNote(data) {
  var element = {
    data: data,
    id: getRandomInt(0, 1000000000),
    link: '',
    type: 'note'
  }
  var contains = this.state.contains
  var category = this.state.category
  contains[category]["elements"].push(element)
  this.setState({ contains: contains })
  chrome.storage.local.set({ currdata: this.state.contains })
}

DefineNewCategory(category) {
  var contains = this.state.contains
  contains[category] = { elements: [], categories: [], summary: '', img: null }
  this.setState({ contains: contains })
  chrome.storage.local.set({ currdata: this.state.contains })
  console.log(contains)
}

SetNull() {
  this.setState({ category: 'Global' })
}


AddElToCategory(element) {
  var contains = this.state.contains
  var category = this.state.category
  contains[category]["elements"].push(element)
  this.setState({ contains: contains })
  chrome.storage.local.set({ currdata: this.state.contains })
  console.log(contains)
}

AddCategoryToCategory(source) {
  var contains = this.state.contains
  contains[this.state.category]["categories"].push(source)
  if (!contains.hasOwnProperty(source)) {
    this.DefineNewCategory(source)
  }
  this.setState({ contains: contains })
  chrome.storage.local.set({ currdata: this.state.contains })
  console.log(contains)
}

CategoryHandler(selection) {
  console.log(selection)
  var history = this.state.history
  history.push(this.state.category)
  this.setState({
    category: selection,
    history: history,
    historycounter: 0
  })
}

ElementHandler(selection) {
  this.setState({

  })
}

clickBack() {
  var previous
  var historycounter = this.state.historycounter + 1
  if ((this.state.history.length - historycounter) < 1) {
    previous = this.state.history[0]
  }
  else {
    previous = this.state.history[this.state.history.length - historycounter]
  }


  this.setState({
    category: previous,
    historycounter: historycounter,
  })
}

clickForward() {
  var historycounter = this.state.historycounter - 1
  var next
  if (historycounter < 1) {
    next = this.state.history[this.state.history.length]
  }

  else {
    next = this.state.history[this.state.history.length - historycounter]
  }
  this.setState({
    category: next,
    historycounter: historycounter,
  })
}

render() {
  var contains = this.state.contains
  var category = this.state.category
  var summary = this.state.summary

  console.log("in state")
  console.log(this.state)
  console.log("in render")
  console.log(contains)
  let title;
  let notelist;
  let imagelist;
  let categorieslist;

  notelist = []
  imagelist = []
  /* console.log("notelist here")
  console.log(notelist)
  console.log("imagelist here")
  console.log(imagelist) */
  if (category != null) {
    categorieslist = contains[category].categories.map((item) =>
      <div class="category">
        <li>
          <Category category={item} handler={this.CategoryHandler} data={contains[item]} />
        </li>
      </div>
    )
    title = category
    notelist = this.state.contains[category]["elements"].filter(element => element.type == "note");
    imagelist = this.state.contains[category]["elements"].filter(element => element.type == "image");
    console.log("catlist here")
    console.log(categorieslist)
  }
  else if (Object.keys(contains).length > 0) {
    categorieslist = Object.keys(contains).map((item) =>
      <li><Category category={item} handler={this.CategoryHandler} data={contains[item]} /></li>
    )
    title = "No category selected"
    console.log(imagelist)
    //notelist=[]
    //imagelist=[]
  }
  else {
    categorieslist = <span>No categories defined</span>
    title = "No category selected"
    console.log(imagelist)
    //notelist=[]
    //imagelist=[]
  }



  //var notelist=this.state.contains[category]["elements"].filter(element => element.type == "note");


  /* const elementlist=category.elements.map((item)=>
    <Element element={item} handler={this.ElementHandler}/>
  ) */
  return (
    <div class="categories" id="categories">
      <img src={backbutton} onClick={() => this.clickBack()} />
      <img src={forwardbutton} onClick={() => this.clickForward()} />
      <button onClick={this.SetNull}>Global view</button>
      <div>
        <span>Viewing category: </span>
        <div id="title"><b>{title}</b></div>
        <span>Summary: </span>
        <span></span>
      </div>
      <NameForm submit={this.AddCategoryToCategory} title={"Add Category to " + this.state.category} />
      <TextArea submit={this.AddSummary} label="Add summary" />
      <div id="subtitle"><b>Subcategories</b></div>
      <div class="categorieslist"><ul>{categorieslist}</ul></div>
      <div id="subtitle"><b>Text notes</b></div>
      <ul><NoteList notelist={notelist} handler={this.CategoryHandler} /></ul>
      <TextArea submit={this.AddTextNote} label="Add element" />
      <div id="subtitle"><b>Screenshots</b></div>
      <ImageList imagelist={imagelist} />
      <SetStorage categories={this.state.contains} />
      <GetStorage GetStorage={this.GetStorageData} />
      <button onClick={this.ClearData}> Clear Data </button>
    </div>
  )
}
}

/* class Element extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      elements: [],
      contains: contains
    };
  }

  render(){
    return(

    )
  }
} */

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      elements: [],
    };


    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handler(this.props.category)
  }

  handleMouseOver(e) {
    e.preventDefault();
    chrome.runtime.sendMessage({ message: 'popup-modal' })

  }


  render() {
    return (
      <div>
        <span onClick={this.handleClick} onMouseOver={this.handleMouseOver}>
          {this.props.category}
        </span>

        {this.props.data.summary}
      </div>
    )
  }
}




class Bibliography extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: [],
      listhtml: ''
    };
  }
  componentDidMount() {

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.setState({
        html: bibliography
      });

      var biblist = this.state.html.join()
      biblist = "<ul>" + biblist + "</ul>"
      this.setState({ listhtml: biblist })

    });

  }

  render() {


    return (
      <div dangerouslySetInnerHTML={{ __html: this.state.listhtml }} />
    )
  }
}


class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };
  }


  render() {

    console.log("imagelist")
    console.log(this.props.imagelist)
    return (
      this.props.imagelist.map((item) =>
        <li>{<img src={item.imgcode} width={item.width} height={item.height} />}</li>

      )
    )
  }
}





class App extends Component {
  render() {
    return (
      <div className="App">
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ScreenshotButton />
        <Categories />
        <ul>
          <Bibliography />
        </ul>
      </div>
    );
  }
}

export { Category };
export default App;
