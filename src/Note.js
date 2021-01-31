import React from 'react';
import { Category } from './App'


/* export const Note=({text,link,id,relations})=>{

  let parsedtext;

  var firstpass=text.split("[")
  //console.log(split)
  var splitlist=firstpass.map((item)=>item.split("]"))
  console.log(splitlist)
        return(
          <div class="note">
            {text} <a href={link}> Link </a>
          </div>
        )
    } */


    export const Note=({text,link,id,relations,handler})=>{

      let parsedtext;
      text = text.replace(/\[\[/gi, "~|");
      text = text.replace(/\]\]/gi, "|~");
      var splitlist=text.split("~")

            return(
              splitlist.map((item)=>item.charAt(0)=="|" & item.charAt(item.length-1)=="|" ? 
              <b><Category category={item.substring(1,item.length-1)} handler={handler}/></b> : 
              <span>{item}</span>)
            )
        }

