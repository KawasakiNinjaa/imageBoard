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
  Vue.component("image-modal", {
    //data is a Fn that returns an objct
    props: ["id"],
    data: function() {
      return {
        image: {}, // img and all its data(title, user,etc) loaded form db with corresponding id
        comments: [], //uploaded from db
        form: {
          usercomment: "",
          username: ""
        }
      };
    },
    template: "#modal-template",
    mounted: function() {
      console.log("image-modal has mounted");
      /////////////////////////// gets images
      var self = this;
      axios.get(`/single/image/${this.id}`).then(function(res) {
        console.log("res: ", res);
        console.log("self in then of axios component: ", self);
        self.image = res.data[0];
      });
      //////////////////////// gets comments
      var self = this;
      console.log("self in get-comments: ", self);
      axios.get(`/get-comments/${this.id}`).then(function(res) {
        console.log("res in get-comments: ", res);
        console.log("res.data: ", res.data.rows);
        self.comments = res.data.rows.reverse();
        console.log("self.comments: ", self.comments);
      });
    },

    methods: {
      closeModal: function() {
        this.$emit("close");
      },
      insertComment: function(e) {
        console.log("I'm insertComment");
        let self = this;
        console.log("self in axios insertComment: ", self);
        console.log("username: ", self.form.username);
        e.preventDefault();
        axios
          .post("/insert-comment", {
            usercomment: self.form.usercomment,
            username: self.form.username,
            id: self.id
          })
          .then(function(results) {
            console.log("results in insert-comment: ", results.data.rows[0]);
            self.comments.unshift(results.data.rows[0]);
            self.form.usercomment = "";
            self.form.username = "";
          });
      }
    }
  });

  new Vue({
    el: "#main",

    data: {
      lastId: true,
      showMoreButton: true,
      images: [],
      currentImage: null,
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
          console.log("data: ", resp.data);
          self.images = resp.data[0];
          self.lastId = resp.data[1];
          console.log("lastId: ", resp.data[1]);
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
          self.form.title = "";
          self.form.description = "";
          self.form.username = "";
          self.form.file = "";
        });
      },

      handleFileChange: function(e) {
        console.log("handleFileChange running!");

        this.form.file = e.target.files[0];
      },
      openModal: function(id) {
        console.log("id: ", id);
        this.currentImage = id;
        //this function will open the modal when clicking on on img
      },
      closeModal: function(id) {
        console.log("closing modal");
        this.currentImage = null;
      },
      loadMore: function(e) {
        e.preventDefault();
        var self = this;
        console.log("images.lentgh: ", self.images[self.images.length - 1].id);
        let imgID = self.images[self.images.length - 1].id;
        axios.get(`/loadmore/${imgID}`).then(function(res) {
          console.log("res in loadmore: ", res.data);
          console.log("imgId: ", imgID, "self.lastId: ", self.lastId);
          let wtf = res.data[res.data.length - 1].id;
          if (wtf == self.lastId) {
            self.showMoreButton = null;
          }

          for (var i = 0; i < res.data.length; i++) {
            self.images.push(res.data[i]);
          }
        });
      }
    }
  });
})();
