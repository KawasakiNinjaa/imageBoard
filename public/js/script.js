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
  Vue.component("funky-chicken", {
    //data is a Fn that returns an objct
    data: function() {
      return {
        name: "Funky Chicken"
      };
    }
  });

  new Vue({
    el: "#main",

    data: {
      images: [],
      form: {
        title: "",
        username: "",
        description: "",
        file: null
      }
    },

    mounted: function() {
      console.log("vue instance has mounted!!!");
      var self = this;

      axios
        .get("/images")
        .then(function(resp) {
          // console.log('response from server', resp.data);
          console.log("SELF in then of axios", self);
          //runs once we recieved response from server
          self.images = resp.data;
          console.log("data: ", resp.data);
          //self == this
        })
        .catch(function(err) {
          console.log("err", err);
        });
    },
    methods: {
      uploadFile: function(e) {
        e.preventDefault();
        console.log("upload file is running");

        //we use formData bc we are working with files.
        var formData = new FormData();
        var self = this;

        formData.append("file", this.form.file);
        formData.append("title", this.form.title);
        formData.append("username", this.form.username);
        formData.append("description", this.form.description);

        axios.post("/upload", formData).then(results => {
          console.log("results: ", results.data[0]);
          self.images.unshift(results.data[0]);
        });
      },

      handleFileChange: function(e) {
        console.log("handleFileChange running!");

        this.form.file = e.target.files[0];
      }
    }
  });
})();
