
// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function (tab) {
   // Send a message to the active tab
   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
   });
});


function getRandomInt(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
 }

var store = []
var imagestore = []
const CONTEXT_MENU_ID = "MY_CONTEXT_MENU";
function getword(info, tab) {
   if (info.menuItemId !== CONTEXT_MENU_ID) {
      return;
   }
   console.log(info)

   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTaburl = tabs[0].url
      var activeTab = tabs[0]
      var note={
         data: info.selectionText,
         link: activeTaburl,
         id: getRandomInt(0, 1000000000),
         type:"note"
      }
      store.push(note)

      chrome.tabs.sendMessage(activeTab.id, {
         content:note,
         type: "note",
         imagestore,
         store,
         updatetext: true
      });
   }
   



   /* chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      console.log(activeTab.url)
      chrome.tabs.sendMessage(activeTab.id, {
         type: "note",
         imagestore,
         store,
         updatetext: true
      });
   })
 */
   //console.log("sent")
   //console.log(store)
   )}



chrome.runtime.onMessage.addListener((req, sender, res) => {
   if (req.message === 'capture') {
      chrome.tabs.getSelected(null, (tab) => {
         console.log("background capture")
         chrome.tabs.captureVisibleTab(tab.windowId, /* { format: config.format }, */(image) => {
            crop(image, req.area, req.dpr, /* config.dpr, config.format, */tab.url, (cropped) => {
               res({ message: 'image', image: cropped })
            })
         })
      })
   }
   else if (req.message === 'active') {
      console.log("ice")
      if (req.active) {
         console.log("here now")
         chrome.browserAction.setTitle({ tabId: sender.tab.id, title: 'Crop and Save' })
         chrome.browserAction.setBadgeText({ tabId: sender.tab.id, text: '◩' })
      }
   }
   else if (req.message == "inject") {
      chrome.tabs.query(
         { currentWindow: true, active: true },
         function (tabArray) {
            inject(tabArray[0])
            //console.log(tabArray)
            console.log("injection")
         }
      )
   }
   return true
})

function inject(tab) {
   chrome.tabs.sendMessage(tab.id, { message: 'init' }, (res) => {
      if (res) {
         clearTimeout(timeout)
      }
   })

   var timeout = setTimeout(() => {
      chrome.tabs.insertCSS(tab.id, { file: 'vendor/jquery.Jcrop.min.css', runAt: 'document_start' })
      chrome.tabs.insertCSS(tab.id, { file: 'css/content.css', runAt: 'document_start' })

      chrome.tabs.executeScript(tab.id, { file: 'vendor/jquery.min.js', runAt: 'document_start' })
      chrome.tabs.executeScript(tab.id, { file: 'vendor/jquery.Jcrop.min.js', runAt: 'document_start' })
      chrome.tabs.executeScript(tab.id, { file: 'screenshot.js', runAt: 'document_start' })

      setTimeout(() => {
         chrome.tabs.sendMessage(tab.id, { message: 'init' })
      }, 100)
   }, 100)
}



chrome.contextMenus.removeAll(function () {
   chrome.contextMenus.create({
      title: "Add: %s",
      contexts: ["selection"],
      id: CONTEXT_MENU_ID
   });
});



function crop(image, area, dpr,/* , preserve, format,*/url, done) {
   var top = area.y * dpr
   var left = area.x * dpr
   var width = area.w * dpr
   var height = area.h * dpr
   var renderwidth = width
   var renderheight = height

   if (width > 150 || height > 100) {
      console.log("toobig")

      var ratiowidth = width / 150
      var ratioheight = height / 100

      renderwidth = width / Math.max(ratiowidth, ratioheight)
      renderheight = height / Math.max(ratiowidth, ratioheight)
      console.log(width)

   }
   console.log(width)
   var w = /* (dpr !== 1 && preserve) ? width : */ area.w
   var h = /* (dpr !== 1 && preserve) ? height : */ area.h

   var canvas = null
   if (!canvas) {
      canvas = document.createElement('canvas')
      document.body.appendChild(canvas)
   }
   canvas.width = w
   canvas.height = h

   var img = new Image()
   img.onload = () => {
      var context = canvas.getContext('2d')
      context.drawImage(img,
         left, top,
         width, height,
         0, 0,
         w, h
      )

      var cropped = canvas.toDataURL(`image/png`)
      console.log(url)
      done(cropped)
      var image={ imgcode: cropped, height: renderheight, width: renderwidth, url: url,type:"image" }
      imagestore.push(image)
      console.log(imagestore)

      /* chrome.runtime.sendMessage({
          type: "note",
          store,
          imagestore,
          updatetext: false,
          updatepic:true
      }) */

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         var activeTab = tabs[0];
         chrome.tabs.sendMessage(activeTab.id, {
            type: "note",
            content:image,
            imagestore,
            store
         });
      })

   }

   img.src = image

   console.log("cropped")
}

chrome.contextMenus.onClicked.addListener(getword)