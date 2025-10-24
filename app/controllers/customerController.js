let moment = require("moment");
const { getNames } = require("country-list");
const customUser = require("../models/customerSchema");

const user_get_index = (req, res) => {
  const status = "index";
  customUser
    .find({ userId: req.session.userId })
    .then((users) => {
      res.render("index", {
        users,
        moment,
        status,
        title: "Homepage",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_get_search = (req, res) => {
  const status = "search";
  customUser
    .find({ userId: req.session.userId })
    .then((users) => {
      res.render("user/search.ejs", {
        users,
        moment,
        status,
        title: "Search",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_get_add = (req, res) => {
  const countryNames = getNames();
  const status = "add";
  res.render("user/add.ejs", {
    countryNames,
    status,
    title: "Add User",
  });
};

const user_get_edit = (req, res) => {
  const countryNames = getNames();
  const status = "edit";
  customUser
    .findById(req.params.id)
    .then((user) => {
      res.render("user/edit.ejs", {
        user,
        moment,
        countryNames,
        status,
        title: "Edit User",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_get_view = (req, res) => {
  const status = "view";
  customUser
    .findById(req.params.id)
    .then((user) => {
      res.render("user/view.ejs", { user, moment, status, title: "View User" });
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_delete = (req, res) => {
  customUser
    .deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_update = (req, res) => {
  customUser
    .updateOne({ _id: req.params.id }, req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_post_add = (req, res) => {
  const customerData = {
    ...req.body,
    userId: req.session.userId
  };
  customUser
    .create(customerData)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

const user_post_search = (req, res) => {
  const searchTerm = req.body.search.trim();
  const status = "search";

  const queryConditions = [
    { firstname: { $regex: searchTerm, $options: "i" } },
    { lastname: { $regex: searchTerm, $options: "i" } },
    { country: { $regex: searchTerm, $options: "i" } },
    { gender: { $regex: searchTerm, $options: "i" } },
  ];

  const searchNumber = parseInt(searchTerm, 10);
  if (!isNaN(searchNumber)) {
    queryConditions.push(
      { age: { $eq: searchNumber } },
      { phone: { $eq: searchNumber } }
    );
  }
  customUser
    .find({
      $and: [
        { userId: req.session.userId },
        { $or: queryConditions }
      ]
    })
    .then((users) => {
      res.render("user/search.ejs", { users, moment, status, title: "Search" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  user_get_index,
  user_get_search,
  user_get_add,
  user_get_edit,
  user_get_view,
  user_delete,
  user_update,
  user_post_add,
  user_post_search,
};
