// This is where all the vue.js code will live

//NO ARROW FUNCTIONS IN THE FRONT
// (() => {
//   new Vue({
//     el: "#main",
//
//     data: {
//       cities: [
//         { name: "Berlin", country: "DE" },
//         { name: "Mallorca", country: "ES" },
//         { name: "Lisbon", country: "PT" },
//         { name: "CDMX", country: "MX" }
//       ]
//     },
//     mounted: () => {
//       // this fn runs when HTML has loaded
//       //but Vue logic not yet
//       //we use mounted all the time
//       //it's good for making an ajax req to get data(from an API  or DB etc) so the page can load correctly
//       //for example, we'd most likely gt our list of cities from a fb or an API and mounted would be the best place to make the ajax req
//       console.log("vue instance has mounted");
//       //axios is a JS library that's going to allow us make requests to servers
//       var self = this;
//       axios
//         .get("/get-cities")
//         .then(resp => {
//           console.log("response: ", resp.data);
//         })
//         .catch(err => {
//           console.log("err: ", err);
//         });
//     },
//     methods: {
//       //evry function running in response to an event will be defined in methods.
//       myFn: e => {
//         console.log("myFn's running", e);
//         e.target.style.color = "orange";
//         e.target.style.fontSize = "54px";
//
//         this.cities.push({ name: "Bissau", country: "GB" });
//       }
//     }
//   });
// })();
(function() {
  new Vue({
    el: "#main",

    data: {},

    mounted: function() {
      axios.get();
    }
  });
})();
